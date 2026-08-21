# StaffFlow

StaffFlow is a full-stack employee management dashboard for small and growing teams. It keeps employee records, departments, daily attendance, and HR reporting in one responsive workspace with role-aware authentication.

The codebase intentionally uses familiar React patterns: pages own feature state, presentational components receive data through props, callbacks report user actions upward, and TanStack Query owns remote server state.

## Features

- Secure admin and read-only demo login with a JWT stored in an HTTP-only cookie
- Backend-enforced demo write protection across employees, departments, and attendance
- Protected dashboard pages and authenticated API routes
- Employee CRUD with reusable add/edit form, Zod validation, and duplicate-email handling
- Combined employee search, department/status filters, name sorting, and API pagination
- Delete confirmation, loading/error/empty states, and toast feedback
- Department CRUD with live employee counts and referential delete protection
- Date-based attendance register with Present, Absent, and Leave statuses
- Duplicate-safe attendance upserts for each employee/date pair
- Live dashboard and report statistics calculated from MongoDB
- Responsive desktop, tablet, and mobile navigation and horizontally scrollable data tables
- Realistic, idempotent demo seed script
- API integration test that uses an isolated in-memory MongoDB instance

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 |
| Server state | TanStack Query, Axios |
| Forms | React Hook Form, Zod, Hook Form resolvers |
| UI | Lucide React, Sonner toasts |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only cookies, bcryptjs |
| Security | Helmet, strict CORS, rate limiting, request validation |

## Project architecture

```text
staffflow/
├── app/                         # Next.js App Router pages and feature folders
│   ├── dashboard/
│   │   ├── employees/           # Types, services, forms, table, filters
│   │   ├── departments/         # Department CRUD feature
│   │   ├── attendance/          # Daily attendance feature
│   │   └── reports/             # Summary reporting feature
│   ├── login/                   # Admin and automatic demo login
│   └── providers.tsx            # Query Client and toast providers
├── components/                  # Shared layout and UI components
├── lib/                         # Axios client and date helpers
├── services/                    # Cross-feature authentication service
├── proxy.ts                     # Dashboard route proxy entry point
└── server/
    └── src/
        ├── config/              # Validated environment and database setup
        ├── controllers/         # HTTP request handlers
        ├── middleware/          # Auth, validation, and central errors
        ├── models/              # Mongoose models and indexes
        ├── routes/              # Express routers
        ├── scripts/             # Demo seed command
        ├── tests/               # API integration harness
        ├── utils/               # DTO, date, regex, async helpers
        ├── validators/          # Zod request schemas
        ├── app.ts               # Express application
        └── server.ts            # Database connection and HTTP startup
```

## Requirements

- Node.js 20.9 or newer
- npm
- MongoDB Community Server, a MongoDB Docker container, or a MongoDB Atlas database

## Installation

Install the frontend and backend dependencies from the project root:

```bash
npm install
npm --prefix server install
```

Create local environment files:

```powershell
Copy-Item .env.example .env.local
Copy-Item server/.env.example server/.env
```

On macOS or Linux, use `cp .env.example .env.local` and `cp server/.env.example server/.env`.

