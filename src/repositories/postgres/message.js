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

function insertMessageToDB(messageText, userPsid) {
	return db.query(
		"INSERT INTO messages(text, user_psid) VALUES($1, $2)",
		[messageText, userPsid]
	);
}

module.exports = {
	getMessagesFromDB,
	getMessageByIDFromDB,
	insertMessageToDB
};
