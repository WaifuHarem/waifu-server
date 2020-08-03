"use strict";

const receive = require("../modules/parser.js");

class TestRequest {
	constructor(id, op, data = {}) {
		this.userid = id;
		this.opcode = op;
		this.data = data;
	}
}

const test = new Test("Parser Test");
test.add(receive, {}, new TestRequest("1", 0));

// TODO - implement tests for remaining parser keys