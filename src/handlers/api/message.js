const { getMessageByID, getMessages, getSummary } = 
    require("../../services/postgres/message");

async function handleGetMessages(req, res) {
	try {
		const messages = await getMessages();
		res.send(messages);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: "internal server error" });
	}
}

async function handleGetMessageByID(req, res) {
	try {
		const 
			messageId = +req.params.id,
			message = await getMessageByID(messageId);

		if (message === null) {
			res.status(404).send({ message: "message with specified id not found" });
		} else {
			res.send(message);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: "internal server error" });
	}
}

async function handleGetSummary(req, res) {
	try {
		const summary = await getSummary();
		res.send(summary);
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: "internal server error" });
	}
}

module.exports = {
	handleGetMessages,
	handleGetMessageByID,
	handleGetSummary
};
