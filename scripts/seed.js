/* Seed 30 Indian employees into SQLite */
const db = require('../src/db');

const employees = [
	{ name: 'Aarav Sharma', email: 'aarav.sharma@example.com', position: 'Engineer' },
	{ name: 'Vivaan Gupta', email: 'vivaan.gupta@example.com', position: 'Manager' },
	{ name: 'Aditya Verma', email: 'aditya.verma@example.com', position: 'Analyst' },
	{ name: 'Vihaan Mehta', email: 'vihaan.mehta@example.com', position: 'Engineer' },
	{ name: 'Arjun Iyer', email: 'arjun.iyer@example.com', position: 'Designer' },
	{ name: 'Sai Reddy', email: 'sai.reddy@example.com', position: 'Engineer' },
	{ name: 'Krishna Rao', email: 'krishna.rao@example.com', position: 'QA' },
	{ name: 'Ishaan Nair', email: 'ishaan.nair@example.com', position: 'Engineer' },
	{ name: 'Reyansh Kulkarni', email: 'reyansh.kulkarni@example.com', position: 'Product Manager' },
	{ name: 'Shaurya Desai', email: 'shaurya.desai@example.com', position: 'Engineer' },
	{ name: 'Arnav Chatterjee', email: 'arnav.chatterjee@example.com', position: 'DevOps' },
	{ name: 'Anay Banerjee', email: 'anay.banerjee@example.com', position: 'Engineer' },
	{ name: 'Atharv Joshi', email: 'atharv.joshi@example.com', position: 'Support' },
	{ name: 'Vihaan Singh', email: 'vihaan.singh@example.com', position: 'Engineer' },
	{ name: 'Ritvik Malhotra', email: 'ritvik.malhotra@example.com', position: 'Engineer' },
	{ name: 'Devansh Kapoor', email: 'devansh.kapoor@example.com', position: 'QA' },
	{ name: 'Pranav Sinha', email: 'pranav.sinha@example.com', position: 'Engineer' },
	{ name: 'Dhruv Mishra', email: 'dhruv.mishra@example.com', position: 'Engineer' },
	{ name: 'Karthik Srinivasan', email: 'karthik.srinivasan@example.com', position: 'Architect' },
	{ name: 'Rohan Menon', email: 'rohan.menon@example.com', position: 'Engineer' },
	{ name: 'Ananya Sharma', email: 'ananya.sharma@example.com', position: 'Designer' },
	{ name: 'Isha Gupta', email: 'isha.gupta@example.com', position: 'Engineer' },
	{ name: 'Diya Patel', email: 'diya.patel@example.com', position: 'Analyst' },
	{ name: 'Avni Shah', email: 'avni.shah@example.com', position: 'Engineer' },
	{ name: 'Aanya Jain', email: 'aanya.jain@example.com', position: 'QA' },
	{ name: 'Myra Agarwal', email: 'myra.agarwal@example.com', position: 'Engineer' },
	{ name: 'Kiara Bansal', email: 'kiara.bansal@example.com', position: 'Product Manager' },
	{ name: 'Sara Khanna', email: 'sara.khanna@example.com', position: 'Engineer' },
	{ name: 'Aadhya Reddy', email: 'aadhya.reddy@example.com', position: 'Support' },
	{ name: 'Navya Nair', email: 'navya.nair@example.com', position: 'Engineer' }
];

db.serialize(() => {
	const insert = db.prepare('INSERT OR IGNORE INTO employees (name, email, position) VALUES (?, ?, ?)');
	for (const e of employees) {
		insert.run([e.name, e.email, e.position]);
	}
	insert.finalize((err) => {
		if (err) {
			console.error('Seed failed:', err.message);
			process.exit(1);
		}
		db.get('SELECT COUNT(*) as count FROM employees', (err2, row) => {
			if (err2) {
				console.error('Count failed:', err2.message);
				process.exit(1);
			}
			console.log(`Seed complete. Total employees: ${row.count}`);
			process.exit(0);
		});
	});
});


