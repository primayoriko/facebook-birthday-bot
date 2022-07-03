const {transports, createLogger, format} = require("winston");

const fileFormat = format.combine(
	format.timestamp(),
	format.json()
);

const logger = createLogger({
	transports: [
		new transports.File({
			filename: "logs/error.log", 
			level: "error",
			format: fileFormat
		}),
		new transports.File({
			filename: "logs/all.log", 
			format: fileFormat
		}),
		new transports.Console({ 
			format: format.combine(
				format.simple(),
				format.colorize()
			)}),
	]
});

module.exports = logger;
