const logger = require("../utils/logger");

function loggerMiddleware (req, res, next) {
	const endpoint = `${req.method}: ${req.url}`;
    
	logger.info(`accessing ${endpoint}`);

	res.on("finish", function() {
		logger.info(`returning ${endpoint} with ${this.statusCode} code`);
	});
    
	next();
}

module.exports = loggerMiddleware;
