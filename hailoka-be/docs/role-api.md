# Role Management API Documentation

## Overview
API endpoints untuk mengelola role (peran) dalam sistem. Semua endpoint memerlukan autentikasi.

**Base URL**: `/roles`

**Authentication**: Semua endpoint memerlukan `authMiddleware` (authentication token)

---

## Endpoints

### 1. Create Role

Membuat role baru.

**Endpoint**: `POST /roles`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "string"
}
```

**Request Body Schema**:
- `name` (string, required): Nama role
  - Minimum length: 1 character
  - Maximum length: 50 characters

**Response Success** (201 Created):
```json
{
  "id": 1,
  "name": "Administrator"
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Role name is required"
}
```

**Example Request**:
```bash
curl -X POST http://localhost:3000/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Administrator"
  }'
```

---

### 2. Get All Roles

Mengambil daftar semua role.

**Endpoint**: `GET /roles`

**Authentication**: Required

**Query Parameters**: Tidak ada

**Response Success** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Administrator"
  },
  {
    "id": 2,
    "name": "User"
  }
]
```

**Response Error** (500 Internal Server Error):
```json
{
  "error": "Internal server error message"
}
```

**Example Request**:
```bash
curl -X GET http://localhost:3000/roles \
  -H "Authorization: Bearer <token>"
```

---

### 3. Get Role by ID

Mengambil detail role berdasarkan ID.

**Endpoint**: `GET /roles/:id`

**Authentication**: Required

**URL Parameters**:
- `id` (number, required): ID role

**Response Success** (200 OK):
```json
{
  "id": 1,
  "name": "Administrator"
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Invalid role ID"
}
```

**Response Error** (404 Not Found):
```json
{
  "error": "Role not found"
}
```

**Example Request**:
```bash
curl -X GET http://localhost:3000/roles/1 \
  -H "Authorization: Bearer <token>"
```

---

### 4. Update Role

Memperbarui role berdasarkan ID.

**Endpoint**: `PUT /roles/:id`

**Authentication**: Required

**URL Parameters**:
- `id` (number, required): ID role

**Request Body**:
```json
{
  "name": "string"
}
```

**Request Body Schema**:
- `name` (string, required): Nama role baru
  - Minimum length: 1 character
  - Maximum length: 50 characters

**Response Success** (200 OK):
```json
{
  "id": 1,
  "name": "Super Administrator"
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Role name is required"
}
```

atau

```json
{
  "error": "Invalid role ID"
}
```

**Example Request**:
```bash
curl -X PUT http://localhost:3000/roles/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Super Administrator"
  }'
```

---

### 5. Delete Role

Menghapus role berdasarkan ID.

**Endpoint**: `DELETE /roles/:id`

**Authentication**: Required

**URL Parameters**:
- `id` (number, required): ID role

**Response Success** (200 OK):
```json
{
  "message": "Role deleted successfully"
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Invalid role ID"
}
```

**Response Error** (404 Not Found):
```json
{
  "error": "Role not found"
}
```

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/roles/1 \
  -H "Authorization: Bearer <token>"
```

---

## Error Codes Summary

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad Request - Validation error or invalid parameter |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Server error |

---

## Data Models

### Role Object
```typescript
{
  id: number;
  name: string;
}
```

### Create Role Request
```typescript
{
  name: string; // 1-50 characters
}
```

### Update Role Request
```typescript
{
  name: string; // 1-50 characters
}
```

---

## Notes

- Semua endpoint memerlukan authentication token yang valid
- Role name harus unik (jika ada validasi di database)
- ID role harus berupa angka integer
- Role name tidak boleh kosong dan maksimal 50 karakter

