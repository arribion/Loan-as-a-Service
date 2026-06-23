# LAAS BACKEND

## Local development endpoints

### **1. Tenant Endpoints**

- [Tenant registration](http://localhost:5000/api/v1/tenant/auth/register) *

- [Tenant login](http://localhost:5000/api/v1/tenant/auth/login) *

- [Tenant logout](http://localhost:5000/api/v1/tenant/auth/register) *

- [General profile update (null)]()

Tenant member setting

- [Tenant Add Member](http://localhost:5000/api/v1/users/add)

- [Tenant Get One Member](http://localhost:5000/api/v1/users/get)

- [Tenant Update Member](http://localhost:5000/api/v1/users/update/:member_id)

- [Tenant Get All Member](http://localhost:5000/api/v1/users/get/:member_id)

- [Tenant Delete Member](http://localhost:5000/api/v1/users/delete/:member_id)

Package management endpoints;
- [Get packages](http://localhost:5000/api/v1/package/tiers) *

- [Update feature and price (null)]()

- [Delete Package (null)]()

Product management endpoints

- add payload

```bash
{
  "tenant_id": "6a6af487-eea6-478a-b6a3-616479578d87",
  "reference_title": "Premium Growth Loan",
  "interest_calculation_type": "flat",
  "base_percentage": "12.5000",
  "fine_rules": {},
  "min_loan_amount": "500.00",
  "max_loan_amount": "25000.00",
  "max_term_days": 180
}
```

- [Add Product (null)]()

- [Update Product (null)]()

- [Get one Product (null)]()

- [Get all Product (null)]()

- [Delete Product (null)]()

### **2. User Endpoints**

## project structure

```bash
LAAS/
  |-backend/
  | |
  | |-src/
  | |  |-routes/
  | |  |-controllers/
  | |  |-services/
  | |  |  |-payments/
  | |  |  |-report/
  | |  |  |-communication/
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
git clone https://github.com/Host-Devs/LAAS.git
```

```bash
pnpm i install
```

```bash
pnpm run dev
```

### CREDIT LITE SaaS DEMO

[Super Admin Login](https://credit-lite-saas.appbusket.com/admin/login)

- Email: ```admin@demo.com```
- Password: ```123456```

[Tenant Login](https://credit-lite-saas.appbusket.com/demo-user/login)

- Email: ```user@demo.com```
- Password: ```123456```

[Tenant Member/Borrower Login](https://credit-lite-saas.appbusket.com/demo-user/login)

- Email: ```member@demo.com```
- Password: ```123456```

### MIlestones

1. *Project Setup & Foundations*
2. *Authentication & Tenant Management*
3. *Loan Products & Customer Profiles*
4. *Loan Lifecycle & Repayment Scheduling*
5. *hostPay API Integration*
6. *SMS Communication Matrix*
7. *Analytics & Reporting*
8. *Security & Hardening*
9. *Testing & QA*
10. *Final Integration & Deployment*

---

### Breakdown of Tenant Product

- **Entity:** `loan_products (id, tenant_id, reference_title, interest_calculation_type, base_percentage, fine_rules)`
- **Key Attributes:**
  - `tenant_id` → links the loan product to the owning tenant.
  - `reference_title` → name of the loan product (e.g., “School Fees Loan”, “SME Working Capital Loan”).
  - `interest_calculation_type` → defines how interest is computed (flat, reducing balance, restructuring).
  - `base_percentage` → the default interest rate or base percentage applied.
  - `fine_rules` → penalties, grace periods, or repayment conditions (often stored as JSON for flexibility).

---

### Role in the Platform

- **Customization per Tenant:** Each tenant can configure their own loan products to match their business model.  

- **Tier Enforcement:**  
  - Lite tenants → only flat interest products.  
  - Growth tenants → reducing balance + rule‑based limits.  
  - Enterprise tenants → advanced restructuring, dynamic matrices.  
- **Lifecycle Integration:** Loan products act as templates when creating loans. A loan instance references a loan product to inherit its rules.

---

### Example

**Tenant:** *Bright Future SACCO*  
**Tenant Products:**

1. *School Fees Loan* → Flat interest, 10% base, penalty after 30 days.  
2. *Emergency Loan* → Reducing balance, 15% base, automated reminders.  

---

## CORE CONTRAINS

| PACKAGE TIER |   ACTIVE CLIENT CAP         |  CONCURRENT ACTIVE LOANS  | PERMITTED INTERNAL STAFF SEATS | CORE INTEGRATION SCOPE |
|--------------|-----------------------------|---------------------------|--------------------------------|------------------------|
| Tier 1: Lite |  Package Up to 5,000 users  |  Max 2,500 open loans     |   1 Admin, 1 Loan Officer      | Flat interest, manual review, standard HostPay STK push, transactional text alerts.|
| Tier 2: Growth | Package Up to 50,000 users |  Max 30,000 open loans  |   Up to 20 concurrent seats  |  Reducing balance option, rulebased algorithmic limits, automated B2C & C2B HostPay webhooks, scheduled reminder queues.|
| Tier 3: Enterprise  | Package Unlimited users | Unlimited open loans | Unlimited corporate seats | Full loan restructuring models,custom advanced credit matrices, automated multi-wallet float routing, cross-channel notification alerts |


## Rewritten Response

The prompt does not specify the shape of the quadrilateral. We assume it is a square, as that is the most constrained (and common) interpretation; under any other assumption the area is not uniquely determined.

We use the perimeter to find the side length, then compute the area of the square.

**Step 1: Find the side length.**

A square has four equal sides, so each side is:

\[
s = \frac{40}{4} = 10 \text{ cm}
\]

**Step 2: Compute the area.**

\[
A = s^2 = 10^2 = 100 \text{ cm}^2
\]

The area of the square is **100 cm²**.