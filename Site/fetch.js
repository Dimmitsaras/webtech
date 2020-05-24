"use strict";
var sqlite = require("sqlite");
fetch();

async function fetch() {
    try {
        var db = await sqlite.open("./dodgegame.sqlite");
        var as = await db.all("select * from users");
        var bs = await db.all("select * from highscores")
        console.log(as);
    } catch (e) { console.log(e); }
}
