const request = require('supertest');
process.env.NODE_ENV = 'test';
const { app } = require('../src/app');
const db = require('../src/db');

describe('Employees CRUD API', () => {
	beforeAll((done) => {
		// Ensure table is clean for each run
		db.serialize(() => {
			db.run('DELETE FROM employees', () => done());
		});
	});

	afterAll((done) => {
		try {
			db.close(() => done());
		} catch (_) {
			done();
		}
	});

	it('creates an employee', async () => {
		const res = await request(app)
			.post('/api/employees')
			.send({ name: 'Test User', email: 'test@example.com', position: 'Engineer' })
			.expect(201);
		expect(res.body).toMatchObject({ name: 'Test User', email: 'test@example.com', position: 'Engineer' });
		expect(res.body.id).toBeDefined();
	});

	it('lists employees and supports name filtering', async () => {
		await request(app)
			.post('/api/employees')
			.send({ name: 'Alice', email: 'alice@test.com', position: 'PM' })
			.expect(201);
		const list = await request(app).get('/api/employees').expect(200);
		expect(Array.isArray(list.body)).toBe(true);
		const filtered = await request(app).get('/api/employees?q=Ali').expect(200);
		expect(filtered.body.some((e) => e.name.includes('Alice'))).toBe(true);
	});

	it('gets a single employee by id', async () => {
		const created = await request(app)
			.post('/api/employees')
			.send({ name: 'Bob', email: 'bob@test.com', position: 'Dev' })
			.expect(201);
		const id = created.body.id;
		const res = await request(app).get(`/api/employees/${id}`).expect(200);
		expect(res.body.id).toBe(id);
	});

	it('updates an employee', async () => {
		const created = await request(app)
			.post('/api/employees')
			.send({ name: 'Carol', email: 'carol@test.com', position: 'QA' })
			.expect(201);
		const id = created.body.id;
		const updated = await request(app)
			.put(`/api/employees/${id}`)
			.send({ name: 'Carolyn', email: 'carol@test.com', position: 'QA Lead' })
			.expect(200);
		expect(updated.body.name).toBe('Carolyn');
		expect(updated.body.position).toBe('QA Lead');
	});

	it('prevents duplicate emails on create and update', async () => {
		const a = await request(app)
			.post('/api/employees')
			.send({ name: 'E1', email: 'dup@test.com', position: 'X' })
			.expect(201);
		await request(app)
			.post('/api/employees')
			.send({ name: 'E2', email: 'dup@test.com', position: 'Y' })
			.expect(409);
		await request(app)
			.put(`/api/employees/${a.body.id}`)
			.send({ name: 'E1', email: 'dup@test.com', position: 'Z' })
			.expect(200);
	});

	it('deletes an employee', async () => {
		const created = await request(app)
			.post('/api/employees')
			.send({ name: 'Temp', email: 'temp@test.com', position: 'Temp' })
			.expect(201);
		const id = created.body.id;
		await request(app).delete(`/api/employees/${id}`).expect(204);
		await request(app).get(`/api/employees/${id}`).expect(404);
	});
});


