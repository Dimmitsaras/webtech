"use strict";

addEventListener('load', start);
function start(){
  var keys = [];
  var speed = 10;
  var usablekeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "W", "w", "A", "a", "S", "s", "D", "d", "K", "k", "L", "l", "Z", "z", "X", "x", "P", "p"];
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  var uicanvas = document.getElementById("gameUI");
  var ctxui = uicanvas.getContext("2d");
  var p = new Player();
  var start = new Button(p);
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
    console.log(e.key);
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
      p.update(keys);
      start.update(keys)
      draw();
    }
    //if the game is paused
    else{
      pausecard.update();
    }
  }

  function draw(){
    fillcanvas();
    start.draw();
    p.draw();
  }

  function playerintersection(p, object){
    var pcenterx = p.x + p.width/2;
    var pcentery = p.y + p.height/2;
    console.log(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
    return(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
  }


}
