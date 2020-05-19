"use strict";

function Pausecard(){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");

  this.width = 200;
  this.height = 80;
  this.x = canvas.width/2 - this.width/2;
  this.y = canvas.height /2 - this.height/2;

  this.draw = function(){
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.font = "30px Arial";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.fillText("Paused", this.x + 50, this.y + this.height/2);
    ctx.font = "14px Arial";
    ctx.fillText("Press any key to continue", this.x + 20, this.y + this.height/2 + 30);
  }
  this.update = function(){
    this.draw();
  }

}
