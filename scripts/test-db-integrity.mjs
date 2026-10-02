import { execFileSync } from "node:child_process";

const productId = "__integrity_test_"+Date.now();

const run = (args, allowFailure = false) => {
  try {
    return execFileSync("npx", ["wrangler", "d1", "execute", "DB", "--local", "--command", args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (e) {
    if (allowFailure) return "";
    process.stderr.write(e.stderr || "");
    throw e;
  }
};

run("PRAGMA quick_check;");\nrun("PRAGMA foreign_keys;");\nrun("DELETE FROM orders WHERE id='__integrity_order__';");
run("DELETE FROM journal_transactions WHERE id='__integrity_tx__';");
run("INSERT INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,unit_cost_minor,stock_qty,reserved_qty,sold_qty,warehouse,active,updated_at) VALUES('"+productId+"','Integrity Test','تست','اختبار','unit','USD',1,100,50,10,0,0,'TEST',1,datetime('now'));");
run("UPDATE products SET reserved_qty=6 WHERE id='"+productId+"';");
const expectFailure = (sql, message) => {
  try {
    execFileSync("npx", ["wrangler", "d1", "execute", "DB", "--local", "--command", sql], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (_) {
    return;
  }
  throw new Error(message);
};

expectFailure("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,created_at) VALUES('bad-movement','"+productId+"','TEST',0,datetime('now'));", "Expected invalid inventory movement guard did not fire.");

expectFailure("UPDATE products SET stock_qty=5 WHERE id='"+productId+"';", "Expected stock-below-reservation guard did not fire.");
run("UPDATE products SET stock_qty=4,reserved_qty=0,sold_qty=6 WHERE id='"+productId+"';");
expectFailure("UPDATE products SET sold_qty=-1 WHERE id='"+productId+"';", "Expected negative-sold guard did not fire.");
expectFailure("INSERT INTO inventory_ledger(id,product_id,movement_type,quantity,created_at) VALUES('orphan-movement','__missing_product__','SALE',1,datetime('now'));", "Expected orphan inventory guard did not fire.");
run("UPDATE products SET stock_qty=9 WHERE id='"+productId+"';");

run("INSERT INTO orders(id,order_no,customer_name,email,currency,created_at,updated_at) VALUES('__integrity_order__','SP-INTEGRITY','Integrity','integrity@example.com','USD',datetime('now'),datetime('now'));");
run("INSERT INTO order_items(id,order_id,product_id,product_name,unit,quantity,unit_price,line_total,unit_price_minor,line_total_minor,unit_cost_minor) VALUES('__integrity_item__','__integrity_order__','paper','Integrity','unit',1,1,1,100,100,50);");
expectFailure("UPDATE order_items SET unit_cost_minor=75 WHERE id='__integrity_item__';", "Expected historical order cost-basis guard did not fire.");
run("DELETE FROM order_items WHERE id='__integrity_item__';");
run("DELETE FROM orders WHERE id='__integrity_order__';");


// Supply-chain milestone lifecycle guard.
run("INSERT INTO supply_cases(id,case_no,quantity,currency,purchase_total_minor,status,created_at,updated_at) VALUES('__integrity_case__','SC-INTEGRITY',1,'USD',100,'open',datetime('now'),datetime('now'));");
run("INSERT INTO supply_milestones(id,case_id,milestone_type,status,created_at,updated_at) VALUES('__integrity_milestone__','__integrity_case__','transport','pending',datetime('now'),datetime('now'));");
run("UPDATE supply_milestones SET status='done' WHERE id='__integrity_milestone__';");
expectFailure("UPDATE supply_milestones SET status='in_progress' WHERE id='__integrity_milestone__';", "Expected terminal supply-milestone guard did not fire.");
run("DELETE FROM supply_milestones WHERE id='__integrity_milestone__';");
run("DELETE FROM supply_cases WHERE id='__integrity_case__';");

// Account structure becomes immutable after journal use.
run("INSERT OR IGNORE INTO accounts(id,name,account_type,currency,current_balance_minor,active,created_at,updated_at) VALUES('__integrity_account__','Integrity Account','cash','USD',0,1,datetime('now'),datetime('now'));");
run("INSERT INTO journal_transactions(id,reference_type,reference_id,description,currency,total_minor,request_id,created_at) VALUES('__integrity_tx__','integrity','__integrity__','Integrity transaction','USD',100,NULL,datetime('now'));");
run("INSERT INTO journal_lines(id,transaction_id,account_id,side,amount_minor,currency,created_at) VALUES('__integrity_line_a__','__integrity_tx__','__integrity_account__','debit',100,'USD',datetime('now'));");
expectFailure("UPDATE accounts SET name='Tampered' WHERE id='__integrity_account__';", "Expected account-structure immutability guard did not fire.");
run("DELETE FROM journal_lines WHERE id='__integrity_line_a__';");
run("DELETE FROM journal_transactions WHERE id='__integrity_tx__';");
run("DELETE FROM accounts WHERE id='__integrity_account__';");

console.log("D1 domain integrity guards: PASS");

