"use strict";

addEventListener('load', start);

async function fetchdata(ldata){
  return fetch(ldata).then(receive);
}
async function receive(response){
  let data = await response.json();
  return data;
}

async function start(){
  let ldefault = "/ldata.dat";
  getData(ldefault);
  var button1 = document.getElementById("button1");
  var button2 = document.getElementById("button2");
  var button3 = document.getElementById("button3");
  button1.addEventListener('click', function(){
    getDataButton(button1.value)
  });
  button2.addEventListener('click', function(){
    getDataButton(button2.value)
  });
  button3.addEventListener('click', function(){
    getDataButton(button3.value)
  });
}

async function getDataButton(name){
  console.log("hehe");
  var table = document.getElementById("thetable");
  table.innerHTML="";
  //while (table.hasChildNodes()) {
  //  table.removeChild(table.lastChild);
  //}
  getData(name);
}

async function getData(name){
  let data = await fetchdata(name);
  console.log(data);
  printLeaderboard(data);
}

async function printLeaderboard(data){
  let list = data;
  var table = document.getElementById("thetable");
  var head = table.insertRow(0);
  var cell1 = head.insertCell(0);
  var cell2 = head.insertCell(1);
  var cell3 = head.insertCell(2);
  cell1.innerHTML = "Name";
  cell2.innerHTML = "Score";
  cell3.innerHTML = "Gamemode";
  data.forEach((datarow, i) => {
    let index = i+1;
    let tablerow = table.insertRow(index);
    let addcell1 = tablerow.insertCell(0)
    let addcell2 = tablerow.insertCell(1)
    let addcell3 = tablerow.insertCell(2)
    addcell1.innerHTML = datarow.name;
    addcell2.innerHTML = datarow.score;
    addcell3.innerHTML = datarow.gamemode;
  });

}
