const fs = require("fs");
let ips, groups;

try {
    ips = fs.readFileSync("./ips.csv");
    ips = ips.split(",");
} catch (err) {
    console.log("unable to open ips.csv, writing new");
    fs.writeFileSync("./ips.csv", "0.0.0.0,localhost");
    ips = "";
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
    connection: [
        {
            // Test DB
        },
        {
            // Prod DB
        }
    ]
};

module.exports = config;