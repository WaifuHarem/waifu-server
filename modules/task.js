
// Task Module
// Exports class for managing IPC tasks
// - Layla
// v0.0.2

"use strict";

const tasks = new Map();

class Task extends require("events") {
	constructor(data) {
		super();
		this.id = Task.genCode(16);
		this.data = data;
		this.then = null;

		setTimeout(() => {
			this.emit("destroy");
		}, 1000 * 60 * 5);
	}

	static genCode(t) {
		const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let str = "";
		while(str.length < t)
			str += chars.charAt(Math.floor(Math.random() * chars.length));
		return str;
	}
}

module.exports = { Task, tasks };