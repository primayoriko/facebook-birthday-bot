const
	{ verifyWebhook, handleWebhook } = require("../handlers/fb-webhook");


function addRoutes(app) {
	app.get("/webhook", verifyWebhook);
	app.post("/webhook", handleWebhook);
}

module.exports = addRoutes;