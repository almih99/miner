all: miner/miner.es5.min.js example/miner-wrapper.es5.min.js

miner/miner.es5.min.js: miner/miner.es5.js
	browserify miner/miner.es5.js -o miner/miner.es5.min.js -p tinyify

miner/miner.es5.js: miner/miner.js babel.config.js
	babel miner/miner.js -o miner/miner.es5.js

example/miner-wrapper.es5.min.js: example/miner-wrapper.es5.js
	browserify example/miner-wrapper.es5.js -o example/miner-wrapper.es5.min.js -p tinyify

example/miner-wrapper.es5.js: example/miner-wrapper.js babel.config.js
	babel example/miner-wrapper.js -o example/miner-wrapper.es5.js
