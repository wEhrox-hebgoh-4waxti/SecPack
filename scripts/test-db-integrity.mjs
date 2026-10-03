import { execFileSync } from "node:child_process";

const suffix = Date.now();
const productId = "__integrity_product_"+suffix;
const orderId = "__integrity_order_"+suffix;
const orderNo = "SP-INTEGRITY-"+suffix;
const itemId = "__integrity_item_"+suffix;
const caseId = "__integrity_case_"+suffix;
const caseNo = "SC-INTEGRITY-"+suffix;
const milestoneId = "__integrity_milestone_"+suffix;
const accountId = "__integrity_account_"+suffix;
const txId = "__integrity_tx_"+suffix;
const lineId = "__integrity_line_"+suffix;

const run = (sql) => execFileSync("npx", ["wrangler", "d1", "execute", "DB", "--local", "--command", sql], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

const expectFailure = (sql, message) => {
  try {
    run(sql);
  } catch (_) {
    return;
  }
  throw new Error(message);
};

run("PRAGMA quick_check;");
const fk=run("PRAGMA foreign_keys;");
if(!fk.includes("1")) throw new Error("SQLite foreign-key enforcement is disabled.");
const fkCheck=run("PRAGMA foreign_key_check;");
if(!/No rows returned|0 rows/i.test(fkCheck)) throw new Error("SQLite foreign-key check failed: "+fkCheck);

run("INSERT INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,unit_cost_minor,stock_qty,reserved_qty,sold_qty,warehouse,active,updated_at) VALUES('"+productId+"','Integrity Test','تست','اختبار','unit','USD',1,100,50,10,0,0,'TEST',1,datetime('now'));");
run("UPDATE products SET reserved_qty=6 WHERE id='"+productId+"';");
expectFailure("UPDATE products SET reserved_qty=reserved_qty+5 WHERE id='"+productId+"';", "Expected reservation-over-available guard did not fire.");

expectFailure("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,created_at) VALUES('bad-movement-"+suffix+"','"+productId+"','TEST',0,datetime('now'));", "Expected invalid inventory movement guard did not fire.");
expectFailure("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,created_at) VALUES('bad-type-"+suffix+"','"+productId+"','UNKNOWN',1,datetime('now'));", "Expected invalid inventory movement type guard did not fire.");
expectFailure("UPDATE products SET stock_qty=5 WHERE id='"+productId+"';", "Expected stock-below-reservation guard did not fire.");
run("UPDATE products SET stock_qty=4,reserved_qty=0,sold_qty=6 WHERE id='"+productId+"';");
expectFailure("UPDATE products SET sold_qty=-1 WHERE id='"+productId+"';", "Expected negative-sold guard did not fire.");
expectFailure("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,created_at) VALUES('orphan-movement-"+suffix+"','__missing_product__','SALE',1,datetime('now'));", "Expected orphan inventory guard did not fire.");
run("UPDATE products SET stock_qty=9 WHERE id='"+productId+"';");

run("INSERT INTO orders(id,order_no,customer_name,email,currency,created_at,updated_at) VALUES('"+orderId+"','"+orderNo+"','Integrity','integrity@example.com','USD',datetime('now'),datetime('now'));");
expectFailure("UPDATE orders SET status='ready' WHERE id='"+orderId+"';", "Expected unpaid order -> ready transition guard did not fire.");
run("UPDATE orders SET status='paid',payment_status='paid' WHERE id='"+orderId+"';");
expectFailure("UPDATE orders SET status='fulfilled' WHERE id='"+orderId+"';", "Expected paid -> fulfilled shortcut guard did not fire.");
expectFailure("UPDATE orders SET status='cancelled' WHERE id='"+orderId+"';", "Expected paid -> cancelled without refund guard did not fire.");
run("UPDATE orders SET status='ready' WHERE id='"+orderId+"';");
run("UPDATE orders SET status='fulfilled' WHERE id='"+orderId+"';");
expectFailure("UPDATE orders SET payment_status='unpaid' WHERE id='"+orderId+"';", "Expected paid -> unpaid payment transition guard did not fire.");

run("INSERT INTO order_items(id,order_id,product_id,product_name,unit,quantity,unit_price,line_total,unit_price_minor,line_total_minor,unit_cost_minor) VALUES('"+itemId+"','"+orderId+"','paper','Integrity','unit',1,1,1,100,100,50);");
expectFailure("UPDATE order_items SET unit_cost_minor=75 WHERE id='"+itemId+"';", "Expected historical order cost-basis guard did not fire.");
run("DELETE FROM order_items WHERE id='"+itemId+"';");
run("DELETE FROM orders WHERE id='"+orderId+"';");

run("INSERT INTO supply_cases(id,case_no,quantity,currency,purchase_total_minor,status,created_at,updated_at) VALUES('"+caseId+"','"+caseNo+"',1,'USD',100,'open',datetime('now'),datetime('now'));");
run("INSERT INTO supply_milestones(id,case_id,milestone_type,status,created_at,updated_at) VALUES('"+milestoneId+"','"+caseId+"','transport','pending',datetime('now'),datetime('now'));");
run("UPDATE supply_milestones SET status='done' WHERE id='"+milestoneId+"';");
expectFailure("UPDATE supply_milestones SET status='in_progress' WHERE id='"+milestoneId+"';", "Expected terminal supply-milestone guard did not fire.");
run("DELETE FROM supply_milestones WHERE id='"+milestoneId+"';");
run("DELETE FROM supply_cases WHERE id='"+caseId+"';");

run("INSERT INTO accounts(id,name,account_type,currency,current_balance_minor,active,created_at,updated_at) VALUES('"+accountId+"','Integrity Account','cash','USD',0,1,datetime('now'),datetime('now'));");
expectFailure("INSERT INTO journal_transactions(id,reference_type,reference_id,description,currency,total_minor,request_id,created_at) VALUES('"+txId+"','integrity','"+suffix+"','Integrity transaction','USD',100,NULL,datetime('now'));", "Expected direct posted Journal insertion to be blocked.");
run("INSERT INTO journal_transactions(id,reference_type,reference_id,description,currency,total_minor,request_id,created_at,status) VALUES('"+txId+"','integrity','"+suffix+"','Integrity transaction','USD',100,NULL,datetime('now'),'draft');");
run("INSERT INTO journal_lines(id,transaction_id,account_id,side,amount_minor,currency,created_at) VALUES('"+lineId+"','"+txId+"','"+accountId+"','debit',100,'USD',datetime('now'));");
expectFailure("UPDATE journal_transactions SET status='posted' WHERE id='"+txId+"';", "Expected unbalanced Journal posting guard did not fire.");
const creditLineId="__integrity_credit_"+suffix;
run("INSERT INTO journal_lines(id,transaction_id,account_id,side,amount_minor,currency,created_at) VALUES('"+creditLineId+"','"+txId+"','"+accountId+"','credit',100,'USD',datetime('now'));");
run("UPDATE journal_transactions SET status='posted' WHERE id='"+txId+"' AND status='draft';");
expectFailure("INSERT INTO journal_transactions(id,reference_type,reference_id,description,currency,total_minor,request_id,created_at,status) VALUES('__integrity_duplicate_tx_"+suffix+"','integrity','"+suffix+"','Duplicate event','USD',100,NULL,datetime('now'),'draft');", "Expected duplicate business-event Journal guard did not fire.");
expectFailure("UPDATE accounts SET current_balance_minor=999999 WHERE id='"+accountId+"';", "Expected account-balance reconciliation guard did not fire.");
expectFailure("UPDATE accounts SET name='Tampered' WHERE id='"+accountId+"';", "Expected account-structure immutability guard did not fire.");

// Journal rows are intentionally NOT deleted: append-only accounting is itself under test.
// The local database is disposable and each CI run gets a fresh migration state.

expectFailure("DELETE FROM products WHERE id='"+productId+"';", "Expected product-history deletion guard did not fire.");

console.log("D1 domain integrity guards: PASS");
