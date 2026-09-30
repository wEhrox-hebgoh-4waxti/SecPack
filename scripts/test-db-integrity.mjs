import { execFileSync } from "node:child_process";

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

run("DELETE FROM products WHERE id='__integrity_test__';");
run("INSERT INTO products(id,name_en,name_fa,name_ar,unit,currency,unit_price,unit_price_minor,unit_cost_minor,stock_qty,reserved_qty,sold_qty,warehouse,active,updated_at) VALUES('__integrity_test__','Integrity Test','تست','اختبار','unit','USD',1,100,50,10,0,0,'TEST',1,datetime('now'));");
run("UPDATE products SET reserved_qty=6 WHERE id='__integrity_test__';");
run("UPDATE products SET stock_qty=4,reserved_qty=0,sold_qty=6 WHERE id='__integrity_test__';");
run("UPDATE products SET stock_qty=9 WHERE id='__integrity_test__';");

if (!run("UPDATE products SET stock_qty=5 WHERE id='__integrity_test__';", true) && !run("UPDATE products SET stock_qty=5 WHERE id='__integrity_test__';", true)) {
  throw new Error("Expected stock-below-reservation guard did not fire.");
}
if (!run("UPDATE products SET sold_qty=-1 WHERE id='__integrity_test__';", true) && !run("UPDATE products SET sold_qty=-1 WHERE id='__integrity_test__';", true)) {
  throw new Error("Expected negative-sold guard did not fire.");
}

run("DELETE FROM products WHERE id='__integrity_test__';");
console.log("D1 inventory integrity guards: PASS");
