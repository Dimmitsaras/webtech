"use strict";



function Player(){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");

  this.width = 20;
  this.height = 20;
  this.x = canvas.width/2 - this.width/2;
  this.y = canvas.height - 100 - this.height/2;
  this.life = 20;

  this.firerate = 5;
  this.firecounter = 0;
  this.firing = false;
  this.bulletspeed = 3;
  this.damage = 1;

  this.yspeed = 0;
  this.xspeed = 0;
  this.movespeed = 2.5;

  this.bullets = [];
  this.bulletthreshold = canvas.width / this.bulletspeed;


  this.draw = function(){
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if(!this.bullets.isEmpty){
      this.bullets.forEach(bullet => bullet.draw());
      this.bullets.forEach(bullet => bullet.update());
    }
  }

  this.update = function(keys){
    //console.log(keys.toString());


    this.yspeed = 0;
    this.xspeed = 0;
    //console.log(this.bullets);
    if(!keys.isEmpty){
      keys.forEach(key => this.move(key));
    }
    if(this.firing && this.firecounter >= this.firerate){
      this.firecounter = 0;
      this.bullets.push(new Bullet(this.x + this.width/2, this.y-this.height/2, 0, -this.bulletspeed, this.damage));
      this.firing = false;
    }
    else{
      this.firecounter++;
    }
    if(!this.bullets.isEmpty || typeof(bullets) != 'undefined'){
      this.bullets.forEach((bullet, i) => {
        if(bullet.lifetime > this.bulletthreshold){
          this.bullets.splice(i, 1);
        }
      });
    }
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

  this.move = function(key){
    switch(key){
      case 38:
      case "W":
      case "w":
      case "Up":
      case "ArrowUp":
        //console.log("Up");
        this.yspeed = this.yspeed - this.movespeed;
        break;
    case 40:
    case "S":
    case "s":
    case "Down":
    case "ArrowDown":
      //console.log("Down");
      this.yspeed = this.yspeed + this.movespeed;
      break;
    case 39:
    case "D":
    case "d":
    case "Right":
    case "ArrowRight":
      //console.log("Right");
      this.xspeed = this.xspeed + this.movespeed;
      break;
    case 37:
    case "A":
    case "a":
    case "Left":
    case "ArrowLeft":
      //console.log("Left");
      this.xspeed = this.xspeed - this.movespeed;
      break;
    case "K":
    case "k":
    case "Z":
    case "z":
      this.firing = true;
      break;
    default:
      return;
    }
  }

  this.outofboundsx = function(newlocationx){
    return (newlocationx < 0 || newlocationx + this.width > canvas.width);
  }
  this.outofboundsy = function(newlocationy){
    return (newlocationy < 0 || newlocationy + this.height  > canvas.height);
  }
}
