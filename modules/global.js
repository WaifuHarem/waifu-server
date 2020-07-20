
// Global Setup

"use strict";

// Determine runtime mode
global.prod = false;
if (process.argv.length >= 3) {
    switch(process.argv[2]) {
        case "prod": global.prod = true; break;
        case "test": require("../tests/testwrapper.js"); break;
    }
}

// Start logger
const { crash, log, plog } = require("./logger");
global.Crash = crash;
global.Log = log;
global.pLog = plog;
process.on("uncaughtException", err => crash(err, "uncaughtException"), true);

// Read Config
global.config = require.resolve("../conf/config.js");
if (config.watchconfig) {
    const fs = require("fs");
    let configPath = require.resolve("../conf/config.js");
    fs.watchFile(configPath, (curr, prev) => {
        if (curr.mtime <= prev.mtime) return;
        try {
            delete require.cache[configPath];
            global.config = require(configPath);
            console.log("Reloaded login server settings");
        } catch (e) {
            console.error("Error reloading server settings. config.watchconfig disabled until restart");
            console.error(e.stack);
            fs.unwatchFile(configPath);
        }
    });
}