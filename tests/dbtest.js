
// Database Test scripts
// - Layla

"use strict";

require("../modules/database.js");

const test = new Test("Database Base Test");
test.add(function() {
    console.log(`ReadyState: ${this._ready}`);
    console.log(`Prodflag: ${this.prod}`);
    console.log(`Mode: ${this.mode}`);
}, Database);
test.add(Database.ready, Database);

const tables = ["FFR_Scores", "Users"];

for (const table of tables)
    test.add(Database.query, Database, `DROP TABLE ${table}`);

require("fs").unlinkSync("../conf/testdbready");
test.start(true);
test.reset("Database Query Test");
test.add(Database.init, Database);

for (const [sql, values = null] of require("./data/sqltests.json")) {
    test.add(Database.query, Database, sql, values);
}

test.start();