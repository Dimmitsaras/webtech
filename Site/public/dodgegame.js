"use strict";

  var p;
  var keys = [];
  function setup(){
    createCanvas(600,600);
      p = new Player();
      keys = [];
  }

  function draw() {
    background(51);
    p.update(keys);
    p.show();
  }
onkeydown = logKey;
onkeyup = unlogKey;


  function logKey(e){
    if(!keys.isEmpty && !keys.includes(e.key)){
      keys.push(e.key);
    }
  }
  function unlogKey(e){
    var index = keys.indexOf(e.key);
    keys.splice(index, 1);
  }

  function update(){

  }
