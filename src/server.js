const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Ensure DB is initialized
require('./db');

const employeesRouter = require('./routes.employees');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/employees', employeesRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});


