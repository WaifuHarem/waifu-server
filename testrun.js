"use strict";

const exec = require("util").promisify(require("child_process").exec);
console.log("Initialiting waifu-server testrun.");
let errors = 0;

async function phase1() {
	let code = await exec("npm run testwrapper", {cwd: "./tests"});
	console.log(`Testwrapper: ${code ? "Failed" : "Passed"}`);
	errors += code;

	code = await exec("npm run servertest", {cwd: "./tests"});
	console.log(`Servertest: ${code ? "Failed" : "Passed"}`);
	errors += code;

	code = await exec("npm run dbtest", {cwd: "./tests"});
	console.log(`DBtest: ${code ? "Failed" : "Passed"}`);
	errors += code;
	return !code;
}

let alive = phase1();

if (!alive) {
	console.error("Unable to continue testrun. DBtest must pass.");
	process.exit();
}

async function phase2() {
	let code = await exec("npm run methodtest", {cwd: "./tests"});
	console.log(`Methodtest: ${code ? "Failed" : "Passed"}`);
	errors += code;
	return !code;
}

alive = phase2();

if (!alive) {
	console.error("Unable to continue testrun. Methodtest must pass.");
	process.exit();
}

async function phase3() {
	let code = await exec("npm run parsertest", {cwd: "./tests"});
	console.log(`Parsertest: ${code ? "Failed" : "Passed"}`);
	errors += code;
	return !code;
}

alive = phase3();

console.log(`Testrun finished\nCore Test: ${alive ? "Passed" : "Failed"}\nTotal Failed Tests: ${errors}`);
process.exit();

