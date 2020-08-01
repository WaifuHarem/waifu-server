"use strict";

const Methods = require("../modules/methods.js");

const test = new Test("Methods Test");
test.add(Methods.VerifyData, {}, { userid: "asdf" });
test.add(Methods.VerifyPermission, {}, "223180420114546690", 6, 0).assert(val => {return val === true});
test.add(Methods.VerifyPermission, {}, "454325432", 0, 2).assert(val => {return val === false});


// Test FFR Score
const ffrScore = {
	game: 3,
	date: 1,
	player: "Lights",
	title: "string",
	artist: "string",
	creator: "string",
	combo: 3,
	w0: 1,
	w1: 1,
	w2: 1,
	w3: 1,
	w4: 1,
	w5: 1,
	equiv: 1,
	raw: 1
};

test.add(Methods.VerifyScoreIntegrity, {}, ffrScore).assert(val => {return val === true});
test.add(Methods.VerifyScoreOwnership, {}, "223180420114546690", ffrScore).assert(val => {return val === true});
test.add(Methods.VerifyRegistration, {}, "223180420114546690").assert(val => {return val === true});
test.add(Methods.VerifyRegistration, {}, "432543").assert(val => {return val === false});
test.add(Methods.VerifyAdmin, {}, "223180420114546690").assert(val => {return val === true});
test.add(Methods.VerifyAdmin, {}, "432543").assert(val => {return val === false});
test.add(Methods.VerifyScoreOwnership, {}, "65435463", ffrScore).assert(val => {return val === false});
test.add(Methods.HashScore, {}, ffrScore);

const query = ["INSERT INTO FFR_Scores(UserID, SongHash, Quarantine, Player, Title, Artist, Creator, W0, W1, W2, W3, W4, W5, Equiv, Raw, TimeAchieved) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
	["223180420114546690", "", 0, "Lights","string","differentstring","string",3,1,1,1,1,1,1,1,1,1]];

test.add(Methods.AddScore, {}, query).assert(val => {return val === false});
test.add(Methods.toId, {}, "Lights-").assert(val => {return val === "lights"});
test.start();
