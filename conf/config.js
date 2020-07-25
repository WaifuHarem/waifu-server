
// Config Global Module
// Holds global settings used across the server.
// - Layla

"use strict";

const fs = require("fs");

const config = {
    watchconfig: true,
    keys: [
        0, // No-op
        1, // Addscore
        2, // Remove Score
        0, // Fetch -  ratelimited to prevent abuse
        2, // Session
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
    supportedIPs: ["localhost"],
    connection: [require("./dbtest.json"), require("./dbprod.json")],
    testlogs: "waifu-server/logs/tests/"
};

module.exports = config;