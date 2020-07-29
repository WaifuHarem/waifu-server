
// Process Manager module
// Used as a wrapper for subprocess io and task management
// - Layla
// v0.0.2

"use strict";

const child_process = require("child_process");
const processes = new Map();

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

    send(data) {
        this.process.send(data);
    }

    static Create(path, args, options, listener) {
        let pr = new ProcessWrapper(
            processes.size, // id - probably dumb
            child_process.fork(path, args, options), // process
            listener // receive method
        );
        processes.set(processes.size, pr);
        return pr;
    }
}

module.exports = ProcessWrapper;