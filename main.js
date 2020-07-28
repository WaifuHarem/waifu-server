
// Waifu-board startup file
// Runs global script, spawns a server, and exposes parser to server
// 2. lines. of. code. does. all. the. things.
// Layla A.
// v0.0.2

"use strict";

require("./modules/global.js");
// TODO - split requests client into a subprocess
require("./modules/process.js").Create(
    "./modules/server",
    [],
    {cwd: __dirname},
    require("./modules/parser.js").bind(this)
);
