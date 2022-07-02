const db = require("../../db/postgres/index");

migrateDB()
	.then(_ => console.log("migrated-down successfully"))
	.catch(err => console.log(err));


async function migrateDB() {
	await db.query("DROP TABLE IF EXISTS messages CASCADE");
	await db.query("DROP TABLE IF EXISTS users CASCADE");
}
