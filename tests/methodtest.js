"use strict";

const Methods = require("../modules/methods.js");

const test = new Test("Methods Test");
test.add(Methods.VerifyData, {}, { userid: "asdf" });
test.add(Methods.VerifyPermission, {}, ""); // TODO - make this test work

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

test.add(Methods.VerifyScoreIntegrity, {}, ffrScore);
test.add(Methods.VerifyScoreOwnership, {}, "", ffrScore);
