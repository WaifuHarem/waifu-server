"use strict";

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

    static Create(path, args, options, listener) {
        processes.set(processes.size, new ProcessWrapper(
            processes.size, // id - probably dumb
            child_process.fork(path, args, options), // process
            listener // receive method
        ));
    }
}

module.exports = ProcessWrapper;