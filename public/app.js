const apiBase = '/api/employees';

const employeesTbody = document.getElementById('employees');
const form = document.getElementById('employee-form');
const formError = document.getElementById('form-error');
const searchInput = document.getElementById('search');
const refreshBtn = document.getElementById('refresh');

const modal = document.getElementById('modal');
const editForm = document.getElementById('edit-form');
const editId = document.getElementById('edit-id');
const editName = document.getElementById('edit-name');
const editEmail = document.getElementById('edit-email');
const editPosition = document.getElementById('edit-position');
const editError = document.getElementById('edit-error');
const cancelBtn = document.getElementById('cancel');

function openModal() {
	modal.classList.remove('hidden');
}
function closeModal() {
	modal.classList.add('hidden');
	editForm.reset();
	editError.textContent = '';
}

async function fetchEmployees() {
	const q = searchInput.value.trim();
	const url = q ? `${apiBase}?q=${encodeURIComponent(q)}` : apiBase;
	const res = await fetch(url);
	const data = await res.json();
	renderEmployees(data);
}

function renderEmployees(employees) {
	employeesTbody.innerHTML = '';
	for (const e of employees) {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td>${escapeHtml(e.name)}</td>
			<td>${escapeHtml(e.email)}</td>
			<td>${escapeHtml(e.position)}</td>
			<td>
				<button data-action="edit" data-id="${e.id}">Edit</button>
				<button data-action="delete" data-id="${e.id}">Delete</button>
			</td>
		`;
		employeesTbody.appendChild(tr);
	}
}

employeesTbody.addEventListener('click', async (ev) => {
	const btn = ev.target.closest('button');
	if (!btn) return;
	const id = btn.getAttribute('data-id');
	const action = btn.getAttribute('data-action');
	if (action === 'edit') {
		const res = await fetch(`${apiBase}/${id}`);
		if (!res.ok) return;
		const employee = await res.json();
		editId.value = employee.id;
		editName.value = employee.name;
		editEmail.value = employee.email;
		editPosition.value = employee.position;
		openModal();
	}
	if (action === 'delete') {
		if (!confirm('Delete this employee?')) return;
		const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' });
		if (res.status === 204) {
			fetchEmployees();
		} else {
			alert('Failed to delete');
		}
	}
});

form.addEventListener('submit', async (ev) => {
	ev.preventDefault();
	formError.textContent = '';
	const formData = new FormData(form);
	const name = formData.get('name').trim();
	const email = formData.get('email').trim();
	const position = formData.get('position').trim();
	if (!name || !email || !position) {
		formError.textContent = 'All fields are required';
		return;
	}
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		formError.textContent = 'Invalid email address';
		return;
	}
	const res = await fetch(apiBase, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email, position })
	});
	if (res.ok) {
		form.reset();
		fetchEmployees();
	} else {
		const err = await safeJson(res);
		formError.textContent = err.error || 'Failed to add employee';
	}
});

editForm.addEventListener('submit', async (ev) => {
	ev.preventDefault();
	editError.textContent = '';
	const id = editId.value;
	const name = editName.value.trim();
	const email = editEmail.value.trim();
	const position = editPosition.value.trim();
	if (!name || !email || !position) {
		editError.textContent = 'All fields are required';
		return;
	}
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
		editError.textContent = 'Invalid email address';
		return;
	}
	const res = await fetch(`${apiBase}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email, position })
	});
	if (res.ok) {
		closeModal();
		fetchEmployees();
	} else {
		const err = await safeJson(res);
		editError.textContent = err.error || 'Failed to update employee';
	}
});

cancelBtn.addEventListener('click', closeModal);
searchInput.addEventListener('input', () => {
	// Debounce-like behavior using setTimeout could be added; fetch immediately for simplicity
	fetchEmployees();
});
refreshBtn.addEventListener('click', fetchEmployees);

function escapeHtml(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

async function safeJson(res) {
	try {
		return await res.json();
	} catch (_) {
		return {};
	}
}

// Initial load
fetchEmployees();


