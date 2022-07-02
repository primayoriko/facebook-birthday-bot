const db = require("../../db/postgres/index");

migrateDB()
	.then(_ => console.log("migrated successfully"))
	.catch(err => console.log(err));


async function migrateDB() {
	const 
		createUsersTableQuery = 
            `CREATE TABLE IF NOT EXISTS users (
                psid integer NOT NULL UNIQUE,
                name varchar(255) NOT NULL,
                PRIMARY KEY(psid)
            )`,
		createMessagesTableQuery = 
            `CREATE TABLE IF NOT EXISTS messages (
                id serial PRIMARY KEY,
                user_psid integer NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_psid) REFERENCES users(psid) ON DELETE CASCADE ON UPDATE CASCADE
            )`;
    
	await db.query(createUsersTableQuery);
	await db.query(createMessagesTableQuery);
}
