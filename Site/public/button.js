"use strict";

function Button(p){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  var p = p;

  this.width = 150;
  this.height = 80;

  this.visible = true;
  this.x = canvas.width/2 - this.width/2;
  this.y = canvas.height/2 - this.height/2;

  this.draw = function(){
    if(this.visible){
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.font = "48px Arial";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.fillText("Start", this.x *1.1, this.y + this.height/2 + 18);
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
        if(this.playerintersection()){
          this.click();
        }
        break;
      case "L":
      case "l":
      case "X":
      case "x":
        if(this.playerintersection()){
          this.unclick();
        }
        break;
      default:
        return;
      }
  }

  this.click = function(){
    this.visible = false;
    //start the game
  }
  this.unclick = function(){
    //some fucntionality
  }

  this.playerintersection = function(){
    var pcenterx = p.x + p.width/2;
    var pcentery = p.y + p.height/2;
    console.log(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);
    return(pcenterx >= this.x && pcenterx <= this.x + this.width && pcentery >= this.y && pcentery <= this.y + this.height);

  }
}
