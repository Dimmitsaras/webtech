"use strict";

function Levelbutton(p, x, y, gamedata, text){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  var p = p;

  this.width = 150;
  this.height = 80;

  this.pressed = false;
  this.visible = true;
  this.x = x;
  this.y = y;

  this.text = text;

  this.gamedata = gamedata;

  this.draw = function(){
    if(this.visible){
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      // 48px = 3em base 16
      ctx.font = "2.5em Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
    }
  }

  this.update = function(keys){
    if(!keys.isEmpty){
      keys.forEach(key => this.act(key));
    }
  }

  this.act = function(key){
    switch(key){
      case "K":
      case "k":
      case "Z":
      case "z":
        if(this.playerintersection() && this.visible){
          this.click();
        }
        break;
      case "L":
      case "l":
      case "X":
      case "x":
        if(this.playerintersection() && this.visible){
          this.unclick();
        }
        break;
      default:
        return;
      }
  }

  this.click = function(){
    this.visible = false;
    this.pressed = true;
    document.getElementById("audiopotion").play();
    //start the game
  }
  this.unclick = function(){
    //some fucntionality
  }

  this.playerintersection = function(){
    var pcenterx = p.x + p.width/2;
    var pcentery = p.y + p.height/2;
    //console.log(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
    return(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);

  }
}
