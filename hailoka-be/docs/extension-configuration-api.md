# Extension Configuration API Documentation

## Overview
API endpoints untuk mengelola konfigurasi extension (ekstensi) dalam sistem. Konfigurasi ini mencakup pengaturan ring timeout, maksimal concurrent calls, dan call recording. Semua endpoint memerlukan autentikasi dan dikaitkan dengan organization.

**Base URL**: `/organizations/:organizationId/extension-configuration`

**Authentication**: Semua endpoint memerlukan `authMiddleware` (authentication token)

---

## Endpoints

### 1. Get Extension Configuration

Mengambil konfigurasi extension untuk organization tertentu.

**Endpoint**: `GET /organizations/:organizationId/extension-configuration`

**Authentication**: Required

**URL Parameters**:
- `organizationId` (string, required): ID organization

**Response Success** (200 OK):
```json
{
  "ring_timeout_seconds": 60,
  "max_concurrent_calls": 1,
  "is_record_a_call": false
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Organization not found"
}
```

atau

```json
{
  "error": "User is not a member of this organization"
}
```

**Response Error** (401 Unauthorized):
```json
{
  "error": "Missing authentication"
}
```

**Example Request**:
```bash
curl -X GET http://localhost:3000/organizations/123e4567-e89b-12d3-a456-426614174000/extension-configuration \
  -H "Authorization: Bearer <token>"
```

**Notes**:
- Jika konfigurasi belum ada, akan mengembalikan nilai default:
  - `ring_timeout_seconds`: 60
  - `max_concurrent_calls`: 1
  - `is_record_a_call`: false
- Endpoint ini dapat diakses oleh Owner atau Staff yang merupakan anggota organization

---

### 2. Update Extension Configuration

Memperbarui konfigurasi extension untuk organization tertentu.

**Endpoint**: `PUT /organizations/:organizationId/extension-configuration`

**Authentication**: Required (Owner only)

**URL Parameters**:
- `organizationId` (string, required): ID organization

**Request Body**:
```json
{
  "ring_timeout_seconds": 90,
  "max_concurrent_calls": 5,
  "is_record_a_call": true
}
```

**Request Body Schema**:
- `ring_timeout_seconds` (number, optional): Waktu maksimal dalam detik sebelum call di-redirect atau di-drop
  - Minimum: 1 second
  - Maximum: 300 seconds
- `max_concurrent_calls` (number, optional): Maksimal jumlah call yang dapat ditangani secara bersamaan
  - Minimum: 1
  - Maximum: 100
- `is_record_a_call` (boolean, optional): Apakah semua call pada extension ini akan direkam
  - `true`: Call akan direkam
  - `false`: Call tidak akan direkam

**Response Success** (200 OK):
```json
{
  "ring_timeout_seconds": 90,
  "max_concurrent_calls": 5,
  "is_record_a_call": true
}
```

**Response Error** (400 Bad Request):
```json
{
  "error": "Ring timeout must be at least 1 second"
}
```

atau

```json
{
  "error": "Only owner can update extension configuration"
}
```

atau

```json
{
  "error": "Organization not found"
}
```

**Response Error** (401 Unauthorized):
```json
{
  "error": "Missing authentication"
}
```

**Example Request**:
```bash
curl -X PUT http://localhost:3000/organizations/123e4567-e89b-12d3-a456-426614174000/extension-configuration \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "ring_timeout_seconds": 90,
    "max_concurrent_calls": 5,
    "is_record_a_call": true
  }'
```

**Example Request (Partial Update)**:
```bash
curl -X PUT http://localhost:3000/organizations/123e4567-e89b-12d3-a456-426614174000/extension-configuration \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "ring_timeout_seconds": 120
  }'
```

**Notes**:
- Hanya Owner yang dapat memperbarui konfigurasi extension
- Semua field bersifat optional, sehingga dapat melakukan partial update
- Jika field tidak diisi, akan menggunakan nilai default atau nilai yang sudah ada
- Jika konfigurasi belum ada, akan dibuat otomatis dengan nilai yang diberikan

