
// Config Global Module
// Holds global settings used across the server.
// - Layla
// v0.0.2

"use strict";

const fs = require("fs");
const loaddb = fs.existsSync("./conf/dbtest.json") || fs.existsSync("./conf/dbprod.json");

const config = {
	watchconfig: true,
	keys: [
		0, // No-op
		1, // Addscore
		2, // Remove Score
		0, // Fetch -  ratelimited to prevent abuse
		2, // Session
		2, // Multiplayer
		2, // Register User
		2, // Deregister User
	],
	auth: [
		{
			name: "Unregistered"
		},
		{
			name: "Registered"
		},
		{
			name: "Administrator"
		}
	],
	supportedIPs: ["localhost"],
	connection: loaddb && fs.existsSync("./conf/dbprod.json") ?
		require("./conf/dbprod.json") : loaddb && fs.existsSync("./conf/dbtest.json") ?
			require("./conf/dbtest.json") : {dead: true},
	testlogs: "./tests/reports/"
};

module.exports = config;