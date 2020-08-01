
// Server Test
// - Layla

"use strict";

const { server, listener, tasks } = require("../modules/server.js");

const test = new Test("Server Test");
test.add(console.log, {}, server,);
test.add(console.log, {}, listener);
test.add(function() {
	return new Promise((resolve) => {
		const req = new (require("events"))();
		const res = new function() {
			this.writeHead = function(){
				console.log("writeHead called");
			};
			this.end = function(){
				console.log("end called");
			};
		};
		listener(req, res);
		req.emit("data", "{\"test\": true }");
		setTimeout(() => {
			let task = tasks.values().next().value;
			task.on("destroy", () => {
				console.log("destroy called");
				resolve("omgyay");
			});
			task.then("{\"data\": {}}");
		}, 250);
		setTimeout(() => {
			throw "failure";
		}, 1000);
	});
}, {});
test.start();
