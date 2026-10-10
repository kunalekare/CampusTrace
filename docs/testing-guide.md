# Testing & Quality Assurance Guide

## 1. Automated Test Execution
Run the integrated test suite from the repository root:
```bash
npm test
```
Or execute specifically in the backend directory:
```bash
cd backend
npm test
```

## 2. Test Coverage Suites
- `auth.test.js`: Validates registration validations, password hashing, and token issuance.
- `report.test.js`: Validates report schema integrity and filter query parameters.
- `matchingAlgorithm.test.js`: Validates fuzzy matching weights, category equality, token overlap, and distance calculations.
- `claim.test.js`: Validates ownership claim submission and state transitions (`PENDING` -> `APPROVED` / `REJECTED`).