"use strict";

function Bullet(initx, inity, xspeed, yspeed, damage){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  var playerlife = document.getElementById("playerlife");
  //var p = p;

  this.width = 2;
  this.height = 5;

  this.visible = true;

  this.x = initx;
  this.y = inity;

  this.lifetime = 0;
  this.damage = damage;

  this.xspeed = xspeed;
  this.yspeed = yspeed;

  this.draw = function(){
    if(this.visible){
      ctx.fillStyle = 'white';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  this.update = function(){
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
    this.lifetime = this.lifetime + 1;
  }

  this.outofboundsx = function(newlocationx){
    return (newlocationx + this.width < 0 || newlocationx > canvas.width);
  }
  this.outofboundsy = function(newlocationy){
    return (newlocationy + this.height< 0 || newlocationy > canvas.height);
  }

  this.intersectswith = function(unit){
    var horizontalhit = (this.x >= unit.x && this.x <= unit.x + unit.width) || (this.x + this.width >= unit.x && this.x + this.width <= unit.x + unit.width);
    var verticalhit = (this.y >= unit.y && this.y <= unit.y + unit.height) || (this.y + this.height >= unit.y && this.y + this.height <= unit.y + unit.height);
    //console.log(horizontalhit && verticalhit);
    if(horizontalhit && verticalhit && this.visible){
      this.visible = false;
      unit.life = unit.life - this.damage;
      if (unit.type === "Player"){
        playerlife.innerHTML = unit.life;
      }
      return true;
    }
    else{
      return false;
    }
    //unit.life = unit.life - this.damage;
    //

  }

}
