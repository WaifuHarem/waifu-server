"use strict";
/*
const mysql = require("mysql");

class Database {
    constructor() {} // Static

    static query(sql, callback) {
        let connection = mysql.createConnection(config.connection);

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

module.exports = Database;
*/