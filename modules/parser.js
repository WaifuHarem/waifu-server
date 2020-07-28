
// Parser Module
// Receives messages from server for processing and sends a reply back
// - Layla
// v0.0.1

"use strict";

// TODO - A lot

const Methods = require("./methods");
//const Requests = require("./requests");

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

            // Ensure Score Data is correct
            if (!scoreData || typeof scoreData !== "object")
                return reject(1);
            scoreData.quarantine = scoreData.quarantine || false;
            if (!Methods.VerifyScoreIntegrity(scoreData) || !Methods.VerifyScoreOwnership(userid, scoreData))
                return reject(4);

            // Query Nessecary backend API (if available) for backend Data
            //if (gameData.game !== 5) { // May eventually split this into methods func
            //    Requests.API[gameData.game].getScore(gameData);
            //}
            //Requests.send()
            // TODO To Implement

            // Input Data into database
            let query = [];
            let hash = Methods.HashScore(scoreData);
            switch(scoreData.game) { // Rejections are temporary until implementation
                default:
                case 0: return reject(4);
                case 1: return reject(0); break;
                case 2: return reject(0); break;
                case 3:
                    query.push("INSERT INTO FFR_Scores(ScoreHash, UserID, Quarantine, Player, Title, Artist, Creator, W0, W1, W2, W3, W4, W5, Equiv, Raw, TimeAchieved) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
                    query.push([hash, userid, scoreData.quarantine, scoreData.player, scoreData.title, scoreData.artist, scoreData.creator, scoreData.W0, scoreData.W1, scoreData.W2, scoreData.W3, scoreData.W4, scoreData.W5, scoreData.equiv, scoreData.raw, scoreData.date]);
                    break;
                case 4: return reject(0); break;
                case 5: return reject(0); break;
            }
            // TODO initiate query
        }).catch(function(err) {
            Crash(err, "Received data that cannot be processed.");
            return {code: err};
        });
        // TODO
        // Add a parsed score to leaderboard table
    }

    static RemoveScore() {

    }

    static Fetch() {
        // TODO
        // Fetches top scores for a player. Can be all games or just 1
        // Can also specify a particular chart to get a players score
    }

    static Session() {
        //  TODO - Later implementation
    }

    static Multiplayer() {
        // TODO - Later implementation
    }

    static Register(userid, username, profilelink) {

    }

    static Deregister(userid, ban = false) {

    }
}

// Outward-facing Parser function
function receive(data) {
    return new Promise(async function(resolve, reject) {
        if (!Methods.VerifyData(data))
            return reject(1);

        if (!data.opcode)
            return resolve({code: 0}); // No-op

        if (await !Methods.VerifyPermission.call(this, data.userid, data.opcode, data.auth || 0))
            return resolve({code: 3}); // Unauthorized Request

        let reply = null;
        switch(data.opcode) {
            case 1: reply = await Operations.AddScore(data.userid, data.data || null); break;
            case 2: reply = await Operations.RemoveScore(); break;
            case 3: reply = await Operations.Fetch(); break;
            case 4: reply = await Operations.Session(); break;
            case 5: reply = await Operations.Multiplayer(); break;
            case 6: reply = await Operations.Register(); break;
            case 7: reply = await Operations.Deregister(); break;
            default: reply = {code: 0};
        }
        return resolve(reply);
    }).catch(err => {
        Crash(err, "Received data that cannot be processed.");
        return {code: err};
    });
}

module.exports = receive;