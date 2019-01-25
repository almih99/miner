'use strict'

/*
This is an auxiliary script.
It used for demonstration purpose and works with miner-wrapper.html
You can take it as base for embeding miner game in your page.
*/

var isRunning=false;
var startTime=0;

// resize field
// Deletes existing gamefield and creates new.
function applySize() {
  var args=JSON.parse(document.getElementById("gamesize").value);
  args.unshift("miner-field-paceholder");
  document.getElementById("miner-field-paceholder").innerHTML='';
  makeMinerBoard.apply(undefined, args);
}

// Handler is triggered when new board was created or existing one was reseted
// It do nothing with board itself, but with auxiliary items.
function onStartGame(e) {
  document.getElementById("flagsopened").innerHTML="0";
  document.getElementById("totalflags").innerHTML="0";
  document.getElementById("minuteselapsed").innerHTML="00";
  document.getElementById("secondselapsed").innerHTML="00";
  document.getElementById("centerer").classList.remove("fail");
  document.getElementById("centerer").classList.remove("win");
  isRunning=false;
}

// Handler is triggered when one cell was opened or marked by flag.
// If it was first cell, stories current time as game start time.
// Main goal is to show current amount of marked fields.
function onChangeState(e) {
  if(!isRunning) {
    startTime=Date.now();
    isRunning = true;
  }
  document.getElementById("flagsopened").innerHTML=String(e.marked);
  document.getElementById("totalflags").innerHTML=String(e.mines);
}

// Handler is triggered when all possible cells are opend.
function onWin(e) {
  isRunning=false;
  document.getElementById("centerer").classList.add("win");
}

// Handler is triggered when cell with mine was opened.
function onFail(e) {
  isRunning=false;
  document.getElementById("centerer").classList.add("fail");
}

// Handler is used for updating game timer.
function onTick(e) {
  if(isRunning) {
    var currentTime=Date.now();
    var m=Math.floor((currentTime-startTime)/(1000*60));
    var s=Math.floor((currentTime-startTime)/1000%60);
    document.getElementById("minuteselapsed").innerHTML=(m<10?"0":"")+m;
    document.getElementById("secondselapsed").innerHTML=(s<10?"0":"")+s;
  }
}

// Register init function
document.addEventListener("DOMContentLoaded", initialize);

// initialization
function initialize() {
  // Register handlers for game events
  document.addEventListener("minerfieldready", onStartGame);
  document.addEventListener("mineropencell", onChangeState);
  document.addEventListener("minersetflag", onChangeState);
  document.addEventListener("minerwin", onWin);
  document.addEventListener("minerfail", onFail);
  // Start timer
  setInterval(onTick, 200);
  // Create field
  applySize();
}
