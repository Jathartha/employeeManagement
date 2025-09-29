const express = require('express');
const pool = require('./db');

const router = express.Router();

// Helpers
function mapEmployeeRow(row) {
	return { id: row.id, name: row.name, email: row.email, position: row.position };
}

// List employees with optional name filter
router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        if (q) {
            const { rows } = await pool.query('SELECT * FROM employees WHERE name ILIKE $1 ORDER BY id DESC', [`%${q}%`]);
            return res.json(rows.map(mapEmployeeRow));
        }
        const { rows } = await pool.query('SELECT * FROM employees ORDER BY id DESC');
        res.json(rows.map(mapEmployeeRow));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Get single employee
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
        const row = rows[0];
        if (!row) return res.status(404).json({ error: 'Employee not found' });
        res.json(mapEmployeeRow(row));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// Create employee
router.post('/', async (req, res) => {
    try {
        const { name, email, position } = req.body;
        if (!name || !email || !position) {
            return res.status(400).json({ error: 'name, email, and position are required' });
        }
        const insert = await pool.query('INSERT INTO employees (name, email, position) VALUES ($1, $2, $3) RETURNING *', [name, email, position]);
        res.status(201).json(mapEmployeeRow(insert.rows[0]));
    } catch (err) {
        if (String(err.message).toLowerCase().includes('unique')) {
            return res.status(409).json({ error: 'Email must be unique' });
        }
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// Update employee
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, position } = req.body;
        if (!name || !email || !position) {
            return res.status(400).json({ error: 'name, email, and position are required' });
        }
        const { rowCount, rows } = await pool.query('UPDATE employees SET name=$1, email=$2, position=$3 WHERE id=$4 RETURNING *', [name, email, position, id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
        res.json(mapEmployeeRow(rows[0]));
    } catch (err) {
        if (String(err.message).toLowerCase().includes('unique')) {
            return res.status(409).json({ error: 'Email must be unique' });
        }
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Delete employee
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        if (rowCount === 0) return res.status(404).json({ error: 'Employee not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

module.exports = router;


