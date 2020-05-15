"use strict";

var sqlite = require("sqlite");
var db;

create();

async function create() {
    try {
        db = await sqlite.open("./db.sqlite");
        await db.run("pragma foreign_keys = on");
        await db.run("create table animals (id primary key, breed)");
        await db.run("insert into animals values (42,'dog')");
        await db.run("insert into animals values (53,'fish')");
        await db.run("create table customers (username primary key, name)");
        await db.run("insert into customers values ('ab12345', 'Pat')");
        await db.run("insert into customers values ('cd67890', 'Chris')");
        await db.run(
            "create table sales (id, username, price, " +
                "foreign key(id) references animals(id), " +
                "foreign key(username) references customers(username) " +
            ")");
        await db.run("insert into sales values (42, 'ab12345', 100)");
        await db.run("insert into sales values (53, 'cd67890', 50)");
    } catch (e) { console.log(e); }
}

var sqlite = require("sqlite");
var db;

sales();

async function sales() {
    try {
        db = await sqlite.open("./db.sqlite");
        var xs = await db.all(
            "select * from sales " +
            "join animals using (id) " +
            "join customers using (username)"
        );
        console.log(xs);
    } catch (e) { console.log(e); }
}