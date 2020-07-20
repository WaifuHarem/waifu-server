const fs = require("fs");
let ips, connection = [];

try {
    ips = fs.readFileSync("./conf/ips.csv");
    ips = ips.split(",");
} catch (err) {
    console.log("unable to open ips.csv, writing new");
    fs.writeFileSync("./conf/ips.csv", "0.0.0.0,localhost");
    ips = "";
}

try {
    connection.push(
        JSON.stringify(
            fs.readFileSync("./conf/dbtest.json", "utf8")
        )
    );
    connection.push(
        JSON.stringify(
            fs.readFileSync("./conf/dbprod.json", "utf8")
        )
    );
} catch (err) {
    console.error("unable to open to initialize database connection options, exiting...");
    process.exit();
}

const config = {
    watchconfig: true,
    keys: [
        0, // No-op
        1, // Addscore
        2, // Remove Score
        0, // Fetch -  ratelimited to prevent abuse
        2, // Suggest
        2, // Multiplayer
        2, // Register User
        2, // Deregister User
    ],
    auth: [
        {
            name: "Unregistered"
        },
        {
            name: "Registered"
        },
        {
            name: "Administrator"
        }
    ],
    supportedIPs: ips || [],
    connection,
    testlogs: "logs/tests/"
};

module.exports = config;