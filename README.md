# CampusTrace — Smart Campus Lost & Found Network on Microsoft Azure

CampusTrace is an enterprise cloud application designed to automate and secure the recovery of lost belongings on higher education campuses. It provides real-time reporting, rule-based algorithmic matching, image upload to Azure Blob Storage, protected ownership verification claims, administrative handover confirmations, and end-to-end telemetry on Microsoft Azure.

---

## 🌟 Key Functional Features Implemented

1. **Role-Based Access Control (RBAC)**:
   - Dedicated workflows for `student`, `faculty`, and `admin` (Campus Security).
   - Stateless JWT tokens signed with HMAC-SHA256 and encrypted password hashing with bcrypt.
   - Protected API middleware and client-side route guards.
2. **Item Reporting**:
   - Lost and Found item reporting with rich metadata: Category, Campus Location, Date/Time, Brand, Color, Distinctive Characteristics.
   - Secure image uploading to **Azure Blob Storage** (`item-photos` container) with unique server-generated blob identifiers.
   - **Privacy Protection**: Private verification details (serial numbers, password hints, hidden marks) are strictly withheld from public listings and unauthenticated requests.
3. **Smart Matching Engine**:
   - Algorithmic scoring evaluating:
     - Category Similarity (25%)
     - Description and Keyword Overlap (25%)
     - Brand / Model Correlation (20%)
     - Color Similarity (10%)
     - Location Proximity (10%)
     - Date/Time Delta (10%)
   - Automated creation of `PotentialMatches` records for pairs scoring $\ge 50\%$.
   - Real-time in-app notifications generated for both reporters.
4. **Ownership Verification & Handover Workflow**:
   - Claimants submit private proof details (serial numbers, distinctive marks, proof receipts).
   - Campus Security reviews evidence and records explicit decisions (`APPROVED` or `REJECTED`).
   - Physical handover confirmation marks items as `RESOLVED` and updates campus recovery metrics.
5. **Recovery Analytics & Auditing**:
   - Total reports, open reports, recovered items, recovery rate percentage, category distribution, and location frequencies.
   - Immutable audit logs tracking all administrative actions.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons |
| **Backend** | Node.js (ES Modules), Express.js, `mssql`, `@azure/storage-blob`, `bcryptjs`, `jsonwebtoken`, `helmet`, `cors`, `express-rate-limit`, `zod`, `winston` |
| **Cloud Database** | Microsoft Azure SQL Database (T-SQL, Serverless General Purpose) |
| **Object Storage** | Microsoft Azure Blob Storage (Item Photographs & Claims Proofs) |
| **Serverless Compute** | Azure Functions v4 (Asynchronous matching queue & notification worker) |
| **Observability** | Microsoft Azure Application Insights (Node.js SDK) |
| **CI/CD** | GitHub Actions (`backend-deploy.yml`, `frontend-deploy.yml`) |

---

## 🚀 Step-by-Step Local Running Guide

### 1. Prerequisites
- Node.js (v18.x or v20.x LTS)
- npm or yarn

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Backend API will be active on http://localhost:5000/api
# Health Check: http://localhost:5000/api/health
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env.development
npm install
npm run dev
# Frontend web application will launch at http://localhost:5173
```

---

## 🔑 Demo Accounts & Pre-Seeded Scenarios

The system comes pre-seeded with synthetic test accounts and reports:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Chief Security Officer (Admin)** | `admin@campustrace.edu` | `Password@123` | `admin` |
| **Alex Mercer (Student)** | `student@campus.edu` | `Password@123` | `student` |
| **Sam Taylor (Finder / Student)** | `finder@campus.edu` | `Password@123` | `student` |

### Synthetic Demo Scenario (Calculator Recovery):
1. **Lost Report**: Alex Mercer lost a *"Texas Instruments TI-84 Plus Graphing Calculator"* in the Central Library.
2. **Found Report**: Sam Taylor found a *"Texas Instruments Scientific Graphing Calculator"* on a Central Library study desk.
3. **Automated Match**: The matching engine evaluates this pair with an **88% match score**, noting matching category, brand, and location.
4. **Ownership Verification**: Alex files a claim specifying serial number `K-0418M-29402`.
5. **Admin Handover**: Campus Security logs in, reviews proof against item records, approves the claim, and confirms physical handover.

---

## ☁️ Azure Cloud Deployment Guide

1. **Azure SQL Database**: Execute `database/schema.sql`, `database/indexes.sql`, `database/constraints.sql`, `database/seed.sql`, and `database/views.sql`.
2. **Azure Blob Storage**: Create storage account `stcampustraceprod` and container `item-photos`.
3. **Azure App Service**: Deploy `backend/` to Linux Node.js 20 App Service; configure connection strings in Application Settings.
4. **Azure Static Web Apps**: Connect GitHub repository and deploy `frontend/` with build preset `Vite`.
5. Detailed step-by-step instructions with Azure CLI commands are available in [docs/deployment-guide.md](docs/deployment-guide.md).

---

## 📚 Complete Documentation Index

- [Project Overview](docs/project-overview.md) — Problem statement, user personas, and target outcomes.
- [System Architecture](docs/architecture.md) — 3-tier cloud blueprint with Mermaid diagrams and matching algorithm math.
- [Database Design](docs/database-design.md) — 3NF relational catalog with Mermaid Entity-Relationship Diagram.
- [API Documentation](docs/api-documentation.md) — Specifications for all 22 REST endpoints.
- [Deployment Guide](docs/deployment-guide.md) — Azure CLI script, cost estimation, and tear-down commands.
- [Testing Guide](docs/testing-guide.md) — Automated test suite coverage and test scenario outlines.
- [Demo Checklist](docs/demo-checklist.md) — Complete demonstration presentation walkthrough.
- [Azure Resource Plan](infrastructure/azure-resource-plan.md) — Sizing, tiers, and security policies.