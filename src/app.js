const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Ensure DB is initialized (resolves to in-memory when NODE_ENV=test)
require('./db');

const employeesRouter = require('./routes.employees');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/employees', employeesRouter);

// Serve static frontend (skip when running tests to reduce noise)
if (process.env.NODE_ENV !== 'test') {
	app.use(express.static(path.join(__dirname, '..', 'public')));
}

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

module.exports = { app };


