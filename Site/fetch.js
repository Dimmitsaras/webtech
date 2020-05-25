"use strict";
var sqlite = require("sqlite");
fetch();

async function fetch() {
    try {
        var db = await sqlite.open("./dodgegame.sqlite");
        var bs = await db.all("select * from leaderboard")
        var as = await db.all("select * from users");
        console.log(bs);
        console.log(as);
    } catch (e) { console.log(e); }
}
