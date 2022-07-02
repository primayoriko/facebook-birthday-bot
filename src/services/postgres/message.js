const { getProfileName } = require("../fb-messenger"),
	{ getMessagesFromDB, getMessageByIDFromDB, insertMessageToDB } 
        = require("../../repositories/postgres/message"),
	{ getUsers, getUserByPSID, insertUser } 
        = require("./user");

async function getMessages() {
	const { rows } = await getMessagesFromDB();
	return rows;
}

async function getMessageByID(id) {
	const { rows } = await getMessageByIDFromDB(id);
	return rows.length > 0 ? rows[0] : null;
}

async function getSummary() {
	const 
		users = await getUsers(),
		{ rows } = await getMessagesFromDB(),
		messagesMap = {};

	rows.forEach(message => {
		if (messagesMap[message.user_psid] === undefined) {
			messagesMap[message.user_psid] = [];
		}
		messagesMap[message.user_psid].push(message.text);
	});

	const summary = users.map(userData => {
		const userMessages = messagesMap[userData.psid] === undefined?
			[] : messagesMap[userData.psid];
		return {
			"user": userData.psid,
			"name": userData.name,
			"messages": userMessages
		};
	});

	return summary;
}

async function insertMessage(userPsid, messageText) {
	const user = await getUserByPSID(userPsid);
	if (user === null) {
		const username = await getProfileName(userPsid);
		await insertUser(userPsid, username);
	}
	await insertMessageToDB(userPsid, messageText);
}

module.exports = {
	getMessages,
	getMessageByID,
	getSummary,
	insertMessage,
};
