// Run a node.js web server for local development of a static web site. Create a
// site folder, put server.js in it, create a sub-folder called "public", with
// at least a file "index.html" in it. Start the server with "node server.js &",
// and visit the site at the address printed on the console.
//     The server is designed so that a site will still work if you move it to a
// different platform, by treating the file system as case-sensitive even when
// it isn't (as on Windows and some Macs). URLs are then case-sensitive.
//     All HTML files are assumed to have a .html extension and are delivered as
// application/xhtml+xml for instant feedback on XHTML errors. Content
// negotiation is not implemented, so old browsers are not supported. Https is
// not supported. Add to the list of file types in defineTypes, as necessary.

// Change the port to the default 80, if there are no permission issues and port
// 80 isn't already in use. The root folder corresponds to the "/" url.
//443=https
let port = 8443;
let root = "./public"

// Load the library modules, and define the global constants and variables.
// Load the promises version of fs, so that async/await can be used.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// The file types supported are set up in the defineTypes function.
// The paths variable is a cache of url paths in the site, to check case.
let https = require("https");
let fs = require("fs").promises;
let sqlite = require("sqlite");
let { parse } = require('querystring');
let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths, options;
let gamedatatype = ".json";
let defaulturl = root + "./index.html";



// Start the server:
start();

// Check the site, giving quick feedback if it hasn't been set up properly.
// Start the http service. Accept only requests from localhost, for security.
// If successful, the handle function is called for each request.
async function start() {
    try {
        await fs.access(root);
        await fs.access(root + "/index.html");
        types = defineTypes();
        paths = new Set();
        paths.add("/");
        options = {
          key: await fs.readFile('key.pem'),
          cert: await fs.readFile('cert.pem')
        };
        let service = https.createServer(options, handle);
        service.listen(port, "localhost");
        let address = "http://localhost";
        if (port != 443) address = address + ":" + port;
        console.log("Server running at", address);
    }
    catch (err) { console.log(err); process.exit(1); }
}

// Serve a request by delivering a file.
async function handle(request, response) {
    var url = request.url;
    if(url.endsWith("?")){
      var questionmark = url.lastIndexOf("?");
      url = url.substring(0, questionmark);
    }
    if (url.endsWith("/")) url =  url + "index.html";
    //console.log(url);
    if(await validate(url)){
      if(request.method == "POST" || request.headers['content-type'] === 'application/x-www-form-urlencoded'){
        console.log(request.headers['content-type']);
        receivedForm(request, url, response);
      }
      else{
        if (url.startsWith("/gamedata")){
          //console.log("gamedata");
          getGamedata(url, response);
        }
        else getFile(request, url, response)
      }
    }
    else{
      return fail(response, BadType, "Invalid URL");
    }

async function validate(url){

  if(url.includes("/.") || url.includes("//") || url.includes(" ")){
    return false;
  }
  else if(await !isASCII(url)){
    return false;
  }
  else if(await !hasExtension(url)){
    //console.log("undefined?");
    return false;
  }
  else{
    return true;
  }
}

function hasExtension(url){
  var dot = url.lastIndexOf(".");
  var extension = url.substring(dot + 1);
  //console.log(types[extension]);
  if(types[extension] !== undefined){
    return true;
  }
  else{
    return false;
  }
}

function isASCII(url) {
    return /^[\x00-\x7F]*$/.test(url);
}

}
async function getFile(request, url, response) {
    let ok = await checkPath(url);
    if (! ok) return fail(response, NotFound, "URL not found (check case)");
    let type = await findType(url);
    if(type.includes("html")){
      let otype = "text/html";
      let ntype = "application/xhtml+xml";
      let header = await request.headers.accept;
      let accepts = header.split(",");
      if (accepts.indexOf(ntype) >= 0){
        type = ntype;
      }
      else{
        type = otype;
      }
    }
    else if (type === "application/x-www-form-urlencoded") {
      console.log("hehe");
    }
    //console.log(type);
    if (type == null) return fail(response, BadType, "File type not supported");
    let file = root + url;
    let content = await fs.readFile(file);
    deliver(response, type, content);
}

