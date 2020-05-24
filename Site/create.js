"use strict";

var sqlite = require("sqlite");
//var db;

create();

async function create() {
    try {
        var db = await sqlite.open("./dodgegame.sqlite");
        await db.run("CREATE TABLE users (userid INTEGER NOT NULL, username, password, primary key (userid))");
        await db.run("INSERT INTO users (username, password) VALUES ('test', 'password')");
        await db.run("CREATE TABLE highscores (id, gameid, nickname, gamedata, highscore, foreign key (id) references users(id))");
        await db.get("pragma foreign_keys = on");
    } catch (e) { console.log(e); }
}
//db.all = array of objects
//db.get = get single json object
