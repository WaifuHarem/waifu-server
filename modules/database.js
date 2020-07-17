"use strict";

const mysql = require("mysql");

const prod = Boolean(global.prod);

class Database {
    constructor() {} // Static

    static initDB() {
        const initscript = (
            function() {
                const path = require("path");
                const fs = require("fs");
                let data;
                try {
                    data = fs.readFileSync(path.join(process.cwd(), "data", "init_" + (prod ? "prod" : "test") + ".sql"));
                } catch (e) {
                    data = "";
                    console.error("Unable to load initdb sql scripts. May be fatal");
                    console.error(e);
                }
                return data;
            }
        )();

        if (!initscript) return false;

        return new Promise((resolve, reject) => {
            Database.query(initscript, err => {
                console.log("Initscript finished");
                if (err)
                    return reject(err);
                resolve(true);
            });
        }).catch((err) => {
            Crash(err);
            return false;
        })
    }

    static query(sql, callback) {
        let connection = mysql.createConnection(config.connection[Number(prod)]);

        connection.on("error", function(err) {
            console.error("Mysql Err", err);
            if (callback) callback(false);
            return connection.destroy();
        });

        connection.connect(function(err) {
            if (err) {
                console.error("MySQL Connect Error", err);
                if (callback) callback(false);
                return connection.destroy();
            }

            function a(connection, str, callback) {
                connection.query(str, function(err, rows) {
                    if (err) console.error("MySQL Query Error", err);
                    return callback((err || !rows || !rows[0]) ? null : rows);
                });
            }

            let queries = 0,
                callbacks = [];
            if (typeof sql == "object") {
                queries = sql.length;
            } else {
                queries = 1;
                sql = [sql];
            }

            for (let i = 0; i < queries; i++) {
                a(connection, sql[i], c => {
                    callbacks.push(c);
                    if (callbacks.length === queries) {
                        connection.end();
                        return callback(queries === 1 ? callbacks[0] : callbacks);
                    }
                });
            }
        });
    }
};

module.exports = function() {
    return new Promise(async (resolve, reject) => {
        let result = await Database.initDB();
        if (!result)
            Crash("Unable to Startup database module. Fatal", false, false, true);
        return Database;
    });
};