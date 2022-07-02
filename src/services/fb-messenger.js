const
	axios = require("axios").default;
	// querystring = require("querystring");

// function handleMessage(senderPsid, receivedMessage) {
// 	let response;

// 	// Checks if the message contains text
// 	if (receivedMessage.text) {
// 		// Create the payload for a basic text message, which
// 		// will be added to the body of your request to the Send API
// 		response = {
// 			"text": `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`
// 		};
// 	} else if (receivedMessage.attachments) {

// 		// Get the URL of the message attachment
// 		let attachmentUrl = receivedMessage.attachments[0].payload.url;
// 		response = {
// 			"attachment": {
// 				"type": "template",
// 				"payload": {
// 					"template_type": "generic",
// 					"elements": [{
// 						"title": "Is this the right picture?",
// 						"subtitle": "Tap a button to answer.",
// 						"image_url": attachmentUrl,
// 						"buttons": [
// 							{
// 								"type": "postback",
// 								"title": "Yes!",
// 								"payload": "yes",
// 							},
// 							{
// 								"type": "postback",
// 								"title": "No!",
// 								"payload": "no",
// 							}
// 						],
// 					}]
// 				}
// 			}
// 		};
// 	}

// 	// Send the response message
// 	callSendAPI(senderPsid, response);
// }

// // Handles messaging_postbacks events
// function handlePostback(senderPsid, receivedPostback) {
// 	let response;

// 	// Get the payload for the postback
// 	let payload = receivedPostback.payload;

// 	// Set the response based on the postback payload
// 	if (payload === "yes") {
// 		response = { "text": "Thanks!" };
// 	} else if (payload === "no") {
// 		response = { "text": "Oops, try sending another image." };
// 	}
// 	// Send the message to acknowledge the postback
// 	callSendAPI(senderPsid, response);
// }

// // Sends response messages via the Send API
// function callSendAPI(senderPsid, response) {

// 	// The page access token we have generated in your app settings
// 	const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// 	// Construct the message body
// 	let requestBody = {
// 		"recipient": {
// 			"id": senderPsid
// 		},
// 		"message": response
// 	};

// 	// Send the HTTP request to the Messenger Platform
// 	request({
// 		"uri": "https://graph.facebook.com/v2.6/me/messages",
// 		"qs": { "access_token": PAGE_ACCESS_TOKEN },
// 		"method": "POST",
// 		"json": requestBody
// 	}, (err, _res, _body) => {
// 		if (!err) {
// 			console.log("Message sent!");
// 		} else {
// 			console.error("Unable to send message:" + err);
// 		}
// 	});
// }

async function sendReply(psid, message) {
	const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

	let requestBody = {
		"recipient": {
			"id": psid
		},
		"message": message
	};

	return axios.post(
		"https://graph.facebook.com/v2.6/me/messages",
		requestBody,
		{ params: { "access_token": PAGE_ACCESS_TOKEN } }
	);
}

async function getProfileName(userPsid) {
	let name;
	const profile = await axios.get(`https://graph.facebook.com/v2.6/${userPsid}`); 

	if (profile.last_name == undefined) {
		name = profile.first_name;
	} else {
		name = 	`${profile.first_name} ${profile.last_name}`;
	}

	return name;
}

module.exports = {
	sendReply,
	getProfileName
};