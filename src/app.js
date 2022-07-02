"use strict";

require("dotenv").config({ path: `${__dirname}/../.env` });

const
	express = require("express"),
	{ urlencoded, json } = require("body-parser"),
	addFBWebhookRoutes = require("./routes/fb-webhook"),
	addMessageAPIRoutes = require("./routes/api/message"),
	app = express();

initWebhookAppServer(app);

async function initWebhookAppServer(app) {
	app.use(urlencoded({ extended: true }));

	app.use(json());

	app.get("/healthcheck", function (req, res) {
		res.send({
			status: "healthy"
		});
	});

	addFBWebhookRoutes(app);

	addMessageAPIRoutes(app);

	var listener = app.listen(process.env.PORT, function() {
		console.log("Your app is listening on port " + listener.address().port);
	});
}