async function getGamedata(url, response){
  let defaultfile = await "." + "/gamedatadefault" + gamedatatype;
  let file = await "." + url;
  console.log(file);
  let content;
  //try to find file of that type, if doesnt exist deliver the default file.
  try{
     content = await fs.readFile(file, "utf8");
  }
  catch(e){
     content = await fs.readFile(defaultfile, "utf8");
  }
  console.log(content);
  deliver (response, "application/json", content);
}

async function receivedForm(request, url, response){
    let body ='';
    request.on('data' , async chunk => {
      body += await chunk.toString();
      //console.log(JSON.parse(JSON.stringify(parse(body))));
      formDecision(JSON.parse(JSON.stringify(parse(body))));
    });
    //console.log(parse(body));
    //await fs.writeFile("hello.json", parse(body));

    //request.on('end', () => {
      //response.end('Login successful');
    //  getFile(request, defaulturl, response);
    //});
  //getFile(request, url, repsonse);
}

async function formDecision(body){
  console.log(body);
  var user = body.username
  var nickname = body.nickname;
  var score = body.score;
  var gamemode = body.gamemode;
  //console.log(body.email);
    //console.log("LOGIN");
  try{
    var db = await sqlite.open("./dodgegame.sqlite");
    //console.log(await db.get('SELECT * FROM users'));
    var ins = await db.prepare("INSERT INTO leaderboard (name, score, gamemode) VALUES(?,?,?)");
    var res = await ins.run(nickname, score, gamemode);
    console.log(await ins.lastID);
    var leadid = await ins.lastID;
    await ins.finalize();
    //console.log(res);
    var chk = await db.prepare("SELECT * FROM users WHERE username=?");
    var userid = chk.lastID;
    var resuser = await chk.get(user);
    await chk.finalize();
    if(resuser === undefined){
      var us = await db.prepare("INSERT INTO users (username, highscore, gameid) VALUES(?,?,?)");
      console.log(leadid);
      await us.run(user, score, leadid);
      await us.finalize();
    }
    else{
      console.log(resuser);
      console.log("Exists")
      console.log(leadid);
      if(resuser.highscore <= score){
        var updt = await db.prepare("UPDATE users SET highscore = ?, gameid = ? WHERE username = ?")
        updt.run(score, leadid, user);
        updt.finalize();
        resuser.highscore = score;
        resuser.gameid = leadid;
      }
      else{
        //nothing
        console.log("Not a highscore nothing done");
      }

    }
  }
  catch(e){
    console.log(e);
  }

}

// Check if a path is in or can be added to the set of site paths, in order
// to ensure case-sensitivity.
async function checkPath(path) {
    if (! paths.has(path)) {
        let n = path.lastIndexOf("/", path.length - 2);
        let parent = path.substring(0, n + 1);
        let ok = await checkPath(parent);
        if (ok) await addContents(parent);
    }
    return paths.has(path);
}

// Add the files and subfolders in a folder to the set of site paths.
async function addContents(folder) {
    let folderBit = 1 << 14;
    let names = await fs.readdir(root + folder);
    for (let name of names) {
        let path = folder + name;
        let stat = await fs.stat(root + path);
        if ((stat.mode & folderBit) != 0) path = path + "/";
        paths.add(path);
    }
}

// Find the content type to respond with, or undefined.
function findType(url) {
    let dot = url.lastIndexOf(".");
    let extension = url.substring(dot + 1);
    return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, content) {
    let typeHeader = { "Content-Type": type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) {
    let textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(code, textTypeHeader);
    response.write(text, "utf8");
    response.end();
}

// The most common standard file extensions are supported, and html is
// delivered as "application/xhtml+xml".  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: add entries as needed or, for a more
// complete list, install the mime module and adapt the list it provides.
function defineTypes() {
    let types = {
        html : "application/xhtml+xml",
        css  : "text/css",
        js   : "application/javascript",
        mjs  : "application/javascript", // for ES6 modules
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: undefined,      // non-standard, use .html
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}
