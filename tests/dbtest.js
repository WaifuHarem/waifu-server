
// Database Test scripts
// - Layla

"use strict";

const database = require("../modules/database.js");

const test = new Test("Database Test");
test.add(function() {
    console.log(`ReadyState: ${this._ready}`);
    console.log(`Prodflag: ${this.prod}`);
    console.log(`Mode: ${this.mode}`);
}, database);
test.add(database.ready, {});

for (const i of require("./data/sqltests.json")) {
    test.add(database.query, database, i);
}

test.start();