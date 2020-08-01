
// Server Module
// Creates an HTTP server for a parent process and sends messages upward
// - Layla
// v0.0.2

"use strict";

require("./global.js");
const { Task, tasks } = require("./task.js");
const prod = Boolean(global.prod);

// Setup Server

const http = require("http");

function listener(req, res) {
	req.on("data", data => {
		data = data.toString();

		if (!prod) {
			console.log("received data");
			console.log(data);
		}

		let task = new Task(Date.now(), JSON.parse(data), {});
		console.log(`task ${task.id} created`);
		task.then = reply => {
			res.writeHead(200, task.header);
			res.end(JSON.stringify(reply.data));
			console.log(`task ${task.id} destroyed`);
			task.emit("destroy");
		};
		task.on("destroy", () => tasks.delete(task.id));
		tasks.set(task.id, task);
		process.send({id: task.id, data: task.data});
	});
}

process.on("message", (reply) => {
	if (tasks.has(reply.id))
		tasks.get(reply.id).then(reply);
});

const server = http.createServer(listener);

server.on("error", err => {throw err;});
server.listen(8000);
console.log(`HTTP server in ${prod ? "production" : "test"} mode listening on port 8000`);

if (require.main !== module) {
	module.exports = {
		server,
		listener,
		tasks
	};
}