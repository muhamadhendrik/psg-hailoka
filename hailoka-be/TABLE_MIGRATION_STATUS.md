# Status Migration & API untuk Table di PRD

## Ringkasan
Dokumen ini membandingkan semua table yang disebutkan di PRD dengan migration dan API yang sudah dibuat.

---

## ✅ Table yang Sudah Ada Migration

| No | Table Name | Migration File | Model File | Status |
|----|------------|----------------|------------|--------|
| 1 | users | ✅ 20250929094523-create-users.js | ✅ user.model.ts | ✅ |
| 2 | user_auth_methods | ✅ 20250930091945-create-user_auth_methods.js | ✅ user_auth_method.model.ts | ✅ |
| 3 | organizations | ✅ 20251008102222-create-organizations-table.js | ✅ organization.model.ts | ⚠️ Missing fields |
| 4 | organization_users | ✅ 20251008102245-create-organization-users-table.js | ✅ organizationUser.model.ts | ✅ |
| 5 | organization_status | ✅ 20251008102305-create-organization-status-table.js | - | ✅ |
| 6 | role | ✅ 20251008102328-create-role-table.js | ✅ role.model.ts | ✅ |
| 7 | organization_generated_qr | ✅ 20251023124830-create-organization-generated-qr.js | ✅ organizationgeneratedqr.model.ts | ✅ |
| 8 | extensions | ✅ 20251013105120-create-extensions-table.js | ✅ extension.model.ts | ✅ |
| 9 | extension_status | ✅ 20251013105133-create-extension-status-table.js | ✅ extensionStatus.model.ts | ✅ |
| 10 | extension_assigned_staffs | ✅ 20251013105146-create-extension-assigned-staffs-table.js | ✅ extensionAssignedStaff.model.ts | ✅ |
| 11 | extension_operational_hours | ✅ 20251013105155-create-extension-operational-hours-table.js | ✅ extensionOperationalHour.model.ts | ✅ |
| 12 | extension_rules | ✅ 20251021101743-create-extension-rule-table.js | ✅ extensionRule.model.ts | ✅ |
| 13 | calls | ✅ 20251030144825-create-calls-table.js | ✅ call.model.ts | ✅ |
| 14 | call_participants | ✅ 20251030144840-create-call-participants-table.js | ✅ callParticipant.model.ts | ✅ |
| 15 | call_events | ✅ 20251030144853-create-call-events-table.js | ✅ callEvent.model.ts | ✅ |
| 16 | call_staff_availability | ✅ 20251031135757-create-call-staff-availability.js | ✅ callStaffAvailability.ts | ✅ |

---

## ❌ Table yang BELUM Ada Migration

| No | Table Name | PRD Section | Status | Keterangan |
|----|------------|-------------|--------|------------|
| 1 | **organization_change_logs** | 2.4 | ❌ Belum ada | Log perubahan organisasi |
| 2 | **organization_user_logs** | 2.9 | ❌ Belum ada | Log perubahan user di organisasi |
| 3 | **general_extension_settings** | 2.12 | ⚠️ Model ada, migration belum | Model sudah dibuat, perlu migration |
| 4 | **extension_logs** | 2.14 | ❌ Belum ada | Log perubahan extension |
| 5 | **call_feedbacks** | 2.20 | ❌ Belum ada | Feedback dari panggilan |

---

## ⚠️ Field yang Missing di Table Organizations

Table `organizations` sudah ada migration, tapi **missing 2 field** sesuai PRD:

| Field Name | Type | Status | Keterangan |
|------------|------|--------|------------|
| **reviewer_notes** | TEXT \|\| NULLABLE | ❌ Missing | Catatan reviewer (super admin) |
| **primary_did_number** | VARCHAR(50) | ❌ Missing | Nomor telepon organisasi |

**Note:** Field `internal_notes` sudah ada, tapi `reviewer_notes` belum ada.

---

## 📋 Status API per Table

### ✅ Table dengan API Lengkap

