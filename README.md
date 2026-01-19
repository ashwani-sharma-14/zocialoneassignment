# Backend Developer Intern Assessment — ZocialOne ✅

This repository contains the backend implementation for the **ZocialOne Backend Developer Intern Assessment**.

It includes:

✅ User Authentication (Register/Login)  
✅ Complaint (Support Ticket) System  
✅ Complaint Status Transition Rules  
✅ Complaint Metrics API (time-based calculations)  
✅ Complaint Status Email Mocking (console based)  
✅ Onboarding Reminder System (Single Cron Job, time-based)  
✅ PostgreSQL + TypeORM  
✅ Dockerized Setup (App + Database)  
✅ Admin Seed (Optional)

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- Zod Validation
- pnpm
- Docker + Docker Compose
- node-cron (Onboarding reminders)

---

## 📌 Project Requirements Implemented

### ✅ PART 1: User Authentication
- User Registration
- User Login

All complaint and onboarding APIs are protected and accessible only for authenticated users.

---

### ✅ PART 1.1: User Profile API
**GET `/api/user/details`**

Returns:
- `id`
- `name`
- `email`
- `createdAt`
- `onboardingStage`
- `complaintsCount`
- `onboardingComplete`

Example response:
```json
{
  "id": "uuid",
  "name": "Amit Sharma",
  "email": "amit@test.com",
  "createdAt": "2024-12-10T10:00:00Z",
  "onboardingStage": 1,
  "complaintsCount": 2,
  "onboardingComplete": false
}
````

---

### ✅ PART 2: Complaint (Support Ticket) System

Complaint Fields:

* `id`
* `userId`
* `complaintType`
* `status`
* `createdAt`
* `updatedAt`
* `statusUpdatedAt`

Complaint Types:

* `liveDemo`
* `billingIssue`
* `technicalIssue`
* `feedback`

Complaint Status Flow:

```
raised → inProgress → waitingOnUser → resolved → closed
```

✅ Invalid status transitions are blocked
✅ `statusUpdatedAt` updates only when status changes

---

### ✅ PART 3: Complaint Metrics API

**GET `/api/complaint/:id/metrics`**

Returns:

* Total time since complaint creation
* Time spent in current status

Example response:

```json
{
  "complaint_id": "uuid",
  "current_status": "inProgress",
  "time_in_current_status_minutes": 90,
  "total_time_minutes": 350
}
```

✅ No additional tables created for this feature.

---

### ✅ PART 4: Complaint Notifications (Mocked)

When complaint status changes:

* `inProgress` → send notification (mocked in console)
* `resolved` → send notification (mocked in console)

✅ Notification logic is handled inside service layer (not controllers)

---

### ✅ PART 5: Onboarding Reminder System (Cron-Based)

Onboarding Stages:

* Stage 0
* Stage 1
* Stage 2

Reminder Schedule:

Stage 0:

* after 24 hours
* after 3 days
* after 5 days

Stage 1:

* after 12 hours
* after 24 hours

Stage 2:

* after 24 hours
* after 1 day
* after 3 days
* after 5 days

✅ Reminders are sent only if user is still in same stage
✅ Each reminder is sent only once
✅ All reminders handled using a single cron job
✅ Email sending is mocked using console output

---

## ✅ API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### User

* `GET /api/auth/profile`
* `PATCH /api/auth/socialmedia` (updates onboarding stage automatically)

### Complaint

* `POST /api/complaint`
* `PATCH /api/complaint/:id/status`
* `GET /api/complaint/:id/metrics`

---

## ⚙️ Environment Variables

Create a `.env` file using `.env.example`.

### `.env.example`

```env
DB_USER="postgres"
DB_PASS="postgres"
DB_NAME="socialone"
PORT=5000
DB_HOST="postgres"
DB_PORT=5432

ACCESS_SECRET="supersecret"
ACCESS_TIMEOUT="1d"

ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="Admin@123"
```

---

## 🐳 Docker Setup (Recommended)

### Run with Docker Compose

```bash
docker compose up --build
```

App runs on:

```
http://localhost:5000
```

PostgreSQL runs on:

```
localhost:5432
```

Stop containers:

```bash
docker compose down
```

Remove containers + volumes:

```bash
docker compose down -v
```

---

## 🧑‍💻 Local Setup (Without Docker)

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Start production build

```bash
pnpm start
```

---

## 🗃 Database Structure (Overview)

### User

* id (uuid)
* name
* email
* password
* createdAt
* onboardingStage
* onboardingComplete
* onboardingStageUpdatedAt
* socialAccounts (jsonb)
* onboardingReminderSent (jsonb)

### Complaint

* id (uuid)
* userId (uuid)
* complaintType (enum)
* status (enum)
* createdAt
* updatedAt
* statusUpdatedAt

---

---✅
