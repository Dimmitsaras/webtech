"use strict";

addEventListener('load', start);

async function fetchdata(gamedata){
  return fetch(gamedata).then(receive);
}
async function receive(response){
  let data = await response.json();
  //console.log(data);
  return data;
}

async function start(){
  //let data;
  //fetchdata();
  var BreakException = {};
  var defaultgamedata = "/gamedata1.json";
  let gamedata = await fetchdata("/gamedata1.json");
  //console.log(gamedata);
  //var pauseaud = new Audio("./Assets/Audio/pause.mp3");
  var gamemode = "hey";
  gamemode = defaultgamedata.substring(1, defaultgamedata.length-5);
  var pauseaud = document.getElementById("audiopause");
  var keys = [];
  var enemies = [];
  var straybullets = [];
  var score = 100;
  //default 10; 1000ms divided by hz
  var speed = 1000/108;
  var usablekeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "W", "w", "A", "a", "S", "s", "D", "d", "K", "k", "L", "l", "Z", "z", "X", "x", "P", "p"];
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  //var uicanvas = document.getElementById("gameUI");
  //var ctxui = uicanvas.getContext("2d");
  var p = new Player();
  var scoretimer = 0;
  var frametimer = 0;
  var victory = false;
  var gameover = false;
  var maxenemies = 5;
  //x, y, damage, firerate, magsize, bulletspeed)
  //enemies.push(new Enemy(20, 30, 5, 1, 30, 20, 3));
  //enemies.push(new Enemy(80, 130, 5, 1, 30, 20, 3))

  var startgame = new Button(p);
  var pausecard = new Pausecard();
  var levelbuttons = [new Levelbutton(p, canvas.width/20, canvas.height*3/4, "/gamedata1.json", "Level 1"), new Levelbutton(p, canvas.width*15/40, canvas.height*3/4, "/gamedata2.json", "Level 2"), new Levelbutton(p, canvas.width*14/20, canvas.height*3/4, "/gamedataasdf.json", "Level 3")];
  fillcanvas();

  document.onkeydown = logKey;
  document.onkeyup = unlogKey;

  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

  async function fillcanvas(){
    ctx.fillStyle = "#272727";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //ctxui.fillStyle = "#404040";
    //ctxui.fillRect(0, 0, canvas.width, canvas.height);
  }

  async function logKey(e){
    //console.log(e.key);
    //p checks for pause
    if(!keys.isEmpty && !keys.includes(e.key) && usablekeys.includes(e.key)){
      if(keys.includes("P")){
        var index = keys.indexOf("P");
        keys.splice(index, 1);
        keys.push(e.key);
      }
      else if(keys.includes("p")){
        var index = keys.indexOf("P");
        keys.splice(index, 1);
        keys.push(e.key);
      }
      else{
        if(e.key === "P" || e.key === "p"){
          pauseaud.play();
        }
        keys.push(e.key);
      }
    }
  }
  async function unlogKey(e){
    if(usablekeys.includes(e.key) && e.key !== "P" && e.key !== "p"){
      var index = keys.indexOf(e.key);
      keys.splice(index, 1);
    }
}
  var button = document.getElementById("submitbutton");
  var form = document.getElementById("highscoreform");
  form.addEventListener('submit', function(){
    button.innerHTML= "...";
    button.disabled = true;
  });

  var game = setInterval(update, speed);


    async function update(){
    //if the game isnt paused
    if(!keys.includes("P") && !keys.includes("p")){
      //score parameter makes this score = score + this.score!
      score = p.update(keys, enemies, score, gameover);
      //e.update();
      startgame.update(keys);
      levelbuttons.forEach(async (levelbutton, i) => {
        //console.log("hehe");
        levelbutton.update(keys);
        if(levelbutton.pressed){
          for(var j = 0; j < levelbuttons.length; j++){
            if(j != i){
              levelbuttons[j].visible = true;
              levelbuttons[j].pressed = false;
            }
          }
          //console.log(levelbutton.gamedata)
          gamedata = await fetchdata(levelbutton.gamedata);
          levelbutton.pressed = false;
          //console.log(gamedata);
          gamemode = levelbutton.gamedata.substring(1, levelbutton.gamedata.length-5);
          //console.log(gamemode);
        }
        else{

        }
      });
      if(!startgame.visible && !p.dead() && !victory){
        levelbuttons = [];
        scoretimer ++;
        if(scoretimer / 60 == 1){
          score --;
          scoretimer = 0;
        }
        //Gameplay has started
      //  console.log(enemies.length);
        //console.log(frametimer);
        if(enemies.length < maxenemies){
          //load an enemy from gamedata
          try{
            gamedata.forEach((gamedatarow, i) => {
              if(gamedatarow.frame == frametimer){
                if(gamedatarow.type === "Enemy"){
                  //if(gamedatarow.moving == true){
                    //console.log(gamedatarow.moving);
                    enemies.push(new Enemy(gamedatarow.moving, gamedatarow.movespeed, gamedatarow.x, gamedatarow.y, gamedatarow.finalx, gamedatarow.finaly, gamedatarow.life, gamedatarow.damage, gamedatarow.firerate, gamedatarow.magsize, gamedatarow.reloadtime, gamedatarow.bulletspeed));
                //  }
                //  else{
                    //x, y, damage, firerate, magsize, bulletspeed)
                //    enemies.push(new Enemy(gamedatarow.x, gamedatarow.y, gamedatarow.life, gamedatarow.damage, gamedatarow.firerate, gamedatarow.magsize, gamedatarow.bulletspeed));
                //  }
                }
              }
              else if (gamedatarow.frame > frametimer){
                //assume frame is ascending so no need to iterate the entire list
                //break out of forEach
                throw BreakException;
              }
              else{
                //console.log(frametimer);
                //frametimer++;
                if(gamedatarow.type === "Endless"){
                  gamemode = "Endless";
                          //                     moving movespeed     x                                      y                          xfinal                              yfinal                 life                  damage              firerate              magsize              reloardtime            bulletspeed
                  enemies.push(new Enemy(true, randomint(4), randomint(canvas.width -20), randomint(canvas.height / 2 + 80), randomint(canvas.width - 20), randomint(canvas.height / 2 + 80), randombetween(3,10), randombetween(1,5), randombetween(20,40), randombetween(5,30), randombetween(80, 400), randombetween(2,4)));
                }
              }
              });
            }
            catch(e){
              if (e!== BreakException){
                throw e;
              }
            }
            frametimer++
          }
          if(enemies.length == 0 && gamedata[0].frame < frametimer && gamedata[0].type !== "Endless"){
            //victory
            victory = true;
          }



        //console.log("hi");
        //console.log(enemies);
          enemies.forEach((enemy, i) => {
            enemy.update(p);
            if(enemy.dead()){
              //increase score based on enemy life and damage
              score = score + (enemy.life / 2) + Math.round(10000 * (enemy.damage * (enemy.magsize / (enemy.reloadtime * enemy.firerate))));
              enemy.bullets.forEach((bullet, i) => {
              straybullets.push(bullet);
              });
              enemies.splice(i, 1);
            }

          });
      }
      if(!straybullets.isEmpty && typeof(bullets) != 'undefined'){
        console.log(straybullets);
        straybullets.forEach((bullet, i) => {
          //console.log("bullet");
          if(!bullet.outofboundsx() && !bullet.outofboundsy()){
            //console.log("in bounds");
            bullet.intersectswith(p);
          }
          if(bullet.lifetime > canvas.height * 2 / 2 || !bullet.visible){
            straybullets.splice(i, 1);
          }
        });
      }
      document.getElementById("score").innerHTML = "Score: " + score;
      requestAnimationFrame(draw);
      if(p.dead() || victory){
          //Player dead game over
          if(!gameover) {
            document.getElementById("audiosupereffective").play();
            document.getElementById("scoreform").value = score + p.life;
            document.getElementById("gamemodeform").value = gamemode;
          }
          gameover = true;
      }

    }
    //if the game is paused
    else{
      pausecard.update();
    }
  }

  async function draw(){
    fillcanvas();
    startgame.draw();
    p.draw();
    levelbuttons.forEach( async (levelbutton, i) => {
      levelbutton.draw();
    });

    if(!startgame.visible && !p.dead()){
      //console.log("no");
      //Gameplay has started
      //console.log("hi2");
        enemies.forEach(enemy => enemy.draw());
    }

  }

  async function playerintersection(p, object){
    var pcenterx = p.x + p.width/2;
    var pcentery = p.y + p.height/2;
    console.log(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
    return(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
  }

  function randomint(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
  }
  function randombetween(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
  }


}
