# 🚀 Project Overview
Hailoka Backend Service

# 🏗️ Tech Stack

| Category                   | Technology                               |
| -------------------------- | ---------------------------------------- |
| **Runtime**                | Node.js                                  |
| **Language**               | TypeScript                               |
| **Framework**              | Express 5                                |
| **ORM**                    | Sequelize                                |
| **Database**               | MariaDB                                  |
| **Validation**             | Zod                                      |
| **Authentication**         | JSON Web Tokens (JWT), bcrypt            |
| **Environment Management** | dotenv                                   |
| **Email & QR Utilities**   | Nodemailer, QRCode                       |
| **Google Integration**     | google-auth-library                      |
| **Utilities**              | nanoid (unique IDs), cookie-parser, cors |
| **Testing**                | Jest, ts-jest, Supertest                 |

# ⚙️ Project Scripts

# Instalasi & Running Docker Container

### 1. clone repository
```
git clone https://github.com/PT-Pasifik-Hoki-Indonesia/hailoka-be.git
```

### 2. CD into hailoka-be and create .env file
```bash
# cd into directory
cd hailoka-be

# create .env file
nano .env
```

**Variables .env**
```bash
PORT=5000

DB_HOST=hailoka_db
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=3306

# google SMTP
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
SMTP_USER=
SMTP_PASS=

FRONTEND_URL=https://localhost:5173

JWT_SECRET=RANDOM_JWT_SECREET
NODE_ENV=production

# google client ID untuk google authentication
GOOGLE_CLIENT_ID=
```

### 3. Run Docker
```bash
sudo docker compose up --build -d
```

# 🗄️ Database Migration Guide (Sequelize)

This guide explains how to create, update, and run database migrations using Sequelize CLI in this project.

# 🚀 Running Existing Migrations

Before running migrations, make sure you are inside the running backend container.

```
# Masuk ke dalam container backend
sudo docker exec -it hailoka-backend /bin/sh

# Jalankan migration untuk meng-update database
npm run migrate
```

## 🧱 Creating a New Table

Use this process when you need to add a new table to the database.

### 1. Generate a new migration file
```bash
npx sequelize-cli migration:generate --name create-calls-table
```

The generated migration file will be located at:
`src/app/infrastructure/database/migrations/YYYYMMDDHHMMSS-create-calls-table.js`

### 2. Create the Sequelize model

Define the model inside:
`src/app/infrastructure/database/models/call.model.ts`

### 3. Run the migration

After defining the model and migration file:

```bash
npm run migrate
# or
npx sequelize-cli db:migrate
```

## 🔧 Updating an Existing Table

Use this process if you need to add, remove, or modify columns in an existing table.

### 1. Generate a migration file

```bash
npx sequelize-cli migration:generate --name add-extension-id-to-calls
```

The file will be generated in:
`src/app/infrastructure/database/migrations/YYYYMMDDHHMMSS-add-extension-id-to-calls.js`

### 2. Update the Model and Migration File

Update the model file:
`src/app/infrastructure/database/models/call.model.ts`

Edit the generated migration file to define the schema changes (e.g. addColumn, removeColumn, changeColumn, etc.)

Example snippet for adding a column:

```js
await queryInterface.addColumn('calls', 'extension_id', {
  type: Sequelize.UUID,
  allowNull: true,
  references: { model: 'extensions', key: 'id' },
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
});
```

### 3. Apply the Migration

Run the migration again to apply your changes:

```bash
npm run migrate
# or
npx sequelize-cli db:migrate
```

# 📁 Folder Structure Overview

