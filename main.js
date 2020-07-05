"use strict";

// Start logger
const { crash, log, plog } = require("./modules/logger");
global.Crash = crash;
global.Log = log;
global.pLog = plog;
process.on("uncaughtException", err => crash(err, "uncaughtException"), true);

// Read Config
global.config = require.resolve("./conf/config.js");
if (config.watchconfig) {
    const fs = require("fs");
    let configPath = require.resolve("./conf/config.js");
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

// Load Database Manager
const database = require("/modules/database.js");

// Load Parser
const parser = require("./modules/parser.js");

// Mini Process Manager. Mostly pointless but in place in the event the db is moved to a different process.
const child_process = require("child_process");
const processes = new Map();

// Process Wrapper - TODO add a server health query
class ProcessWrapper {
    constructor(id, subProcess, receive) {
        this.id = id;
        this.process = subProcess;
        this.receive = receive;

        this.process.on("message", async function(task) {
            task.data = await this.receive(task.data);
            this.process.send(task);
        }.bind(this));
    }

    health() {
        // TODO - track concurrent and recent tasks
        return `Process Wrapper ${this.id}`
    }
}

// Spawn Server
processes.set(processes.size, new ProcessWrapper(
    processes.size, // id - probably dumb
    child_process.fork("./modules/server", [], {cwd: __dirname}), // process
    parser.receive.bind(this) // receive method
));



/*
global.context = this; //For Eval - Bad Practice, I know

global.toId = function(str) {
    return ('' + str).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
*/
