"use strict";

require("../modules/global.js");
global.assert = require("assert");

class Test {
	constructor(name) {
		this.name = name;
		this.tests = [];
		this.kill = true;
	}

	add(...args) {
		let task = new _Task(...args || [()=>{},{}]);
		this.tests.push(task);
		return task;
	}

	start(keepalive) {
		if (keepalive)
			this.kill = false;
		console.log(`Starting test for "${this.name}"`);
		let finished = 0;
		for (let i = 0; i < this.tests.length; i++) {
			this.tests[i].on("done", () => {
				console.log(`Test ${i} finished`);
				if (++finished === this.tests.length)
					this.resolve();
			});
			this.tests[i].run(i);
		}
	}

	resolve() {
		console.log(`Concluded test for "${this.name}"`);
		let res;
		let errors = 0;
		for (let i = 0; i < this.tests.length; i++) {
			res = this.tests[i].report();
			errors += Number(!res[0]);
			console.log(`Test ${i + 1}:\n\tPass = ${res[0]}\n\tValue = ${res[1]}\n`);
		}
		console.log(`Total errors: ${errors}`);
		this.log(errors);
		if (this.kill)
			process.exit(errors !== 0 ? 1 : 0);
	}

	log(errors) {
		let time = new Date().toUTCString();
		let file = `Test Report of "${this.name}"\n\nTest Summary:\n\tTime: ${time}\n\t${!errors ? "Passed" : `Failed\n\tTotal errors: ${errors}`}\n\tTotal tests conducted: ${this.tests.length}\n\nTest Results:\n`;
		let data;
		for (let i = 0; i < this.tests.length; i++) {
			data = this.tests[i].log();
			file += `Test ${i + 1}:\n\t${data.pass ? "Passed" : "Failed"}\n\t`;
			if (data.pass) {
				file += `Value: ${data.value}\n\t`;
			} else {
				file += `Error: ${data.error}\n\t`;
			}
			file += `Function: ${data.ptr}\n\tContext: ${data.context}\n\tArgs: ${data.args}\n\n`;
		}
		file += "End of Test Report";
		let path = require("path").resolve("../", config.testlogs, `${this.name}_${time}.log`);
		require("fs").writeFileSync(path, file);
	}

	reset(name) {
		this.name = name;
		this.tests = [];
		this.kill = true;
	}
}

class _Task extends require("events") {
	constructor(func, context, ...args) {
		super();
		this.pass = false;
		this.finished = false;
		this.value = false;
		this.ptr = func;
		this.context = context || this;
		this.args = args || [];
		this.error = "";
		this.assertions = [];
	}

	report() {
		if (!this.finished)
			return [undefined, undefined];
		return [this.pass, this.pass ? this.value : this.error];
	}

	async run(index = 0) {
		console.log(`Running Test ${index + 1} with:\n\tfunc ptr: ${this.func}\n\tctx: ${this.ctx}\n\targs: ${this.args}\n`);
		let ret;
		try {
			// Use await to support promise functions
			ret = await this.ptr.call(this.context, ...this.args);
			for (const [expr, ctx] of this.assertions) {
				if (!expr.call(ctx, ret))
					throw Error(`Assertion '${expr}' failed with input ${ret}`);
			}
			this.pass = true;
		} catch (err) {
			this.error = err;
			ret = null;
		} finally {
			this.value = ret;
			this.finished = true;
			this.emit("done");
		}
	}

	assert(expr, ctx = this) {
		this.assertions.push([expr, ctx]);
		return this;
	}

	log() {
		return {
			pass: this.pass,
			value: this.value,
			ptr: String(this.ptr),
			context: this.context,
			args: this.args,
			error: this.error
		};
	}
}

if (require.main === module) {
	const test = new Test("Test Wrapper");
	test.add(Crash, {}, "non-notif crash", new Error().stack, false);
	test.add(Crash, {}, "notif crash", new Error().stack, true);
	test.add(Log, {}, "testlog-nonwritten");
	test.add(Log, {}, "testlog-written", true);
	// TODO Test pLog
	test.add(console.log, {}, config);
	test.start();
} else {
	global.Test = Test;
}