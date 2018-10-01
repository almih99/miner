'use strict';

// function builds a new field as last child of
// node where and fills it with mines
function makeBoard(where, mineCount, width, height) {
  // outer table element
  const t = document.createElement("table");
  t.className="miner-table";
  t.addEventListener('click', onCellClick);
  t.addEventListener("contextmenu", onCellRClick);
  // tbody element
  const b = document.createElement("tbody");
  t.appendChild(b);
  for(var rn=0; rn<height; rn++){
    // row element
    var r = document.createElement("tr");
    r.className="miner-row";
    for(var cn=0; cn<width; cn++) {
      // cell element
      var c = document.createElement("td");
      c.className="miner-cell";
      r.appendChild(c);
    }
    b.appendChild(r);
  }
  document.getElementById(where).appendChild(t)
}


// handles left click
function onCellClick(e) {
  for(var i of neighbourCells(e.target)){
    i.style.backgroundColor="red";
  }
}


// handles right click
function onCellRClick(e){
  e.preventDefault();
}

// generator gets any cell of table, and
// returns iterator, which iterate through
// all neighbour cells
// intented usage:
// for(i of neighbourCells(e.target)){...}
function* neighbourCells(cell) {
  if(!cell.matches("td")) return;
  const cellRow=cell.closest("tr").rowIndex;
  const cellCol=cell.cellIndex;
  const rowLimit=cell.closest("table").rows.length;
  const colLimit=cell.closest("tr").cells.length;
  for(var r=cellRow-1;r<=cellRow+1;r++) {
    if(r<0 || r>=rowLimit) continue;
    for(var c=cellCol-1;c<=cellCol+1;c++){
      if(r==cellRow && c==cellCol) continue;
      if(c<0 || c>=colLimit) continue;
      yield cell.closest("table").rows[r].cells[c];
    }
  }
}
