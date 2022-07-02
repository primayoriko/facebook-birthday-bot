const
	{ sendReply } = require("../services/fb-messenger");

function verifyWebhook(req, res) {
	const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

	let 
		mode = req.query["hub.mode"],
		token = req.query["hub.verify_token"],
		challenge = req.query["hub.challenge"];

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
		body.entry.forEach(entry => {
			let 
				webhookEvent = entry.messaging[0],
				senderPsid = webhookEvent.sender.id,
				validEvent = false,
				response = {};

			if (webhookEvent.message && webhookEvent.message.text) {
				const messageText = webhookEvent.message.text;
				const regex = /^\d{4}-\d{2}-\d{2}$/;

				if (messageText === "Hi") {
					response.text = "What is your first name?";
				} else if (messageText.match(regex) === null) {
					response.text = "When is your birthday? please input in YYYY-MM-DD format";
				} else {
					const positive_response_payload = JSON.stringify({
						"findNextDate": true,
						"date": messageText
					});
					const negative_response_payload = JSON.stringify({
						"findNextDate": false,
					});
					response = {
						"attachment": {
							"type": "template",
							"payload": {
								"template_type": "generic",
								"elements": [{
									"title": `Your Birthday is on ${messageText}`,
									"subtitle": "Find your how long until your next birthday date?",
									// "image_url": attachmentUrl,
									"buttons": [
										{
											"type": "postback",
											"title": "yes",
											"payload": positive_response_payload,
										},
										{
											"type": "postback",
											"title": "no",
											"payload": negative_response_payload,
										}
									],
								}]
							}
						}
					};
				}

				validEvent = true;

			} else if (webhookEvent.postback) {
				const payload = JSON.parse(webhookEvent.postback.payload);
				
				if (!payload.findNextDate) {
					response.text = "Goodbye👋";
					
				} else {
					const
						currDate = new Date(), 
						dateArr = payload.date
							.split("-")
							.map(num => parseInt(num));

					let birthDate = new Date(currDate.getFullYear(), dateArr[1] - 1, dateArr[2]);
					
					if (birthDate < currDate) {
						birthDate = new Date(currDate.getFullYear() + 1, dateArr[1] - 1, dateArr[2]);
					}

					const daysDiff = Math.ceil((birthDate - currDate)/(1000*60*60*24));
					
					response.text = `There are ${daysDiff} days left until your next birthday`;
				}
				
				validEvent = true;
			}

			if (validEvent) {
				sendReply(senderPsid, response)
					.catch(err => {
						console.log(err);
					});
			}
		});
		res.status(200).send("EVENT_RECEIVED");
	} else {
		res.sendStatus(404);
	}
}

module.exports = {
	verifyWebhook,
	handleWebhook
};