```
├── src
│   ├── app
│   │   ├── dto
│   │   │   ├── auth
│   │   │   │   └── guest.dto.ts
│   │   │   ├── organization
│   │   │   │   └── organization-create.dto.ts
│   │   │   ├── staff
│   │   │   │   ├── createStaffRequest.dto.ts
│   │   │   │   └── editStaffRequest.dto.ts
│   │   │   └── user
│   │   │       ├── auth.dto.ts
│   │   │       ├── user-login.dto.ts
│   │   │       └── user-registration.dto.ts
│   │   └── use-cases
│   │       ├── auth
│   │       │   └── googleAuth.ts
│   │       ├── call
│   │       │   └── createCallRequest.ts
│   │       ├── email
│   │       │   └── send-welcome-email.usecase.ts
│   │       ├── extension
│   │       │   ├── deleteExtensionUsecase.ts
│   │       │   ├── getExtensionByExtId.ts
│   │       │   ├── getExtensionByOrganization.ts
│   │       │   ├── getSelectExtensionByOrg.ts
│   │       │   ├── insertExtensionUsecase.ts
│   │       │   └── updateExtensionUsecase.ts
│   │       ├── extension-rule
│   │       │   ├── CreateExtensionRuleUseCase.ts
│   │       │   ├── DeleteExtensionRuleUseCase.ts
│   │       │   ├── GetAllExtensionRuleUseCase.ts
│   │       │   ├── GetExtensionRuleByIdUseCase.ts
│   │       │   └── UpdateExtensionRuleUseCase.ts
│   │       ├── extentions
│   │       ├── guest
│   │       │   └── register-guest.usecase.ts
│   │       ├── organization
│   │       │   └── CreateOrganizationUseCase.ts
│   │       ├── qrcode
│   │       │   ├── createGenerateQr.ts
│   │       │   ├── getQrByOrgUseCase.ts
│   │       │   └── getQrUrlUsecase.ts
│   │       ├── staff
│   │       │   ├── createStaffUsecase.ts
│   │       │   ├── deleteStaffUsecase.ts
│   │       │   ├── editStaffUsecase.ts
│   │       │   ├── getStaffByOrganization.ts
│   │       │   ├── getStaffByUserId.ts
│   │       │   └── getStaffSelectionUseCase.ts
│   │       ├── temporary
│   │       │   └── tmpUseCase.ts
│   │       └── user
│   │           ├── createUser.ts
│   │           ├── forgot-password.usecase.ts
│   │           ├── getUsers.ts
│   │           ├── login-user.usecase.ts
│   │           ├── RegisterUserUseCase.ts
│   │           └── reset-password.usecase.ts
│   ├── domain
│   │   ├── email.ts
│   │   ├── userAuthMethods.ts
│   │   └── user.ts
│   ├── index.ts
│   ├── infrastructure
│   │   ├── database
│   │   │   ├── config.js
│   │   │   ├── config.ts
│   │   │   ├── migrations
│   │   │   │   ├── 20250929094523-create-users.js
│   │   │   │   ├── 20250930091945-create-user_auth_methods.js
│   │   │   │   ├── 20251008102222-create-organizations-table.js
│   │   │   │   ├── 20251008102245-create-organization-users-table.js
│   │   │   │   ├── 20251008102305-create-organization-status-table.js
│   │   │   │   ├── 20251008102328-create-role-table.js
│   │   │   │   ├── 20251013105120-create-extensions-table.js
│   │   │   │   ├── 20251013105133-create-extension-status-table.js
│   │   │   │   ├── 20251013105146-create-extension-assigned-staffs-table.js
│   │   │   │   ├── 20251013105155-create-extension-operational-hours-table.js
│   │   │   │   ├── 20251017134820-add-icon-column-to-extension.js
│   │   │   │   ├── 20251021101743-create-extension-rule-table.js
│   │   │   │   ├── 20251023124830-create-organization-generated-qr.js
│   │   │   │   ├── 20251030144825-create-calls-table.js
│   │   │   │   ├── 20251030144840-create-call-participants-table.js
│   │   │   │   ├── 20251030144853-create-call-events-table.js
│   │   │   │   ├── 20251031135757-create-call-staff-availability.js
│   │   │   │   └── 20251101181837-add-extension-id-to-calls.js
│   │   │   ├── models
│   │   │   │   ├── associations.ts
│   │   │   │   ├── callEvent.model.ts
│   │   │   │   ├── call.model.ts
│   │   │   │   ├── callParticipant.model.ts
│   │   │   │   ├── callStaffAvailability.ts
│   │   │   │   ├── extensionAssignedStaff.model.ts
│   │   │   │   ├── extension.model.ts
│   │   │   │   ├── extensionOperationalHour.model.ts
│   │   │   │   ├── extensionRule.model.ts
│   │   │   │   ├── extensionStatus.model.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── organizationgeneratedqr.model.ts
│   │   │   │   ├── organization.model.ts
│   │   │   │   ├── organizationUser.model.ts
│   │   │   │   ├── user_auth_method.model.ts
│   │   │   │   └── user.model.ts
│   │   │   ├── seeders
│   │   │   │   ├── 20251013110352-seed-extension-status.js
│   │   │   │   ├── 20251013110407-seed-extensions.js
│   │   │   │   ├── 20251013110417-seed-extension-assigned-staffs.js
│   │   │   │   └── 20251013110425-seed-extension-operational-hours.js
│   │   │   └── sequelize.ts
│   │   ├── mailer
│   │   │   └── nodemailer.service.ts
│   │   └── repositories
│   │       ├── callDashboard.repository.ts
│   │       ├── callEvent.repository.ts
│   │       ├── callParticipant.repository.ts
│   │       ├── call.repository.ts
│   │       ├── callStaffAvailibility.repository.ts
│   │       ├── extension-operational.repository.ts
│   │       ├── extension.repository.ts
│   │       ├── extension-rule.repository.ts
│   │       ├── extension-staff.repository.ts
│   │       ├── organization.repository.ts
│   │       ├── org-code-qr.repository.ts
│   │       ├── user-auth.repository.ts
│   │       └── user.repository.ts
│   ├── interfaces
│   │   ├── auth.controller.ts
│   │   ├── call.controller.ts
│   │   ├── extension.controller.ts
│   │   ├── extensionRule.controller.ts
│   │   ├── middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── organization.controller.ts
│   │   ├── qrOrganization.controller.ts
│   │   ├── staff.controller.ts
│   │   ├── tmp.controller.ts
│   │   └── user.controller.ts
│   ├── server.ts
│   └── types
│       └── express.d.ts
├── docker-compose.yml
├── Dockerfile
├── global.d.ts
├── nodemon.json
├── package.json
├── Project Codebase.md
├── readme.md
├── tsconfig.json
├── jest.config.js
└── src/__tests__/
    ├── setup.ts
    ├── helpers/
    │   ├── mockFactory.ts
    │   ├── repositoryMocks.ts
    │   └── serviceMocks.ts
    └── controllers/
        └── *.test.ts
```

