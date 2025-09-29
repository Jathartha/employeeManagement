const express = require('express');
const db = require('./db');

const router = express.Router();

// Helpers
function mapEmployeeRow(row) {
	return { id: row.id, name: row.name, email: row.email, position: row.position };
}

// List employees with optional name filter
router.get('/', (req, res) => {
	const { q } = req.query;
	const like = q ? `%${q}%` : null;
	const sql = like
		? 'SELECT * FROM employees WHERE name LIKE ? ORDER BY id DESC'
		: 'SELECT * FROM employees ORDER BY id DESC';
	const params = like ? [like] : [];
	db.all(sql, params, (err, rows) => {
		if (err) return res.status(500).json({ error: 'Failed to fetch employees' });
		res.json(rows.map(mapEmployeeRow));
	});
});

// Get single employee
router.get('/:id', (req, res) => {
	const { id } = req.params;
	db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
		if (err) return res.status(500).json({ error: 'Failed to fetch employee' });
		if (!row) return res.status(404).json({ error: 'Employee not found' });
		res.json(mapEmployeeRow(row));
	});
});

// Create employee
router.post('/', (req, res) => {
	const { name, email, position } = req.body;
	if (!name || !email || !position) {
		return res.status(400).json({ error: 'name, email, and position are required' });
	}
	const sql = 'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)';
	db.run(sql, [name, email, position], function (err) {
		if (err) {
			if (err && String(err.message).includes('UNIQUE')) {
				return res.status(409).json({ error: 'Email must be unique' });
			}
			return res.status(500).json({ error: 'Failed to create employee' });
		}
		db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err2, row) => {
			if (err2) return res.status(500).json({ error: 'Failed to fetch created employee' });
			res.status(201).json(mapEmployeeRow(row));
		});
	});
});

// Update employee
router.put('/:id', (req, res) => {
	const { id } = req.params;
	const { name, email, position } = req.body;
	if (!name || !email || !position) {
		return res.status(400).json({ error: 'name, email, and position are required' });
	}
	const sql = 'UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?';
	db.run(sql, [name, email, position, id], function (err) {
		if (err) {
			if (String(err.message).includes('UNIQUE')) {
				return res.status(409).json({ error: 'Email must be unique' });
			}
			return res.status(500).json({ error: 'Failed to update employee' });
		}
		if (this.changes === 0) return res.status(404).json({ error: 'Employee not found' });
		db.get('SELECT * FROM employees WHERE id = ?', [id], (err2, row) => {
			if (err2) return res.status(500).json({ error: 'Failed to fetch updated employee' });
			res.json(mapEmployeeRow(row));
		});
	});
});

// Delete employee
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
		if (err) return res.status(500).json({ error: 'Failed to delete employee' });
		if (this.changes === 0) return res.status(404).json({ error: 'Employee not found' });
		res.status(204).send();
	});
});

module.exports = router;


