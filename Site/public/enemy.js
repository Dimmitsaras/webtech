"use strict";



function Enemy(moving, movespeed, x, y, finalx, finaly, life, damage, firerate, magsize, reloadtime, bulletspeed){
  var canvas = document.getElementById("gamecanvas");
  var ctx = canvas.getContext("2d");
  //var p = p;

  this.type = "Enemy"
  this.init = 1;

  this.width = 20;
  this.height = 20;
  this.x = x;
  this.y = y;
  this.finalx = finalx;
  this.finaly = finaly;

  this.life = life;

  this.firecounter = 0;
  this.firing = true;
  this.damage = damage;
  this.firerate = firerate;
  this.magsize = magsize;
  this.bulletspeed = bulletspeed;
  this.bulletdirection = 1; //all enemies shoot downwards
  this.bullets = [];
  this.bulletthreshold = canvas.height * 2 / this.bulletspeed;
  this.reloadtime = reloadtime;
  this.reloadtimer = 0;

  this.yspeed = 0;
  this.xspeed = 0;
  this.movespeed = movespeed;

  this.moving = moving;
  this.futureplacesx = [];
  this.futureplacesy = [];
  this.movementindex = 0;



  this.draw = function(){
    ctx.fillStyle = 'grey';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if(!this.bullets.isEmpty){
      this.bullets.forEach((bullet, i) => {
        bullet.update();
        bullet.draw();
        //console.log("drawing");
      });
    }
  }

  this.update = function(p){
    //console.log(this.y);
    //console.log(this.maxenemyy(this.y));
    //console.log(keys.toString());
    //console.log(this.bullets);
    this.yspeed = 0;
    this.xspeed = 0;
    if(this.init === 1){
      this.init = 0;
      if(this.moving){
        this.interpolatepath(x, y, finalx, finaly);
      }
    }
    if(this.moving && this.movementindex < this.futureplacesx.length){
      if(!this.outofboundsx(this.futureplacesx[Math.round(this.movementindex)])){
        this.x = this.futureplacesx[Math.round(this.movementindex)];
      }
      if(!this.outofboundsy(this.futureplacesy[Math.round(this.movementindex)])){
        this.y = this.futureplacesy[Math.round(this.movementindex)];
      }
      this.movementindex += this.movespeed;
    }
    else if(this.moving){
      //console.log(this.x);
      //console.log(this.y);
      //console.log(x);
      //console.log(y);
      this.futureplacesx = [];
      this.futureplacesy = [];
      if(this.x === x){
        this.interpolatepath(this.x, this.y, finalx, finaly);
      }
      else{
        this.interpolatepath(this.x, this.y, x, y);
      }

      this.movementindex = 0;
    }


    if(this.firing && this.firecounter >= this.firerate && this.magsize > 0){
      this.firecounter = 0;
      this.magsize --;
      if(this.bulletdirection < 0){
        this.bullets.push(new Bullet(this.x + this.width/2, this.y-this.height/2, 0, this.bulletdirection * this.bulletspeed, this.damage));
      }
      else{
        this.bullets.push(new Bullet(this.x + this.width/2, this.y + this.height, 0, this.bulletdirection * this.bulletspeed, this.damage));
      }

      //this.firing = false;
    }
    else if(this.magsize > 0){
      this.firecounter++;
    }
    else{
      this.reloadtimer ++;
      if(this.reloadtimer > this.reloadtime){
        this.magsize = magsize;
        this.reloadtimer = 0;
      }
    }
    if(!this.bullets.isEmpty || typeof(bullets) != 'undefined'){
      this.bullets.forEach((bullet, i) => {
        //console.log("bullet");
        if(!bullet.outofboundsx() && !bullet.outofboundsy()){
          //console.log("in bounds");
          bullet.intersectswith(p);
        }
        if(bullet.lifetime > this.bulletthreshold || !bullet.visible){
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
    if(!this.outofboundsy(this.y + this.yspeed) && !this.maxenemyy(this.y + this.yspeed)){
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
  this.maxenemyy = function(newlocationy){
    return (newlocationy < 0 || (newlocationy + this.height) / 1.1 >= canvas.height /2);
  }

  this.firingf = function(){
    return true;
  }

  this.dead = function(){
    if(this.life <= 0){
      document.getElementById("audionoteffective").play();
      return true;
    }
    else{
      return false;
    }
  }
  this.interpolatepath = function(x1, y1, x2, y2){
    var distx = x2-x1;
    var disty = y2-y1;
    var dist = Math.sqrt((distx*distx) + (disty * disty));
    var xplaces = this.interpolate(x1, x2, dist);
    var yplaces = this.interpolate(y1, y2, dist);
    var i;
    for(i = 0; i < dist; i++){
      this.futureplacesx.push(xplaces[i]);
      this.futureplacesy.push(yplaces[i]);
    }
    //console.log(this.futureplacesx);
  }

  this.interpolate = function(from, to, numberOfValues){
    var toreturn = [];
    var incremental = (to - from) / (numberOfValues - 1);
    var i;
    for(i = 0; i < numberOfValues; i++){
      toreturn.push(Math.round(from));
      from = from + incremental
    }
    return toreturn;
  }
  ///
  //vector<float> interpolate(float from, float to, int numberOfValues){
  //  std::vector<float> toreturn;
  //  float incremental = (to - from) / (numberOfValues -1);
  //  for(int i=0; i<numberOfValues; i++){
  //    toreturn.push_back(from);
  //    from = from + incremental;
  //  }
  //  return toreturn;
  //}
  ///
}