## Environment variables

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/staffflow
JWT_SECRET=replace-with-at-least-32-random-characters
CLIENT_URL=http://localhost:3000
NODE_ENV=development
APP_TIMEZONE=Asia/Karachi
ALLOW_REGISTRATION=false
DEMO_LOGIN_ENABLED=true
DEMO_LOGIN_EMAIL=demo@staffflow.demo
SEED_ADMIN_NAME=StaffFlow Admin
SEED_ADMIN_EMAIL=admin@staffflow.demo
SEED_ADMIN_PASSWORD=replace-with-a-strong-demo-password
SEED_DEMO_NAME=StaffFlow Demo
SEED_DEMO_EMAIL=demo@staffflow.demo
SEED_DEMO_PASSWORD=replace-with-a-separate-demo-password
```

Use a long random value for `JWT_SECRET`. Real secrets belong only in `server/.env`; all `.env` files remain ignored by Git while the placeholder `.env.example` files are committed.

`CLIENT_URL` must exactly match the frontend origin. Change it if Next.js runs on a port other than 3000.

## Seed demo data

Make sure MongoDB is running and the backend environment is configured, then run:

```bash
npm run seed
```

The command safely upserts four departments, twelve fictional employees, today's attendance, one administrator, and one read-only demo user. It can be run again without duplicating those records. Existing user passwords and roles are not replaced, so rerunning the seed does not change the current administrator password.

Administrator login:

- Email: the value of `SEED_ADMIN_EMAIL` (the example uses `admin@staffflow.demo`)
- Password: the value you set in `SEED_ADMIN_PASSWORD`

The password is read from the environment and is never hard-coded in application source.

Portfolio demo login:

- Set `DEMO_LOGIN_ENABLED=true`.
- Set `DEMO_LOGIN_EMAIL` to the same address as `SEED_DEMO_EMAIL`.
- Use the **Login as Demo** button; the browser never receives or stores the demo password.

The API creates the demo session only for the seeded `demo` role. Demo sessions can use normal read endpoints, while API middleware rejects application writes with HTTP 403.

## Run StaffFlow

Start the API in one terminal:

```bash
npm run server:dev
```

Start Next.js in a second terminal:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API health endpoint is available at [http://localhost:5000/api/health](http://localhost:5000/api/health).

For production builds:

```bash
npm run build
npm run server:build
npm run start
npm run server:start
```

Run the two `start` commands in separate terminals or process containers.

## Deployment configuration

Keep the existing production variables unchanged. Add these runtime values to local `server/.env` and to the backend Vercel project:

```env
DEMO_LOGIN_ENABLED=true
DEMO_LOGIN_EMAIL=demo@staffflow.demo
```

Add the following to local `server/.env`, or whichever trusted environment will run the seed command. They are not required by the frontend or by the running Vercel API after seeding. Use your own values, not these placeholders:

```env
SEED_DEMO_NAME=StaffFlow Demo
SEED_DEMO_EMAIL=demo@staffflow.demo
SEED_DEMO_PASSWORD=replace-with-a-separate-demo-password
```

`DEMO_LOGIN_EMAIL` and `SEED_DEMO_EMAIL` must match. The frontend deployment needs no additional variables; it continues to use only `NEXT_PUBLIC_API_URL` and never receives demo credentials.

After adding the seed values and confirming `MONGODB_URI` points to the intended database, run `npm run seed` once. This creates the missing demo user without changing the existing administrator password.

Before pushing a deployment, run:

```bash
npm run lint
npm run build
npm run server:build
npm --prefix server run test:integration
git diff --check
```

After deployment, select **Login as Demo**, confirm the read-only badge is visible, open every dashboard page, and exercise employee filters, sorting, pagination, attendance dates, and reports. Confirm write controls are absent. As a final backend check, send a resource `POST`, `PUT`, or `DELETE` with the demo session cookie and verify the API returns HTTP 403 with `Demo account is read-only.` Then log in as the administrator and verify a normal create/update/delete flow still succeeds.

## API overview

All resource endpoints require the StaffFlow authentication cookie. Application write endpoints additionally require the `admin` role. Only login, demo login, registration, logout, and health routes are public-facing.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an admin when `ALLOW_REGISTRATION=true` |
| `POST` | `/api/auth/login` | Authenticate and set the HTTP-only cookie |
| `POST` | `/api/auth/demo-login` | Open the configured read-only demo session |
| `POST` | `/api/auth/logout` | Clear the cookie |
| `GET` | `/api/auth/me` | Return the current user and role |
| `GET/POST` | `/api/employees` | Search/list or create employees |
| `GET/PUT/DELETE` | `/api/employees/:id` | Read, update, or delete one employee |
| `GET/POST` | `/api/departments` | List or create departments |
| `PUT/DELETE` | `/api/departments/:id` | Update or safely delete a department |
| `GET/POST` | `/api/attendance` | View a date or upsert one attendance record |
| `POST` | `/api/attendance/bulk` | Upsert a complete daily register |
| `PUT` | `/api/attendance/:id` | Update an attendance status |
| `GET` | `/api/reports/summary` | Return workforce and today's attendance totals |

Employee list query parameters include `search`, `department`, `status`, `page`, `limit`, `sortBy`, and `sortOrder`.

## Quality checks

```bash
npm run lint
npm run build
npm run server:build
npm --prefix server run test:integration
```

The first integration-test run downloads a temporary MongoDB binary; later runs use the cached copy. The test database is isolated and removed when the test finishes.

## Security notes

- API authorization is enforced at the data boundary; hiding frontend UI is not treated as security.
- Demo sessions receive HTTP 403 with `Demo account is read-only.` on protected writes.
- The dashboard shell verifies the session through `/auth/me`; the API remains the authorization authority.
- Cookies are HTTP-only; production uses `Secure` and `SameSite=None`, while local development uses `SameSite=Lax`.
- CORS permits only `CLIENT_URL`, JSON bodies are limited, and login/register are rate-limited.
- Registration is disabled by default. The seed workflow is the intended local administrator setup.
- Password hashes and JWT secrets are never returned by the API.

## Future improvements

- Additional roles and finer-grained permissions for managers
- Audit logs for employee and attendance changes
- Leave approval workflows and CSV exports
- Automated browser-level tests for the responsive UI
- Deployment presets for the frontend, API, and managed MongoDB
