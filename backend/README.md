# LAAS BACKEND

## project structure

```bash
LAAS/
  |-backend/
  | |
  | |-src/
  | |  |-routes/
  | |  |-controllers/
  | |  |-services/
  | |  |-lib/
  | |  |-middlewares/
  | |
  | |-app.js
  | |-index.js
  |
  |-frontend
```

script type ES7 modules

## getting started

```bash
git clone <github_url>
```

```bash
pnpm i install
```

```bash
pnpm run dev
```

Super Admin Login
https://credit-lite-saas.appbusket.com/admin/login

Email: admin@demo.com

Password: 123456

Tenant Login
https://credit-lite-saas.appbusket.com/demo-user/login

Email: user@demo.com

Password: 123456

Tenant Member/Borrower Login
https://credit-lite-saas.appbusket.com/demo-user/login

Email: member@demo.com

Password: 123456

eg Week 1: Project Setup & Foundations
Backend:
Initialize repo,
CI/CD pipelines,
environment configs.
Define database schema (ERD: tenants, users, loans, transactions)
Set up Redis for async queues.
Frontend:
Set up React.js (dashboard)
Configure design system (Tailwind, Figma-to-code workflows).
Deliverable: Stable dev environment + wireframe alignment.
High conversion landing page
Who will be in charge in terms of backend and frontend