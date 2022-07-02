const
	{ sendReply } = require("../services/fb-messenger"),
	{ insertMessage } = require("../services/postgres/message"),
	{ findDaysLeftTillNextBirthdayFromNow } = require("../utils/date-utils");

async function verifyWebhook(req, res) {
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
	let emergencyPsid;
	try {
		const body = req.body;

		if (body.object === "page") {
			for (let i = 0; i < body.entry.length; i++) {
				const entry = body.entry[i];
				let 
					webhookEvent = entry.messaging[0],
					senderPsid = webhookEvent.sender.id,
					validEvent = false,
					response = {};
				emergencyPsid = senderPsid;

				if (webhookEvent.message && webhookEvent.message.text) {
					const messageText = webhookEvent.message.text;
					const regex = /^\d{4}-\d{2}-\d{2}$/;

					if (messageText === "Hi") {
						response.text = "What is your first name?";
					} else if (messageText.match(regex) === null) {
						response.text = "When is your birth date? please input in YYYY-MM-DD format";
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
										"title": `Your birth date is on ${messageText}`,
										"subtitle": "Find your how many days left until your next birthday?",
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

				} else if (webhookEvent.postback && webhookEvent.postback.payload) {
					const payload = JSON.parse(webhookEvent.postback.payload);

					if (!payload.findNextDate) {
						response.text = "Goodbye👋";
					
					} else if (payload.findNextDate) {
						const daysLeft = findDaysLeftTillNextBirthdayFromNow(payload.date);
					
						response.text = `There are ${daysLeft} days left until your next birthday`;
					}
				
					validEvent = true;
				}

				if (validEvent) {
					try {
						await sendReply(senderPsid, response);
					} catch(err) { }
					break;
				}
			}

			res.status(200).send("EVENT_RECEIVED");
		} else {
			res.sendStatus(404);
		}
	} catch (err) {
		console.log(err);
		await sendReply(emergencyPsid, {
			"text": "Something wrong in previous message, please resend again"
		});
		res.status(200).send("EVENT_RECEIVED");
	}
}

module.exports = {
	verifyWebhook,
	handleWebhook
};