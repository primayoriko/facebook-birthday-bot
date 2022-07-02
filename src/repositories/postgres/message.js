const db = require("../../db/postgres/index");

function getMessagesFromDB() {
	return db.query("SELECT * FROM messages");
}

function getMessageByIDFromDB(id) {
	return db.query(
		"SELECT * FROM messages WHERE id = $1",
		[id]    
	);
}

function insertMessageToDB(userPsid, messageText) {
	return db.query(
		"INSERT INTO messages(user_psid, message_text) VALUES($1, $2)",
		[userPsid, messageText]
	);
}

module.exports = {
	getMessagesFromDB,
	getMessageByIDFromDB,
	insertMessageToDB
};
