const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databaseFilePath = path.join(__dirname, '..', 'data.sqlite');

// Create or open the SQLite database
const db = new sqlite3.Database(databaseFilePath);

// Initialize schema
db.serialize(() => {
	db.run(
		`CREATE TABLE IF NOT EXISTS employees (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			position TEXT NOT NULL
		)`
	);
});

module.exports = db;