| Table | API Endpoints | Controller | Status |
|-------|---------------|------------|--------|
| **users** | GET /users/me, POST /users/registration, dll | UserController, AuthController | ✅ |
| **organizations** | POST /organizations, GET /organizations, GET/PUT /organizations/:id/settings | OrganizationController | ✅ |
| **organization_users** | POST /staff, GET /organizations/:id/staffs, dll | StaffController | ✅ |
| **extensions** | POST /extensions, GET /extensions/:orgId, PUT /extensions/:id, dll | ExtensionController | ✅ |
| **extension_rules** | POST /extensions-rule, GET /extensions-rule/:orgId, dll | ExtensionRuleController | ✅ |
| **role** | POST /roles, GET /roles, GET /roles/:id, PUT /roles/:id, DELETE /roles/:id | RoleController | ✅ |
| **organization_generated_qr** | GET /qr/org/:id, POST /qr/generate, GET /qr/url/:url | QrOrganizationController | ✅ |
| **calls** | POST /call | CallController | ⚠️ Minimal (hanya create) |

### ⚠️ Table dengan API Terbatas

| Table | API Endpoints | Status | Keterangan |
|-------|---------------|--------|------------|
| **call_participants** | - | ❌ Tidak ada API langsung | Digunakan via Call API |
| **call_events** | - | ❌ Tidak ada API langsung | Digunakan via Call API |
| **call_feedbacks** | - | ❌ Tidak ada API | Table belum ada migration |

### ❌ Table Tanpa API

| Table | Status | Keterangan |
|-------|--------|------------|
| **organization_change_logs** | ❌ Tidak ada API | Table belum ada migration |
| **organization_user_logs** | ❌ Tidak ada API | Table belum ada migration |
| **extension_logs** | ❌ Tidak ada API | Table belum ada migration |
| **general_extension_settings** | ⚠️ Tidak ada API langsung | Digunakan via Organization Settings API |

---

## 🎯 Rekomendasi

### 1. Migration yang Perlu Dibuat

1. **organization_change_logs** - Untuk tracking perubahan organisasi
2. **organization_user_logs** - Untuk tracking perubahan user di organisasi
3. **general_extension_settings** - Migration untuk table yang modelnya sudah ada
4. **extension_logs** - Untuk tracking perubahan extension
5. **call_feedbacks** - Untuk menyimpan feedback panggilan

### 2. Field yang Perlu Ditambahkan

**Migration untuk menambahkan field di table `organizations`:**
- `reviewer_notes` (TEXT, NULLABLE)
- `primary_did_number` (VARCHAR(50))

### 3. API yang Perlu Dibuat

1. **Call Feedbacks API**
   - POST /calls/:callId/feedback - Submit feedback
   - GET /calls/:callId/feedback - Get feedback

2. **Call History/Events API** (jika diperlukan)
   - GET /calls/:callId/events - Get call events
   - GET /calls/:callId/participants - Get call participants

3. **Logs API** (optional, untuk audit)
   - GET /organizations/:id/change-logs
   - GET /organizations/:id/user-logs
   - GET /extensions/:id/logs

---

## 📊 Summary

- **Total Table di PRD:** 20 tables
- **Table dengan Migration:** 16 tables ✅
- **Table tanpa Migration:** 5 tables ❌
- **Field Missing:** 2 fields di table organizations ⚠️
- **API Lengkap:** ~8 tables ✅
- **API Terbatas/Minimal:** ~3 tables ⚠️
- **Tanpa API:** ~5 tables ❌

---

## ✅ Yang Sudah Selesai

1. ✅ Super Admin APIs (dashboard, users, organizations management)
2. ✅ Owner/Staff Dashboard API (incoming calls)
3. ✅ Organization Settings API
4. ✅ Model GeneralExtensionSettings (perlu migration)
5. ✅ Unit tests untuk semua controller baru

---

## 🔧 Yang Perlu Dikerjakan

1. ❌ Buat migration untuk 5 table yang missing
2. ❌ Tambahkan field `reviewer_notes` dan `primary_did_number` ke table organizations
3. ❌ Buat API untuk call_feedbacks
4. ⚠️ Pertimbangkan API untuk logs (optional)

