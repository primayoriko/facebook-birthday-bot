const
	{ sendReply } = require("../services/fb-messenger");

function verifyWebhook(req, res) {
	const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

	let mode = req.query["hub.mode"];
	let token = req.query["hub.verify_token"];
	let challenge = req.query["hub.challenge"];

	if (mode && token) {

		if (mode === "subscribe" && token === VERIFY_TOKEN) {
			// console.log("WEBHOOK_VERIFIED");
			res.status(200).send(challenge);

		} else {
			res.sendStatus(403);
		}
	}
}

async function handleWebhook(req, res) {
	let body = req.body;

	if (body.object === "page") {

		body.entry.forEach(function(entry) {

			let webhookEvent = entry.messaging[0];
			// console.log(webhookEvent);

			let senderPsid = webhookEvent.sender.id;

			let response;
			// console.log("Sender PSID: " + senderPsid);
			let validEvent = false;

			if (webhookEvent.message) {
				const messageText = webhookEvent.message.text;
				const regex = /^\d{4}-\d{2}-\d{2}$/;

				if (messageText === "Hi") {
					response = "What is your first name?";
				} else if (messageText.match(regex) === null) {
					response = "When is your birthday? please input in YYYY-MM-DD format";
				} else {
					response = {
						"attachment": {
							"type": "template",
							"payload": {
								"template_type": "generic",
								"elements": [{
									"title": `Your Birthday is on ${messageText}`,
									"subtitle": "Find your next birthday date?",
									// "image_url": attachmentUrl,
									"buttons": [
										{
											"type": "postback",
											"title": "yes",
											"payload": {
												"findNextDate": true,
												"date": messageText
											},
										},
										{
											"type": "postback",
											"title": "no",
											"payload": {
												"findNextDate": false,
											},
										}
									],
								}]
							}
						}
					};
				}

				// handleMessage(senderPsid, webhookEvent.message);
				validEvent = true;
			} else if (webhookEvent.postback) {
				const payload = JSON.parse(webhookEvent.postback.payload);
				
				if (!payload.findNextDate) {
					response = "Goodbye👋";
				} else {
					const dateArr = payload.date
						.split("-")
						.map(num => parseInt(num));
					let birthDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
					let currDate = new Date();
					
					if (birthDate < currDate) {
						birthDate = new Date(dateArr[2] + 1, dateArr[1] - 1, dateArr[0]);
					}

					const daysDiff = Math.ceil((birthDate - currDate)/(1000*60*60*24));
					
					response = `There are ${daysDiff} days left until your next birthday`;
				}
				// handlePostback(senderPsid, webhookEvent.postback);
				validEvent = true;
			}

			if (validEvent) {
				sendReply(senderPsid, response);
				res.status(200).send("EVENT_RECEIVED");
				return;
			}
		});

	} else {
		res.sendStatus(404);
	}
}

module.exports = {
	verifyWebhook,
	handleWebhook
};