---

## Error Codes Summary

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Validation error, organization not found, atau permission denied |
| 401 | Unauthorized - Missing or invalid authentication token |

---

## Data Models

### Extension Configuration Response
```typescript
{
  ring_timeout_seconds: number;    // 1-300 seconds
  max_concurrent_calls: number;     // 1-100
  is_record_a_call: boolean;        // true/false
}
```

### Extension Configuration Update Request
```typescript
{
  ring_timeout_seconds?: number;   // optional, 1-300
  max_concurrent_calls?: number;    // optional, 1-100
  is_record_a_call?: boolean;        // optional
}
```

---

## Field Descriptions

### ring_timeout_seconds
- **Type**: Integer
- **Range**: 1-300 seconds
- **Default**: 60 seconds
- **Description**: Waktu maksimal dalam detik sebelum call di-redirect atau di-drop. Jika waktu habis, call akan di-mark sebagai busy atau di-drop.

### max_concurrent_calls
- **Type**: Integer
- **Range**: 1-100
- **Default**: 1
- **Description**: Maksimal jumlah call yang dapat ditangani oleh extension secara bersamaan. Jika sudah mencapai batas, call tambahan akan di-mark sebagai busy.

### is_record_a_call
- **Type**: Boolean
- **Default**: false
- **Description**: Apakah semua call pada extension ini akan direkam. Recording akan disimpan di Reports.

---

## Authorization

### Get Extension Configuration
- **Owner**: ✅ Dapat mengakses
- **Staff**: ✅ Dapat mengakses
- **Guest/Non-member**: ❌ Tidak dapat mengakses

### Update Extension Configuration
- **Owner**: ✅ Dapat memperbarui
- **Staff**: ❌ Tidak dapat memperbarui
- **Guest/Non-member**: ❌ Tidak dapat memperbarui

---

## Business Rules

1. **Default Values**: Jika konfigurasi belum pernah dibuat, sistem akan mengembalikan nilai default saat GET request.

2. **Partial Update**: Saat melakukan update, tidak perlu mengirim semua field. Hanya field yang ingin diubah yang perlu dikirim.

3. **Validation**:
   - `ring_timeout_seconds` harus antara 1-300 detik
   - `max_concurrent_calls` harus antara 1-100
   - `is_record_a_call` harus boolean (true/false)

4. **Organization Ownership**: Hanya owner dari organization yang dapat memperbarui konfigurasi extension.

5. **Auto Creation**: Jika konfigurasi belum ada dan dilakukan update, sistem akan membuat konfigurasi baru secara otomatis.

---

## Example Use Cases

### Use Case 1: Setup Extension Configuration untuk Organization Baru
```bash
# 1. Get current configuration (will return defaults)
GET /organizations/{orgId}/extension-configuration

# 2. Update with desired values
PUT /organizations/{orgId}/extension-configuration
{
  "ring_timeout_seconds": 90,
  "max_concurrent_calls": 3,
  "is_record_a_call": true
}
```

### Use Case 2: Update Ring Timeout Only
```bash
PUT /organizations/{orgId}/extension-configuration
{
  "ring_timeout_seconds": 120
}
```

### Use Case 3: Enable Call Recording
```bash
PUT /organizations/{orgId}/extension-configuration
{
  "is_record_a_call": true
}
```

### Use Case 4: Increase Max Concurrent Calls
```bash
PUT /organizations/{orgId}/extension-configuration
{
  "max_concurrent_calls": 10
}
```

---

## Notes

- Semua endpoint memerlukan authentication token yang valid
- Organization ID harus berupa UUID yang valid
- Konfigurasi extension bersifat per-organization, bukan per-extension individual
- Call recording yang disimpan dapat diakses melalui Reports API
- Jika `max_concurrent_calls` sudah tercapai, call tambahan akan di-mark sebagai busy dan tidak akan di-route ke extension tersebut

