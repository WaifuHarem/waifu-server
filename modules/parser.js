
// Parser Module
// Receives messages from server for processing and sends a reply back
// - Layla

"use strict";

const Methods = require("./methods");

// Error Codes - TODO put this somewhere else
// 0 = No Error
// 1 = Bad Request
// 2 = Invalid Request Source
// 3 = Unauthorized Request
// 4 = Invalid Score

// All Operations ABSOLUTELY must return a promise that resolves to an object containing:
// {
//      code: int
//      data: json-string (optional)
// }

class Operations {
    constructor() {} // Static

    static AddScore(userid, scoreData) {
        return new Promise(async function(resolve, reject) {
            if (!scoreData || typeof scoreData !== "object")
                return reject(1);
            if (!Methods.VerifyScoreIntegrity(scoreData) || !Methods.VerifyScoreOwnership(userid, scoreData))
                return reject(4);
        }).catch(function(err) {
            Crash(err, "Received data that cannot be processed.");
            return {code: err};
        });
        // TODO
        // Add a parsed score to leaderboard table
    }

    static FetchPlayerScores() {
        // TODO
        // Fetches top scores for a player. Can be all games or just 1
        // Can also specify a particular chart to get a players score
    }

    static FetchSongLeaderboard() {
        // TODO
        // Fetches the leaderboards for an individual chart
    }
}

// Outward-facing Parser function
function receive(data) {
    return new Promise(async function(resolve, reject) {
        let err_code = Methods.VerifyData(data);
        if (err_code)
            return reject(err_code);

        if (!data.opcode)
            return resolve({code: 0}); // No-op

        if (await !Methods.VerifyPermission.call(this, data.userid, data.opcode))
            return resolve({code: 3}); // Unauthorized Request

        let reply = null;
        switch(data.opcode) {
            case 1: reply = await Operations.AddScore(data.userid, data.data || null); break;

            default: reply = {code: 0};
        }
        return resolve(reply);
    }).catch(err => {
        Crash(err, "Received data that cannot be processed.");
        return {code: err};
    });
}

module.exports = receive;