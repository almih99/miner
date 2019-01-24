'use strict';

/*
This is a simple implementation of miner game.
There are 2 global functions:
 makeMinerBoard(where, mineCount, width, height, cellSize, cellSpacing)
and
 resetMinerBoard(where)
The first one takes id of placeholder and build gamefield in it.
The second one reset field to initial state.

There is a set of events fired when player click on the field:
minerfieldready
 when field is in it's initial state (afrer makeMinerBoard() or resetMinerBoard);
minerfail
 when player opend a mine;
mineropencell
 when player opend any cell;
minersetflag
 when player set (or unset) flag;
minerwin
 when player opend all cells without mines.

Events have properties:
e.mines
 amount of mines on the field;
e.cells
 total amount of cells on the field;
e.marked
 amount of marked by flags cells;
e.opend
 omount of opend field.

Example of full implementation see in miner-wrapper.html
*/

/*
function wrt(e) {console.log(e);}
document.addEventListener("minerfieldready", wrt);
document.addEventListener("minerfail", wrt);
document.addEventListener("mineropencell", wrt);
document.addEventListener("minersetflag", wrt);
document.addEventListener("minerwin", wrt);
*/

// miner game namespace
(function () {
  // function builds a new field as last child of
  // node where and fills it with mines
  function makeMinerBoard(where, mineCount, width, height, cellSize=30, cellSpacing=2) {
    //
    // outer table element
    const t = document.createElement("table");
    t.classList.add("miner-table");
    t.classList.add("miner-table-uninitialized");
    t.style.width = width*(cellSize+cellSpacing) + "px"; //fixed width for
    t.style.borderSpacing = cellSpacing + "px";
    t.setAttribute("data-mines", mineCount);
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
        c.style.width = cellSize + "px";
        c.style.height = cellSize + "px";
        c.style.fontSize = Math.floor(cellSize*0.8) + "px";
        c.style.textAlign = "center";
        c.style.verticalAlign = "middle";
        c.style.borderWidth="0px";
        r.appendChild(c);
      }
      b.appendChild(r);
    }
    document.getElementById(where).appendChild(t);
    // fire event
    fireMinerEvent(t, "minerfieldready");
  }

  // start new game on the same field
  function resetMinerBoard(where) {
    var tbl = document.getElementById(where).querySelector("table");
    tbl.classList.add("miner-table");
    tbl.classList.add("miner-table-uninitialized");
    tbl.classList.remove("miner-table-frozen");
    for(var c of allCells(tbl)) {
      c.className="miner-cell";
      c.removeAttribute("data-neighbors");
    }
    // fire event
    fireMinerEvent(tbl, "minerfieldready");
  }

  function placeMines(tbl, count, currentCell) {
    const rowLimit = tbl.rows.length;
    const colLimit = tbl.rows[0].cells.length;
    minesLoop:
    for(var mine=0; mine<count; mine++) {
      var limit=100; // max attempts count
      do {
        if(!(--limit)) break minesLoop;
        var r=Math.floor(Math.random()*rowLimit);
        var c=Math.floor(Math.random()*colLimit);
        var cell=tbl.rows[r].cells[c];
      }while(cell==currentCell || cell.classList.contains("miner-cell-mine"));
      cell.classList.add("miner-cell-mine");
    }
    for(var c of allCells(tbl)) {
      var nbcnt=0;
      for(var nc of neighborCells(c)) {
        if(nc.classList.contains("miner-cell-mine")) nbcnt++;
      }
      c.setAttribute("data-neighbors", nbcnt);
    }
  }

  // handles left click
  function onCellClick(e) {
    // if not need to open - return
    if(e.target.tagName!=="TD") return;
    if(e.target.closest("table").classList.contains("miner-table-frozen")) return;
    if(e.target.classList.contains("miner-cell-flag")) return;
    if(e.target.classList.contains("miner-cell-opened")) return;
    // parent table
    var tbl=e.target.closest("table");
    // if it is a first click, set all mines on the field
    if(tbl.classList.contains("miner-table-uninitialized")) {
      placeMines(tbl, tbl.dataset.mines, e.target)
      tbl.classList.remove("miner-table-uninitialized");
    }
    markAsOpened(e.target);
    // fire open cell event
    fireMinerEvent(e.target, "mineropencell");
    if(e.target.classList.contains("miner-cell-mine")) {
      // lock field and show all mines
      tbl.classList.add("miner-table-frozen")

      // fire fail event
      fireMinerEvent(e.target, "minerfail");
    } else {
      // check if all cells opened
      var score=fillEvent({}, tbl);
      if(score.cells===score.opend+score.mines) {
        tbl.classList.add("miner-table-frozen");
        // fire win event
        fireMinerEvent(e.target, "minerwin");
      }
    }
  }

  // function opens all neighbor cells
  // for cells with zero neighbor mines.
  function markAsOpened(cell) {
    cell.classList.add("miner-cell-opened");
    if(cell.dataset.neighbors==="0") {
      for(var nb of neighborCells(cell)){
        if(nb.classList.contains("miner-cell-opened")) continue;
        markAsOpened(nb);
      }
    }
  }

  // handles right click
  function onCellRClick(e){
    e.preventDefault();
    if(e.target.tagName!=="TD") return;
    if(e.target.classList.contains("miner-cell-opened"))return;
    if(e.target.closest("table").classList.contains("miner-table-frozen")) return;
    e.target.classList.toggle("miner-cell-flag");
    // fire event
    fireMinerEvent(e.target, "minersetflag");
  }

  function fireMinerEvent(target, type){
    var primaryEvent = new Event(type, {bubbles: true, cancelable: true});
    fillEvent(primaryEvent, target);
    target.dispatchEvent(primaryEvent);
  }

  // fill all fields in event object
  // the second parameth - cell, for click on which event triggered
  function fillEvent(event, target) {
    var tbl=target.closest("table");
    // fill with static data
    event.mines=Number(tbl.dataset.mines);
    event.cells=tbl.rows.length * tbl.rows[0].cells.length;
    // count dynamic data
    event.marked=0;
    event.opend=0;
    for(var c of allCells(tbl)) {
      if(c.classList.contains("miner-cell-flag")) event.marked++;
      if(c.classList.contains("miner-cell-opened")) event.opend++;
    }
    return event;
  }


  // generator gets any cell of table, and
  // returns iterator, which iterate through
  // all neighbor cells
  // intented usage:
  // for(i of neighborCells(e.target)){...}
  function* neighborCells(cell) {
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

  // generator gets table or any cell in table and
  // returns iterator, which iterate through
  // all cells of this table
  function* allCells(point) {
    const tbl = point.closest("table");
    const rowLimit = tbl.rows.length;
    const colLimit = tbl.rows[0].cells.length;
    for(var r=0; r<rowLimit; r++) {
      var currentRow=tbl.rows[r];
      for(var c=0; c<colLimit; c++) {
        yield currentRow.cells[c];
      }
    }
  }

  // miner game export
  window.makeMinerBoard=makeMinerBoard;
  window.resetMinerBoard=resetMinerBoard;
})();
