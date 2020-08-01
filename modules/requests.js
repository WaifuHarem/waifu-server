
// Request Module
// Module in charge of requesting Score data from gameserver backends
// as well as ratelimiting and queueing requests.
// - Layla
// v0.0.1
// Not ready for implementation

"use strict";

require("./global.js");
const { Task, tasks } = require("./task.js");
const prod = Boolean(global.prod);
const RateLimit = prod ? 3 : 1; // Requests per minute per API

class mgr {
	constructor() {
		this.last = 0;
		this.queue = 0;
	}
}

class Requests {
	constructor() {
		this.etterna = new mgr();
		this.quaver = new mgr();
		this.osu = new mgr();
		this.ffr = new mgr();
		// Robeats unsupported
	}
}

process.on("message", (reply) => {
	if (tasks.has(reply.id))
		tasks.get(reply.id).then(reply);
});