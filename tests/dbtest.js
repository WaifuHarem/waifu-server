
// Database Test scripts
// - Layla

"use strict";

require("../modules/database.js");

const test = new Test("Database Test");
test.add(function() {
    console.log(`ReadyState: ${this._ready}`);
    console.log(`Prodflag: ${this.prod}`);
    console.log(`Mode: ${this.mode}`);
}, Database);
test.add(Database.ready, {});

for (const [sql, values = null] of require("./data/sqltests.json")) {
    test.add(Database.query, Database, sql, values);
}

test.start();