# CampusTrace REST API Specifications

API Base URL: `/api`

---

## 1. System Health
- **`GET /api/health`**
  - **Description**: Returns server operational status and environment.
  - **Auth**: Public
  - **Response**: `{ "status": "healthy", "timestamp": "...", "service": "CampusTrace REST API" }`

---

## 2. Authentication & Profile (`/api/auth`)
- **`POST /api/auth/register`**
  - **Description**: Register a new student or faculty account.
  - **Body**: `{ "fullName", "email", "password", "role"?, "department"?, "studentId"?, "phoneNumber"? }`
- **`POST /api/auth/login`**
  - **Description**: Authenticate credentials and receive Bearer JWT token.
  - **Body**: `{ "email", "password" }`
- **`POST /api/auth/logout`**
  - **Description**: Client session invalidation.
- **`GET /api/auth/me`**
  - **Description**: Fetch current authenticated user's profile.
  - **Auth**: Bearer JWT
- **`PATCH /api/auth/profile`**
  - **Description**: Update user's name, department, or phone number.
  - **Auth**: Bearer JWT

---

## 3. Item Reports (`/api/reports`)
- **`GET /api/reports`**
  - **Description**: Browse public items with query filters (`type`, `category`, `location`, `status`, `search`, `limit`, `offset`).
  - **Auth**: Public (private verification details sanitized)
- **`GET /api/reports/my-reports`**
  - **Description**: List reports created by current user.
  - **Auth**: Bearer JWT
- **`GET /api/reports/:id`**
  - **Description**: Retrieve comprehensive item report details.
  - **Auth**: Public (private verification details exposed only to owner or admin)
- **`POST /api/reports`**
  - **Description**: Create a new LOST or FOUND item report. Triggers background matching engine.
  - **Auth**: Bearer JWT
  - **Body**: `{ "reportType", "title", "category", "description", "brand"?, "color"?, "location", "eventDate", "imageBlobName"?, "distinctiveCharacteristics"?, "privateVerificationDetails"? }`
- **`PATCH /api/reports/:id`**
  - **Description**: Update report content (permitted only for report owner or admin).
  - **Auth**: Bearer JWT
- **`PATCH /api/reports/:id/status`**
  - **Description**: Modify item state (`OPEN`, `MATCHED`, `CLAIMED`, `RESOLVED`, `EXPIRED`).
  - **Auth**: Bearer JWT
- **`DELETE /api/reports/:id`**
  - **Description**: Mark report as EXPIRED / Closed.
  - **Auth**: Bearer JWT

---

## 4. Smart Matches (`/api/matches`)
- **`GET /api/matches/my-matches`**
  - **Description**: Fetch potential matches associated with user's reports.
  - **Auth**: Bearer JWT
- **`GET /api/matches/:id`**
  - **Description**: Get match details with reason breakdown.
  - **Auth**: Bearer JWT
- **`POST /api/matches/:id/dismiss`**
  - **Description**: Mark false positive match as DISMISSED.
  - **Auth**: Bearer JWT

---

## 5. Ownership Verification & Claims (`/api/claims`)
- **`POST /api/claims`**
  - **Description**: File ownership claim on a found item with private proof evidence.
  - **Auth**: Bearer JWT
  - **Body**: `{ "reportId", "matchId"?, "verificationEvidence", "evidenceBlobName"? }`
- **`GET /api/claims/my-claims`**
  - **Description**: Retrieve current user's submitted claims and verification states.
  - **Auth**: Bearer JWT
- **`GET /api/claims/:id`**
  - **Description**: Fetch single claim details.
  - **Auth**: Bearer JWT
- **`PATCH /api/claims/:id/review`**
  - **Description**: Admin approves or rejects claim with verification notes.
  - **Auth**: Admin only
  - **Body**: `{ "verificationStatus": "APPROVED" | "REJECTED", "adminNotes"? }`
- **`PATCH /api/claims/:id/handover`**
  - **Description**: Campus officer confirms physical handover to student. Marks report as `RESOLVED`.
  - **Auth**: Admin only

---

## 6. Notifications (`/api/notifications`)
- **`GET /api/notifications`**
  - **Description**: Fetch user's in-app alerts (matches, claim updates, handovers).
  - **Auth**: Bearer JWT
- **`PATCH /api/notifications/:id/read`**
  - **Description**: Mark single notification as read.
  - **Auth**: Bearer JWT
- **`PATCH /api/notifications/read-all`**
  - **Description**: Mark all notifications as read.
  - **Auth**: Bearer JWT

---

## 7. Media Uploads (`/api/uploads`)
- **`POST /api/uploads/item-image`**
  - **Description**: Multipart photo upload directly streamable to Azure Blob Storage container `item-photos`.
  - **Auth**: Bearer JWT (Multipart `image`)
  - **Response**: `{ "blobName": "...", "url": "..." }`
- **`GET /api/uploads/files/:fileName`**
  - **Description**: Stream local storage cached image.
  - **Auth**: Public

---

## 8. Analytics & Metrics (`/api/analytics`)
- **`GET /api/analytics/summary`**
  - **Description**: Aggregated KPIs (total reports, lost, found, recovered, recovery rate, pending claims).
  - **Auth**: Public
- **`GET /api/analytics/categories`**
  - **Description**: Item volume distributed across categories.
  - **Auth**: Public
- **`GET /api/analytics/locations`**
  - **Description**: Frequently reported campus locations.
  - **Auth**: Public
- **`GET /api/analytics/monthly-trends`**
  - **Description**: Monthly trend comparison of lost vs. found vs. recovered items.
  - **Auth**: Public

---

## 9. Administrative Operations (`/api/admin`)
- **`GET /api/admin/users`**
  - **Description**: List all registered accounts.
  - **Auth**: Admin only
- **`PATCH /api/admin/users/:id/status`**
  - **Description**: Suspend or reactivate user account.
  - **Auth**: Admin only
  - **Body**: `{ "status": "ACTIVE" | "SUSPENDED" }`
- **`GET /api/admin/reports`**
  - **Description**: Moderate reports platform-wide.
  - **Auth**: Admin only
- **`GET /api/admin/claims`**
  - **Description**: Access pending claims queue.
  - **Auth**: Admin only
- **`GET /api/admin/audit-logs`**
  - **Description**: Retrieve immutable system audit records.
  - **Auth**: Admin only