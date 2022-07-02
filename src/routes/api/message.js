const { handleGetMessages, handleGetMessageByID, handleGetSummary } 
    = require("../../handlers/api/message");

function addRoutes(app) {
	app.get("/messages/:id", handleGetMessageByID);
	app.get("/messages", handleGetMessages);
	app.get("/summary", handleGetSummary);
}

module.exports = addRoutes;
