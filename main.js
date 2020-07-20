
// Waifu-board startup file
// Runs global script, spawns a server, and exposes parser to server
// 2. lines. of. code. does. all. the. things.
// Layla A.

"use strict";

require("./modules/global.js");
require("./modules/process.js").Create(
    "./modules/server",
    [],
    {cwd: __dirname},
    require("./modules/parser.js").bind(this)
);
