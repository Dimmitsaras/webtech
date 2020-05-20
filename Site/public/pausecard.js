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
    // 30px = 1.875em base 16
    ctx.font = "1.875em Arial";
    ctx.textAlign = "center";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    //ctx.fillText("Paused", this.x + 50, this.y + this.height/2);
    ctx.fillText("Paused", this.x + this.width/2, this.y + this.height/2 - 10);
    // 14px = 0.875em base 16
    ctx.font = "0.875em Arial";
    ctx.fillText("Press any key to continue", this.x + this.width/2, this.y + this.height/2 + 20);
  }
  this.update = function(){
    this.draw();
  }

}
