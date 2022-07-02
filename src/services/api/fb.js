const
	axios = require("axios").default, 
	PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

async function sendReply(psid, message) {
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

	const profile = (await axios.get(
		`https://graph.facebook.com/v2.6/${userPsid}`,
		{ params: { "access_token": PAGE_ACCESS_TOKEN } }
	)).data; 
	
	if(profile.first_name !== undefined) {
		if (profile.last_name == undefined) {
			name = profile.first_name;
		} else {
			name = 	`${profile.first_name} ${profile.last_name}`;
		}
	} else {
		name = profile.name;
	}

	return name;
}

module.exports = {
	sendReply,
	getProfileName
};