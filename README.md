# miner
A simple JavaScript implementation of minesweeper game.

Your can see example at https://almih99.github.io/portfolio/miner/example/miner-wrapper.html

## Adding to page

To use game at you page, you should add

- miner/miner.css

and

- miner/miner.js

to your html file and invoke makeMinerBoard() function with apropriated arguments.

## Functions

Script miner/miner.js exports 2 functions (for creating new field and for
reseting existing one):

- makeMinerBoard(where, mineCount, width, height, [cellSize], [cellSpacing])

and

- resetMinerBoard(where)

Argument 'where' is an id of html element (whthout # sign!), which will contain the whole gamefield. All other arguments are obvious.

Miner.js does not provide auxiliary elements like timer, restart button etc.
Instead it provides set of events. Your should register event
handlers and build your own UI for player.

## Events

There is a set of events fired when player click on the field:

- minerfieldready
  - when field is in it's initial state (afrer makeMinerBoard() or resetMinerBoard);
- minerfail
  - when player opend a mine;
- mineropencell
  - when player opend any cell;
- minersetflag
  - when player set (or unset) flag;
- minerwin
  - when player opend all cells without mines.

Events have properties:

- e.mines
  - amount of mines on the field;
- e.cells
  - total amount of cells on the field;
- e.marked
  - amount of marked by flags cells;
- e.opend
  - amount of opend field.
