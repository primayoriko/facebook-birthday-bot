require("dotenv").config({ path: `${__dirname}/../../../.env` });

const 
	{ Pool } = require("pg"),
	pool = new Pool();

module.exports = pool;
