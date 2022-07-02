const
	axios = require("axios").default;

async function sendReply(psid, message) {
	const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

	let requestBody = {
		"recipient": {
			"id": psid
		},
		"message": message
	};

	// request({
	// 	"uri": "https://graph.facebook.com/v2.6/me/messages",
	// 	"qs": { "access_token": PAGE_ACCESS_TOKEN },
	// 	"method": "POST",
	// 	"json": requestBody
	// }, (err, _res, _body) => {
	// 	if (!err) {
	// 		console.log("Message sent!");
	// 		console.log(_body);
	// 	} else {
	// 		console.error("Unable to send message:" + err);
	// 	}
	// });
	// console.log(requestBody);

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