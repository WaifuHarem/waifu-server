
// Logger Module
// Used to manage crash, logs, and notifications of the server.
// - Layla
// v0.0.2

"use strict";

const fs = require("fs");

/* // TODO - make this actually work - actually just integrate into a storage and memory manager
if (fs.statSync(`./logs/${file}`).size / (1000 * 1000) >= 50)
		console.log(`./logs/${file} has exceeded 50MBs, it will be cleared at 100MBs...`);
 */

try {
	fs.mkdirSync("./logs");
} catch (err) {}

try {
	fs.mkdirSync("./logs/tests");
} catch (err) {}

try {
	fs.writeFileSync("./logs/crash.log", "");
} catch (err) {}

try {
	fs.writeFileSync("./logs/process.log", "");
} catch (err) {}

try {
	fs.writeFileSync("./logs/console.log", "");
} catch (err) {}

function log(msg, write = false, notify = false) {
	let now = Date();
	let output = `[Server] - ${now}\n${msg}\n${notify ? "Administrator Notification Sent.\n": ""}`;
	console.log(output);
	if (write)
		fs.writeFileSync("./logs/console.log", output,{encoding: "utf8", flag: "a"});
	// TODO - Add Administrator Notifications
}

function plog(input, output, consoleout = false) {
	let now = Date();
	let msg = `${now} - {${input}}:{${output}}`;
	if (consoleout)
		console.log(msg);
	fs.writeFileSync("./logs/process.log", msg,{encoding: "utf8", flag: "a"});
}

function crash(err, msg = false, notify = false, fatal = false) {
	let now = Date(),
		stack = err.stack || err;
	let output = `[Server Crash] - ${now}\n\n${msg ? `Error Message: ${msg + "\n\n"}` : ""}Stacktrace:\n${stack}\n\n${notify ? "Administrator Notification Sent.\n" :""}${fatal ? "Fatal Error, Closing server...\n" : ""}`;
	console.error(output);
	fs.writeFileSync("./logs/crash.log", output,{encoding: "utf8", flag: "a"});
	// TODO - Add Administrator Notifications
	if (fatal)
		process.exit();
}

module.exports = {
	crash,
	plog,
	log
};