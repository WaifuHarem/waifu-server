"use strict";

// Edit this class to add more parser methods

const db = (async function() {
    let out = await require("./database.js")();
    global.dbReady = true;
})();
const Data = require("./data");

// All methods ABSOLUTELY must return a promise that resolves to an object containing:
// {
//      code: int
//      data: json-string (optional)
// }

class Methods {
    constructor() {} // Static

    static VerifyData(data) {
        if (!data || !data.userid || !data.ip)
            return 1; // Bad Data
        else if (!Methods.VerifyIP.call(this, data.ip))
            return 2; // Invalid Request Source
        return 0;
    }

    static VerifyIP(ip) {
        return config.supportedIPs.indexOf(ip) > -1;
    }

    static VerifyPermission(userid, opcode = 0) {
        if (!Boolean(config.groups[userid]))
            return false;
        return config.keys[opcode] <= config.groups[userid].group;
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

    static VerifyScoreOwnership(userid, scoreData) {
        if (!config.groups[userid])
            return false; // Not Registered
        let registered = config.groups[userid].usernames[Data.GameId(scoreData.game)];
        return registered && registered === scoreData.player;
    }
}

module.exports = Methods;