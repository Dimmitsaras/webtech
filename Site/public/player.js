function Player(){
  this.x = 300;
  this.y = 500;
  this.yspeed = 0;
  this.xspeed = 0;
  this.movespeed = 3;

  this.update = function(keys){
    //console.log(keys.toString());
    this.yspeed = 0;
    this.xspeed = 0;
    if(!keys.isEmpty){
      keys.forEach(key => this.move(key));
    }
    this.x = this.x + this.xspeed;
    this.y = this.y + this.yspeed;
  }

  this.show = function(){
    fill(255,0,0);
    rect(this.x, this.y, 20, 20);
  }

  this.move = function(key){
    switch(key){
      case 38:
      case "Up":
      case "ArrowUp":
        //console.log("Up");
        this.yspeed = this.yspeed - this.movespeed;
        break;
    case 40:
    case "Down":
    case "ArrowDown":
      //console.log("Down");
      this.yspeed = this.yspeed + this.movespeed;
      break;
    case 39:
    case "Right":
    case "ArrowRight":
      //console.log("Right");
      this.xspeed = this.xspeed + this.movespeed;
      break;
    case 37:
    case "Left":
    case "ArrowLeft":
      //console.log("Left");
      this.xspeed = this.xspeed - this.movespeed;
      break;
    default:
      return;
    }
  }
}