# 🧪 Testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Unit tests are located in `src/__tests__/` directory:
- **setup.ts**: Jest configuration and test environment setup
- **helpers/**: Mock factories and utilities for testing
- **controllers/**: Unit tests for all API controllers

## Test Coverage

All API endpoints have unit tests covering:
- ✅ Success scenarios
- ✅ Error handling
- ✅ Input validation
- ✅ Authentication checks
- ✅ Authorization checks

For detailed testing documentation, see `src/__tests__/README.md`.

# 📚 API Documentation

## Organization Endpoints

### Get Organization Change Logs

Retrieve the change history for an organization.

**Endpoint:** `GET /organizations/:organizationId/change-logs`

**Authentication:** Required (Bearer Token)

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 50) - Number of items per page

**Response:**
```json
[
  {
    "id": 1,
    "organization_id": "uuid",
    "old_data": null,
    "new_data": {
      "name": "Organization Name",
      "description": "Organization description",
      ...
    },
    "user_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `400` - Bad Request (missing organizationId, organization not found, or user access denied)
- `401` - Unauthorized (missing or invalid token)

**Example Request:**
```bash
GET /organizations/151044dd-5df4-41b8-805b-892c27298193/change-logs?page=1&limit=50
Authorization: Bearer <token>
```

**Notes:**
- Only users with access to the organization can view change logs
- Change logs are ordered by `created_at` in descending order (newest first)
- When an organization is first created, `old_data` will be `null`

### Get Organization User Logs

Retrieve the change history for users in an organization. This includes changes such as:
- Role changes (role_id updates)
- Extension assignment changes
- Other user-related modifications

**Endpoint:** `GET /organizations/:organizationId/user-logs` or `GET /organizations/:organizationId/user-logs/:userId`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `organizationId` (required) - Organization UUID
- `userId` (optional) - Specific user UUID to filter logs. If omitted, returns logs for all users in the organization

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 50) - Number of items per page

**Response:**
```json
[
  {
    "id": 1,
    "extension_id": "uuid",
    "user_id": "uuid",
    "old_data": {
      "role_id": 4,
      "extensions": ["ext-1", "ext-2"]
    },
    "new_data": {
      "role_id": 1,
      "extensions": ["ext-1", "ext-2", "ext-3"]
    },
    "created_by": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `400` - Bad Request (missing organizationId, organization not found, user access denied, or target user not found)
- `401` - Unauthorized (missing or invalid token)

**Example Requests:**
```bash
# Get logs for all users in organization
GET /organizations/151044dd-5df4-41b8-805b-892c27298193/user-logs?page=1&limit=50
Authorization: Bearer <token>

# Get logs for specific user
GET /organizations/151044dd-5df4-41b8-805b-892c27298193/user-logs/123e4567-e89b-12d3-a456-426614174000?page=1&limit=50
Authorization: Bearer <token>
```

**Notes:**
- Only users with access to the organization can view user logs
- User logs are ordered by `created_at` in descending order (newest first)
- `extension_id` can be `null` if the log is not related to a specific extension (e.g., role changes)
- `old_data` and `new_data` contain JSON objects representing the state before and after the change

## Call Endpoints

### Create Call Feedback

Submit feedback for a call.

**Endpoint:** `POST /call/feedback`

**Authentication:** Not required (can be submitted by guest or user)

**Request Body:**
```json
{
  "call_id": "uuid",
  "kind": "GUEST" | "USER",
  "ref_id": "uuid",
  "score": 1-5,
  "feedback": "Optional feedback text (max 500 characters)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "call_id": "uuid",
  "kind": "USER",
  "ref_id": "uuid",
  "score": 5,
  "feedback": "Great service!",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Bad Request (validation error, call not found)

**Example Request:**
```bash
POST /call/feedback
Content-Type: application/json

{
  "call_id": "123e4567-e89b-12d3-a456-426614174000",
  "kind": "USER",
  "ref_id": "123e4567-e89b-12d3-a456-426614174001",
  "score": 5,
  "feedback": "Excellent service!"
}
```

### Get Call Feedbacks

Retrieve feedbacks for calls in an organization.

**Endpoint:** `GET /organizations/:organizationId/call-feedbacks` or `GET /organizations/:organizationId/call-feedbacks/:callId`

**Authentication:** Required (Bearer Token)

**Path Parameters:**
- `organizationId` (required) - Organization UUID
- `callId` (optional) - Specific call UUID to filter feedbacks. If omitted, returns feedbacks for all calls in the organization

**Query Parameters:**
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 50) - Number of items per page

**Response:**
```json
[
  {
    "id": "uuid",
    "call_id": "uuid",
    "kind": "USER",
    "ref_id": "uuid",
    "score": 5,
    "feedback": "Great service!",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `400` - Bad Request (missing organizationId, organization not found, user access denied, or call does not belong to organization)
- `401` - Unauthorized (missing or invalid token)

**Example Requests:**
```bash
# Get feedbacks for all calls in organization
GET /organizations/151044dd-5df4-41b8-805b-892c27298193/call-feedbacks?page=1&limit=50
Authorization: Bearer <token>

# Get feedbacks for specific call
GET /organizations/151044dd-5df4-41b8-805b-892c27298193/call-feedbacks/123e4567-e89b-12d3-a456-426614174000?page=1&limit=50
Authorization: Bearer <token>
```

**Notes:**
- Only users with access to the organization can view call feedbacks
- Feedbacks are ordered by `created_at` in descending order (newest first)
- `kind` can be "GUEST" or "USER" depending on who submitted the feedback
- `ref_id` refers to the ID of the guest or user who submitted the feedback
- `score` must be between 1 and 5

### Add Call Participant

Add a new participant to an existing call. Used when a staff member answers a call or when additional participants join.

**Endpoint:** `POST /call/participant`

**Authentication:** Not required

**Request Body:**
```json
{
  "call_id": "uuid",
  "role": "host" | "caller" | "recipient",
  "kind": "user" | "guest" | "extension",
  "ref_id": "uuid"
}
```

**Response:**
```json
{
  "id": 1,
  "call_id": "uuid",
  "role": "recipient",
  "kind": "user",
  "ref_id": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Bad Request (validation error, call not found)

**Example Request:**
```bash
POST /call/participant
Content-Type: application/json

{
  "call_id": "123e4567-e89b-12d3-a456-426614174000",
  "role": "recipient",
  "kind": "user",
  "ref_id": "123e4567-e89b-12d3-a456-426614174001"
}
```

### Add Call Event

Add a new event to an existing call. Used to track call lifecycle events such as answered, ended, queue updates, etc.

**Endpoint:** `POST /call/event`

**Authentication:** Not required

**Request Body:**
```json
{
  "call_id": "uuid",
  "call_participant_id": 1,  // optional, nullable
  "attempt_count": 1,         // optional, default: 0
  "event_type": "answered",   // see event types below
  "queue_count": 0            // optional, default: 0
}
```

**Event Types:**
- `created` - Call record created
- `queued` - Call entered queue
- `queue_updated` - Queue position/priority changed
- `dial_attempt` - Dial attempt to endpoint
- `ringing` - Callee is ringing
- `answered` - Call answered by callee
- `hold` - Call put on hold
- `unhold` - Call released from hold
- `forward` - Decision to forward call
- `forward_ringing` - Forwarded call is ringing
- `forward_answered` - Forwarded call answered
- `forward_no_answer` - Forwarded call not answered
- `forward_busy` - Forwarded call busy
- `transfer` - Blind transfer triggered
- `transfer_ringing` - Transfer target ringing
- `transfer_answered` - Transfer target answered
- `transfer_no_answer` - Transfer target not answered
- `transfer_busy` - Transfer target busy
- `transfer_consulting` - Attended transfer consulting
- `transfer_connecting` - Connecting to transfer target
- `transfer_completed` - Transfer completed
- `transfer_failed` - Transfer failed
- `transfer_canceled` - Transfer canceled
- `transfer_attended` - Attended transfer successful
- `rejected` - Call rejected
- `busy` - Call busy
- `timeout` - Call timeout
- `missed` - Call missed
- `canceled` - Call canceled
- `failed` - Call failed
- `ended` - Call ended

**Response:**
```json
{
  "id": 1,
  "call_id": "uuid",
  "call_participant_id": 1,
  "attempt_count": 1,
  "event_type": "answered",
  "queue_count": 0,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Bad Request (validation error, call not found, participant not found)

**Example Requests:**
```bash
# Add answered event
POST /call/event
Content-Type: application/json

{
  "call_id": "123e4567-e89b-12d3-a456-426614174000",
  "call_participant_id": 1,
  "attempt_count": 1,
  "event_type": "answered",
  "queue_count": 0
}

# Add queue event
POST /call/event
Content-Type: application/json

{
  "call_id": "123e4567-e89b-12d3-a456-426614174000",
  "event_type": "queued",
  "queue_count": 2
}

# Add ended event (no participant)
POST /call/event
Content-Type: application/json

{
  "call_id": "123e4567-e89b-12d3-a456-426614174000",
  "event_type": "ended"
}
```

**Notes:**
- `call_participant_id` is optional and only needed for certain event types (e.g., answered, rejected)
- `queue_count` is only meaningful when `event_type` is `queued` or `queue_updated`
- `attempt_count` defaults to 0 if not provided
- Events are used to track the complete lifecycle of a call