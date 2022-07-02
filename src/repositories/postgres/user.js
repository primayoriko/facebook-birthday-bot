const db = require("../../db/postgres/index");

function getUsersFromDB() {
	return db.query("SELECT * FROM Users");
}

function getUserByPSIDFromDB(psid) {
	return db.query(
		"SELECT * FROM Users WHERE psid = $1",
		[psid]    
	);
}

function insertUserToDB(psid, name) {
	return db.query(
		"INSERT INTO Users(psid, name) VALUES($1, $2)",
		[psid, name]
	);
}

module.exports = {
	getUsersFromDB,
	getUserByPSIDFromDB,
	insertUserToDB
};
