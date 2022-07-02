const 
	{ Pool, types } = require("pg"),
	pool = new Pool();

// parse bigint as number in js 
types.setTypeParser(20, function(val) {
	return parseInt(val, 10);
});

module.exports = pool;
