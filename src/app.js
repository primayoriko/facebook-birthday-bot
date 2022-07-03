"use strict";

require("dotenv").config({ path: `${__dirname}/../.env` });

const
	express = require("express"),
	{ urlencoded, json } = require("body-parser"),
	loggerMiddleware = require("./middlewares/logger"),
	addFBWebhookRoutes = require("./routes/fb-webhook"),
	addMessageAPIRoutes = require("./routes/api/message"),
	logger = require("./utils/logger"),
	app = express();

initWebhookAppServer(app);

async function initWebhookAppServer(app) {
	app.use(urlencoded({ extended: true }));

	app.use(json());

	app.use(loggerMiddleware);

	app.get("/healthcheck", function (req, res) {
		res.send({
			status: "healthy"
		});
	});

	addFBWebhookRoutes(app);

	addMessageAPIRoutes(app);

	const listener = app.listen(process.env.SERVER_PORT, function(err) {
		if (err) {
			logger.error(err);
		}
		logger.info("Your app is listening on port " + listener.address().port);
	});
}

module.exports = app;
