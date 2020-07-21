
// Database Module
// Handles database queries and maintains a connection pool.
// - Layla

"use strict";

if (!global.loaded)
    require("./global.js");

class Database {
    constructor() {
        this._ready = false;
        this.prod = Boolean(global.prod);
        this.mode = this.prod ? "prod" : "test";

        const mariadb = require("mariadb");
        this.pool = mariadb.createPool(config.connection[Number(prod)]);

        // Database init
        if (!require("fs").existsSync(`./${this.mode}dbready`)) {
            (async (sql) => {
                let connection;
                try {
                    connection = await this.pool.getConnection();
                    await connection.query(sql);
                    require("fs").writeFileSync(`./${this.mode}dbready`, "");
                    this._ready = true;
                } catch (e) {
                    if (connection)
                        connection.release();
                    Crash("Unable to initialize DB, Fatal.", e, true, true);
                }

            })((
                function () {
                    let data;
                    try {
                        data = require("fs").readFileSync(`./data/init_${this.mode}.sql`);
                    } catch (e) {
                        data = "";
                        Crash("Unable to load DB Init, Fatal.", e, true, true);
                    }
                    return data;
                }
            )());
        }
    }

    ready() {
        return new Promise((resolve, reject) => {
            let interval, timeout;
            let tryready = function() {
                if (this._ready) {
                    if (interval && interval.clearInterval)
                        interval.clearInterval();
                    if (timeout && timeout.clearTimeout)
                        timeout.clearTimeout();
                    return resolve(true)
                }

            };
            timeout = setTimeout(() => {
                if (interval && interval.clearInterval)
                    interval.clearInterval();
                return reject();
            }, 3000);
            interval = setInterval(tryready, 200);
        }).catch(() => {
            Log("Database not ready for over 3 seconds!", false, true);
            return false;
        });
    }

    query(sql, values = null) {
        let connection;
        return new Promise(async (resolve) => {
            if (!await this.ready())
                return null;
            connection = await this.pool.getConnection();
            resolve(await connection.query(...values ? [ sql, values ] : [ sql ]));
        }).catch(err => {
            Crash("Mysql Err", err);
            connection.destroy();
            return null;
        });
    }
};

global.Database = new Database();