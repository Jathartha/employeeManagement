# Employee CRUD App

A simple Express + SQLite app with a minimal HTML/JS frontend.

## Run

```
npm install
npm run start
```

Open http://localhost:3000.

## Dev (auto-reload)

```
npm run dev
```

## API

- GET /api/health → { ok: true }
- GET /api/employees?q=<name> → list employees
- GET /api/employees/:id → one employee
- POST /api/employees → create { name, email, position }
- PUT /api/employees/:id → update { name, email, position }
- DELETE /api/employees/:id → delete

## Tests

```
npm test
```

Tests use an in-memory SQLite database.

## Deploy (Render)
1. Commit and push to GitHub.
2. Create a new Web Service in Render, select your repo.
3. Use these settings (or keep defaults where not listed):
   - Build Command: `npm install`
   - Start Command: `node src/server.js`
   - Environment: `Node`
   - Add a Disk: name `data`, mount path `/data`, size `1GB`
   - Add env vars: `NODE_ENV=production`, `DATABASE_FILE=/data/data.sqlite`
4. Deploy. The app will be available at your Render URL.
