"use strict";

require("../modules/global.js");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");

const prod = Boolean(global.prod);
const mode = prod ? "prod" : "test";

function wrapper() {
    console.log(`Starting initdb in ${prod ? "production" : "test"} mode.`);
    try {
        if (fs.existsSync(path.join(process.cwd(), `${mode}dbready`)))
            return true;
        const query = (
            function() {
                let data;
                try {
                    data = fs.readFileSync(path.resolve("./", "data", `init_${mode}.sql`));
                } catch (e) {
                    data = "";
                    console.error("Unable to load initdb sql scripts. Fatal.");
                    console.error(e);
                }
                return data;
            }
        )();
        if (!query)
            process.exit();
        let connection = mysql.createConnection(config.connection[Number(prod)]);

        connection.on("error", function(err) {
            connection.destroy();
            console.error(err);
        });

        connection.connect(function(err) {
            if (err) {
                connection.destroy();
                console.error(err);
            }
            if (!prod)
                console.log(`Query: ${query}`);
            connection.query(query, (err) => {
                if (err) {
                    console.error("Unable to initialize MySQL Database. Fatal.");
                    console.error(err);
                    connection.destroy();
                    process.exit();
                }
                console.log("MySQL Database Initialized.");
                fs.writeFileSync(path.join(process.cwd(), `${mode}dbready`), "");
                connection.end();
            });
        });
    } catch (e) {
        console.error(e);
    }
}

wrapper();