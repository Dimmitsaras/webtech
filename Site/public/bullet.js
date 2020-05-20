"use strict";

function Bullet(initx, inity, xspeed, yspeed, damage){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");

  this.width = 2;
  this.height = 10;


  this.x = initx;
  this.y = inity;

  this.lifetime = 0;
  this.damage = damage;

  this.xspeed = xspeed;
  this.yspeed = yspeed;

  this.draw = function(){
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.update = function(){
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    this.lifetime = this.lifetime + 1;
  }

}
