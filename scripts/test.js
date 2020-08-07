"use strict";

console.log("This file a commit test file for linting and automation purposes only. Not for inclusion in the server.");

// Properly linted

let test = "true";

// Improperly linted

function testfun() {
	test = "true";
}