const { getUsersFromDB, getUserByPSIDFromDB, insertUserToDB } 
        = require("../../repositories/postgres/User");

async function getUsers() {
	const { rows } = await getUsersFromDB();
	return rows;
}

async function getUserByPSID(psid) {
	const { rows } = await getUserByPSIDFromDB(psid);
	return rows.length > 0 ? rows[0] : null;
}

async function insertUser(userPsid, username) {
	await insertUserToDB(userPsid, username);
}

module.exports = {
	getUsers,
	getUserByPSID,
	insertUser,
};
