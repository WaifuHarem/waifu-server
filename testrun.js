"use strict";

const exec = require("child_process").execSync;
let errors = 0, stdout, curerr;

function processoutput(stdout) {
	let line = stdout.toString().split("\n").reverse()[1];
	return !line.startsWith("Cannot") ? Number(line.split(": ")[1]) : -1;
}

function phase1() {
	stdout = exec("npm run testwrapper");
	curerr = processoutput(stdout);
	console.log(`Testwrapper: ${Boolean(curerr) ? "Failed" : "Passed"}`);
	errors += curerr;

	stdout = exec("npm run servertest");
	curerr = processoutput(stdout);
	console.log(`Servertest: ${Boolean(curerr) ? "Failed" : "Passed"}`);
	errors += curerr;

	stdout = exec("npm run dbtest");
	curerr = processoutput(stdout);
	if (curerr === -1) {
		console.log("Current environment is not configured for the database module.");
		return false;
	}
	console.log(`DBtest: ${Boolean(curerr) ? "Failed" : "Passed"}`);
	errors += curerr;
	return !Boolean(errors);
}

function phase2() {
	stdout = exec("npm run methodtest");
	curerr = processoutput(stdout);
	console.log(`Methodtest: ${Boolean(curerr) ? "Failed" : "Passed"}`);
	errors += curerr;
	return !Boolean(errors);
}

function phase3() {
	stdout = exec("npm run parsertest");
	curerr = processoutput(stdout);
	console.log(`Parsertest: ${Boolean(curerr) ? "Failed" : "Passed"}`);
	errors += curerr;
	return !Boolean(errors);
}

function run() {
	console.log("Initialiting waifu-server testrun.");

	let alive = phase1();
	if (!alive) {
		console.error("Unable to continue testrun. DBtest must pass.");
		process.exit();
	}

	alive = phase2();
	if (!alive) {
		console.error("Unable to continue testrun. Methodtest must pass.");
		process.exit();
	}

	alive = phase3();
	console.log(`Testrun finished\nCore Test: ${alive ? "Passed" : "Failed"}\nTotal Failed Tests: ${errors}`);
	process.exit();
}

run();

