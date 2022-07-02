const
	{ sendReply } = require("../services/api/fb"),
	{ insertMessage } = require("../services/postgres/message"),
	{ findDaysLeftTillNextBirthdayFromNow, createFBGenericChatboxForAskNextBirthday }
		= require("../utils/birthdate-utils");

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
					response = {},
					textToSave;
				// console.log(webhookEvent, senderPsid);

				if (!webhookEvent.message || !webhookEvent.message.is_echo) {
					emergencyPsid = senderPsid;
				}

				if (webhookEvent.message && webhookEvent.message.text && !webhookEvent.message.is_echo) {
					const 
						messageText = webhookEvent.message.text,
						regex = /^\d{4}-\d{2}-\d{2}$/;

					textToSave = messageText;

					if (messageText === "Hi") {
						response.text = "What is your first name?";
					} else if (messageText.match(regex) === null) {
						response.text = "When is your birth date? Please input in YYYY-MM-DD format";
					} else {
						response = createFBGenericChatboxForAskNextBirthday(messageText);
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
					textToSave = payload.text;
				}

				if (validEvent) {
					try {
						await insertMessage(senderPsid, textToSave);
						await sendReply(senderPsid, response);
					} catch(err) { 
						console.log(err);
					}
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