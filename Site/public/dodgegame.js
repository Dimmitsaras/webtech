"use strict";

addEventListener('load', start);

async function fetchdata(){
  fetch("/gamedata").then(receive);
}
async function receive(response){
  let data = await response.json();
  //var html = "<li>" + data;
  console.log(data);
  var haha = document.getElementById("haha");
  haha.innerHTML = data.type;
}

function start(){
  fetchdata();
  var keys = [];
  var enemies = [];
  var enemybullets = [];
  //default 10; 1000ms divided by hz
  var speed = 1000/108;
  var usablekeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "W", "w", "A", "a", "S", "s", "D", "d", "K", "k", "L", "l", "Z", "z", "X", "x", "P", "p"];
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  var uicanvas = document.getElementById("gameUI");
  var ctxui = uicanvas.getContext("2d");
  var p = new Player();
  var frametimer = 0;
  //x, y, damage, firerate, magsize, bulletspeed)
  enemies.push(new Enemy(20, 30, 5, 1, 30, 20, 3));
  enemies.push(new Enemy(80, 130, 5, 1, 30, 20, 3))

  var startgame = new Button(p);
  var pausecard = new Pausecard();
  fillcanvas();

  document.onkeydown = logKey;
  document.onkeyup = unlogKey;

  function fillcanvas(){
    ctx.fillStyle = "#272727";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctxui.fillStyle = "#404040";
    ctxui.fillRect(0, 0, canvas.width, canvas.height);
  }

  function logKey(e){
    //console.log(e.key);
    //p checks for pause
    if(!keys.isEmpty && !keys.includes(e.key) && usablekeys.includes(e.key)){
      if(keys.includes("P")){
        var index = keys.indexOf("P");
        keys.splice(index, 1);
        keys.push(e.key);
      }
      else if(keys.includes("p")){
        keys.splice(index, 1);
        keys.push(e.key);
      }
      else{
        keys.push(e.key);
      }
    }
  }
  function unlogKey(e){
    if(usablekeys.includes(e.key) && e.key !== "P" && e.key !== "p"){
      var index = keys.indexOf(e.key);
      keys.splice(index, 1);
    }
}

  var game = setInterval(update, speed);


  function update(){
    //if the game isnt paused
    if(!keys.includes("P") && !keys.includes("p")){
      p.update(keys, enemies);
      //e.update();
      startgame.update(keys)
      if(!startgame.visible && !p.dead()){
        //Gameplay has started
        frametimer++;
        //console.log("hi");
        //console.log(enemies);
          enemies.forEach((enemy, i) => {
            enemy.update(p);
            if(enemy.dead()){
              enemies.splice(i, 1);
            }

          });
      }
      requestAnimationFrame(draw);
    }
    //if the game is paused
    else{
      pausecard.update();
    }
  }

  function draw(){
    fillcanvas();
    startgame.draw();
    p.draw();
    if(!startgame.visible && !p.dead()){
      //console.log("no");
      //Gameplay has started
      //console.log("hi2");
        enemies.forEach(enemy => enemy.draw());
    }

  }

  function playerintersection(p, object){
    var pcenterx = p.x + p.width/2;
    var pcentery = p.y + p.height/2;
    console.log(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
    return(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
  }


}
