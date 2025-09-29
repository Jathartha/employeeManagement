const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';
const databaseUrl = process.env.DATABASE_URL || '';
if (!databaseUrl) {
	console.error('DATABASE_URL is required for Postgres');
}

const pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function initializeSchema() {
	await pool.query(
		`CREATE TABLE IF NOT EXISTS employees (
			id SERIAL PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			position TEXT NOT NULL
		)`
	);
}

initializeSchema().catch((err) => {
	console.error('Failed to initialize schema', err);
});

module.exports = pool;


