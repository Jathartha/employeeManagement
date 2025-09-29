const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const isTest = process.env.NODE_ENV === 'test';
const databaseFilePath = isTest
	? ':memory:'
	: (process.env.DATABASE_FILE || path.join(__dirname, '..', 'data.sqlite'));

// Ensure parent directory exists for file-based DBs
if (databaseFilePath !== ':memory:') {
	const parentDirectoryPath = path.dirname(databaseFilePath);
	try {
		fs.mkdirSync(parentDirectoryPath, { recursive: true });
	} catch (_) {
		// Ignore mkdir errors; sqlite open will surface issues if any remain
	}
}

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


