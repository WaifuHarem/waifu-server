
// Methods Static Class
// Utility functions for Parser.js
// - Layla

"use strict";

require("./database.js");
const Data = require("./data");

class Methods {
    constructor() {} // Static

    static VerifyData(data) {
        return Number(!data || !data.userid);
    }

    static async VerifyPermission(userid, opcode = 2) {
        if (config.keys[opcode] === 0)
            return true; // No auth required.
        if (!await Methods.VerifyRegistration(userid))
            return false; // Opcodes 1 and 2 require registration
        switch(config.keys[opcode]) {
            case 1: return
            case 2:
            default: return false; // Shouldn't be reachable
        }
        // await Methods.VerifyRegistration(userid);
        return true;
        /* TODO Rewrite to use Database groups instead of config
        if (!Boolean(config.groups[userid]))
            return false;
        return config.keys[opcode] <= config.groups[userid].group;
        */
    }

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

    static async VerifyRegistration(userid) {
        let reply = await Database.query("SELECT * FROM Users WHERE userid = ?", [userid]);
        return reply && reply[0];
    }

    static VerifyScoreOwnership(userid, scoreData) {
        if (!config.groups[userid])
            return false; // Not Registered
        let registered = config.groups[userid].usernames[Data.GameId(scoreData.game)];
        return registered && registered === scoreData.player;
    }
}

module.exports = Methods;