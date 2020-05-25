"use strict";

var sqlite = require("sqlite");
//var db;

create();

async function create() {
    try {
        var db = await sqlite.open("./dodgegame.sqlite");
        await db.run("CREATE TABLE leaderboard (gameid INTEGER NOT NULL, name, gamemode, score, primary key (gameid))");
        await db.run("CREATE TABLE users (userid INTEGER NOT NULL, username, highscore, gameid, primary key (userid), foreign key (gameid) references leaderboard(gameid))");
        await db.run("INSERT INTO leaderboard (name, gamemode, score) VALUES ('makos', 'Endless', 20)");
        await db.run("INSERT INTO users (username, highscore, gameid) VALUES ('ImDimmITsaras', 20, 1)");
        await db.get("pragma foreign_keys = on");
      //  await db.run("CREATE TABLE users (userid INTEGER NOT NULL, name, gamemode, score, primary key (userid))");
        //await db.run("CREATE TABLE highscores (id, gameid, nickname, gamedata, highscore, foreign key (id) references users(id))");
    } catch (e) { console.log(e); }
}
//db.all = array of objects
//db.get = get single json object
