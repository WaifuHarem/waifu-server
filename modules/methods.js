
// Methods Static Class
// Utility functions for Parser.js
// - Layla
// v0.0.2

"use strict";

const Database = require("./database.js");
const Data = require("./data");

class Methods {
    constructor() {} // Static

    static Crypto = require("crypto");

    // v0.1.0
    static GameNames = [null, "Etterna", "osu!mania", "FFR", "Quaver", "Robeats"];

    // v0.1.0
    static VerifyData(data) {
        return data && data.userid;
    }

    // v0.1.0
    static async VerifyPermission(userid, opcode, override) {
        let gate = override ? override : config.keys[opcode];
        if (gate === 0)
            return true; // No auth required.
        if (!await Methods.VerifyRegistration(userid))
            return false; // Opcodes 1 and 2 require registration
        switch(gate) {
            case 1: return true;
            case 2: return await Methods.VerifyAdmin(userid);
            default: return false; // Shouldn't be reachable
        }
    }

    // v0.1.0
    static VerifyScoreIntegrity(scoreData) {
        if (!scoreData.game || typeof scoreData.game !== "number" || scoreData.game >= 5)
            return false;

        let errors = 0;
        for (const [key, type] of Data.GetScoreSchema(scoreData.game)) {
            if (!scoreData.hasOwnProperty(key) || typeof scoreData[key] !== type)
                errors++;
        }

        return errors === 0;
    }

    // v0.1.0
    static async VerifyRegistration(userid) {
        let reply = await Database.query("SELECT * FROM Users WHERE userid = ?", [userid]);
        return reply && reply[0];
    }

    // v0.1.0
    static async VerifyAdmin(userid) {
        let reply = await Database.query("SELECT Group FROM Users WHERE userid = ?", [userid]);
        return reply && reply[0] && reply[0].group === 2;
    }

    // v0.1.0
    static async VerifyScoreOwnership(userid, scoreData) {
        let column = (["", "NameEtterna", "NameOsu", "NameFFR", "NameQuaver", "NameRobeats"])[scoreData.game];
        let reply = await Database.query("SELECT ? FROM Users WHERE userid = ?", [column, userid]);
        return reply && reply[0] && reply[0][column] && reply[0][column] === scoreData.player;
    }

    // v0.1.0
    static HashScore(scoreData) {
        const game = Methods.GameNames[scoreData.game];
        const title = Methods.toId(scoreData.title);
        const artist = Methods.toId(scoreData.artist);
        const creator = Methods.toId(game === "Etterna" ? scoreData.packname : scoreData.creator);
        const diff = Methods.toId(game === "FFR" ? "" : scoreData.diff);
        const scoreString = `${game}-${title}-${artist}[${creator}-${diff}]`;
        return Methods.HashScoreString(scoreString);
    }

    // v0.1.0
    static HashScoreString(scoreString) {
        return Methods.Crypto.createHash("sha256").update(scoreString).digest("base64");
    }

    static async AddScore(query) {
        let error = await Database.query(...query);
        console.log(error); // Temporary log - remove me after testing is complete
        return error;
    }

    // v0.1.0
    static toId(string) {
        return String(string).toLowerCase().replace(/[^a-z0-9]+/g, '');
    }
}

module.exports = Methods;