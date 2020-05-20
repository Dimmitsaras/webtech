"use strict";



function Enemy(){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");

  this.width = 20;
  this.height = 20;
  this.x = 0;
  this.y = 0;
  this.life = 20;

  this.yspeed = 0;
  this.xspeed = 0;
  this.movespeed = 2.5;

  this.bullets = [];

  this.draw = function(){
    ctx.fillStyle = 'grey';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.update = function(keys){
    //console.log(keys.toString());
    this.yspeed = 0;
    this.xspeed = 0;

    if(!this.outofboundsx(this.x + this.xspeed)){
      this.x = this.x + this.xspeed;
      //TODO make speed 1 or -1
    }
    else{
      //console.log("outofx");
    }
    if(!this.outofboundsy(this.y + this.yspeed)){
      this.y = this.y + this.yspeed;
      //TODO make speed 1 or -1
    }
    else{
      //console.log("outofy");
    }

  }

  this.outofboundsx = function(newlocationx){
    return (newlocationx < 0 || newlocationx + this.width > canvas.width);
  }
  this.outofboundsy = function(newlocationy){
    return (newlocationy < 0 || newlocationy + this.height  > canvas.height);
  }
}
