## Project Document

# Hailoka v1.

## Project Description

### Aplikasi Hailoka dikembangkan sebagai solusi komunikasi modern yang berfungsi layaknya PABX (Private Automatic Branch Exchange), namun

### dengan memanfaatkan infrastruktur berbasis internet (VoIP). Dengan pendekatan ini, pengguna tidak lagi bergantung pada perangkat keras PABX

### tradisional yang mahal dan sulit dikelola.

## Project Documentation Changes Log

### Tanggal Perubahan: 18 October 2025

### Changes Log:

- Perubahan format project documentation


## 1.0 User Story

### User Story, menjelaskan kebutuhan dan perilaku pengguna pada aplikasi Hailoka v1.0. Setiap User Story disusun berdasarkan fitur utama, serta file

### pendukung yang tersimpan pada google drive maupun figma.

### User Story ini bertujuan untuk:

### ● Menjelaskan alur interaksi pengguna terhadap sistem dari sudut pandang fungsional.

### ● Menjadi acuan bagi tim pengembang dan desainer dalam memahami kebutuhan pengguna.

### ● Memastikan setiap fitur dikembangkan sesuai dengan ekspektasi pengguna dan standar kualitas yang telah ditentukan.

### Berikut referensi link UI/UX pada Google Drive dan Figma

### ● Figma : https://www.figma.com/design/CtkkFLWrnTPR703hFv5HGc

### ● Google Drive : https://drive.google.com/drive/folders/1nBTdhkOhwThZFvq4SkwV8HbEEj6MCtWV?usp=drive_link

```
Flow / Feature User Story Acceptance Criteria Filename on Google Drive
SELECT USER
```
- Sebagai user
- Ketika pertama kali membuka web / aplikasi Hailoka
- Saya akan di bawa ke halaman pilih user
    - Akan ada dua opsi, yaitu Guest, Owner / Staff
    - Ketika user memilih Guest, maka user akan di bawa
    ke halaman login / halaman depan sebagai Guest
    - Ketika user memilih Owner / Staff, maka user akan di
    bawa ke halaman sign in / halaman depan sebagai
    Owner / Staff
    - Super admin juga bisa login dengan cara memilih
    Owner / Staff
       1. Select User.png
REGISTRATION
- Sebagai user yang masuk dengan role Owner / Staff
- Saya perlu klik tulisan Register Now pada halaman
login
- Setelah itu saya mengisi data yang diperlukan
- Lalu melakukan verifikasi email
- Setelah verifikasi berhasil
- Baru setelah itu saya bisa login ke dalam Hailoka
- Harus menggunakan email yang valid, oleh karena
itu ada proses verifikasi email
- Syarat password yang valid adalah
- Minimal 8 Karakter
- Minimal mengandung 1 simbol
- Minimal mengandung 1 angka
2. Registration.png


#### FORGOT

#### PASSWORD

- Saya sebagai user dengan role Owner / Staff
- Saya dapat klik **Forgot Password** ketika lupa
dengan password saya
- Saya akan memasukkan email, dan menunggu link
reset password terkirim ke email saya
    - Pastikan email yang dimasukkan adalah email
    dengan role Owner / Staff / Super Admin
    - Jika email tidak ditemukan, tetap kembalikan
    informasi **Reset Password Has Been Sent**
       16. Forgot Password
RESET PASSWORD
- Saya sebagai user
- Akan klik link reset password yang terkirim pada
email saya
- Di link tersebut, saya dapat mengubah password
saya
- Syarat password yang valid adalah
- Minimal 8 Karakter
- Minimal mengandung 1 simbol
- Minimal mengandung 1 angka
16. Forgot Password
LOGIN AS OWNER /
STAFF
- Saya sebagai owner / staff
- Saya dapat masuk dengan memilih opsi **Owner /
Staff** pada halaman select user
- Saya dapat masuk menggunakan email & password
- Saya juga dapat masuk menggunakan **Sign in With
Google**
- Jika memang user yang masuk belum pernah
melakukan registrasi sebelumnya, maka berikan
informasi bahwa password yang dimasukkan salah
3. Login.png
LOGIN AS GUEST
- Saya sebagai guest
- Saya masuk dengan memilih opsi **Guest** pada
halaman select user
- Saya dapat masuk dengan memasukkan nama saja
- Namun saya juga dapat masuk dengan **Sign in With
Google**
- User dengan nama yang sama, akan dianggap
sebagai 2 user ID yang berbeda
7. Guest Flow.png
LOGIN AS SUPER
ADMIN
- Sebagai user
- Saya akan memilih opsi **Owner / Staff**
- Lalu saya akan memasukkan informasi email &
password
- Kemudian BE akan cukup pintar untuk mendeteksi
role saya
- Baru setelah itu saya masuk ke **dashboard Super
Admin**
- BE **HARUS MENDETEKSI** bahwa yang login adalah
**SUPER ADMIN**
- Jika yang login bukanlah Super Admin, maka lempar
ke halaman login biasa
3. Login.png


#### (SUPER ADMIN)

#### HOME /

#### DASHBOARD

- Sebagai super admin
- Saya dapat melihat informasi penting di dashboard
- Saya juga bisa langsung melihat & me-review
organisasi yang terdaftar di Hailoka
    - Hanya user dengan role **SUPER ADMIN** yang bisa
    masuk ke dashboard
       4. Super Admin - Home
       Dashboard.png
(SUPER ADMIN)
USERS
- Sebagai super admin
- Saya dapat melihat siapa saja user (owner / staff)
yang mendaftar ke dalam Hailoka
- Saya dapat melihat detail user (owner / staff)
- Saya dapat meng-suspend jika diperlukan
- Saya dapat meng-aktifkan user yang sudah di
suspend jika perlu
- Ketika user dengan role owner di suspend, maka
organisasi under user tersebut akan ikut tersuspend
- Jika user dengan role staff ( **bukan owner** ) di suspen,
maka organisasi di under user tersebut tidak terjadi
apa-apa
5. Super Admin -
Users.png
(SUPER ADMIN)
ORGANIZATIONS
- Sebagai super admin
- Saya dapat melihat organisasi yang terdaftar di
dalam Hailoka
- Saya dapat meng-approve organisasi yang statusnya
masih pending
- Saya dapat meng-reject organisasi yang statusnya
masih pending
- Saya dapat meng-suspend organisasi jika diperlukan
- Saya dapat meng-aktifkan kembali jika diperlukan
- Ketika user meng-approve organisasi, maka sistem
akan mengirim email kepada owner untuk
memberitahukan bahwa organisasinya sudah
approved dan bisa digunakan
- Ketika user meng-reject organisasi, maka sistem
akan mengirim email kepada owner untuk
memberitahukan bahwa organisasi tersebut di-reject
- Ketika organisasi di suspend, user dengan role
owner / staff tidak akan ter-suspend
6. Super Admin -
Organizations.png
GUEST
- Saya sebagai guest
- Saya dapat masuk hanya dengan meng-input nama
- Namun saya juga dapat login menggunakan "Sign in
With Google"
- Saya bisa scan QR untuk masuk ke organisasi
sebagai Guest
- Kemudian saya bisa memilih extension yang saya
ingin hubungi
- Ketika panggilan sudah selesai, saya bisa mengisi
feedback panggilan
- Namun saya juga bisa mengosongkan feedback
tersebut / diisi belakangan
- Tidak akan ada validasi berdasarkan nama, artinya
dengan nama yang sama, akan di anggap sebagai
user ID yang berbeda
- Hanya bisa scan di 1 organisasi, untuk masuk ke
organisasi lain, harus keluar dari organisasi yang
sudah dimasuki
7. Guest Flow.png


#### (OWNER / STAFF)

#### HOME /

#### DASHBOARD

- Saya sebagai owner / staff
- Pada halaman home / dashboard, saya bisa melihat
mana panggilan yang **incoming**
- Saya juga bisa melihat historikal **incoming call**
    - History **CALL** yang muncul di home / dashboard,
    hanya jika user tersebut ada akses ke extension
    tersebut
       8. Owner or Staff -
       Home.png
(OWNER / STAFF)
INCOMING CALL
- Saya sebagai owner / staff
- Ketika masuk ke halaman mana pun, **JIKA ADA
INCOMING CALL** maka,
- Akan muncul komponen toast call, dan tidak bisa
hilang
- Untuk saat ini, hanya akan ada 1 tab yang aktif
(seperti WA), jadi jika dia buka di lebih dari 1 tab, maka
tab yang lain di tanyakan apakah ingin aktif ke tab
tersebut atau tidak
- INCOMING CALL yang muncul, hanya jika staff ada
akses ke extension tersebut
14. Owner or Staff -
Incoming Call.png
(OWNER / STAFF)
EXTENSION
- Saya sebagai owner / staff
- Saya bisa melihat daftar extension
- Saya juga bisa menambah atau mengubah informasi
di extension
- hanya staff dengan role OWNER / BRANCH ADMIN
yang bisa mengakses ke halaman extension
9. Owner or Staff -
Extension.png
(OWNER / STAFF)
EXTENSION RULES
- Saya sebagai owner / staff
- Saya bisa mengatur extension rule sesuai dengan
kebutuhan
- hanya staff dengan role OWNER / BRANCH ADMIN
yang bisa mengakses ke halaman extension rule
10. Owner or Staff -
Rules.png
(OWNER)
SETTINGS
- Saya sebagai owner
- Saya bisa meng-akses halaman setting
- Di halaman ini, untuk fase sekarang, saya bisa
mengakses menu
- Organization Detail
- Extension Configuration
- Pada halaman Organization Detail, saya bisa melihat
informasi organisasi saya, dan saya bisa
meng-generate / meng-re-generate QR
- Pada halaman Extension Configuration, saya bisa
mengubah informasi Extension Configuration
- hanya role OWNER yang bisa mengakses halaman
ini
13. Owner - Settings.png
(OWNER / STAFF)
PROFILE SETTING
- Saya sebagai owner / staff
- Saya bisa mengubah beberaoa informasi akun
melalui halaman ini
15. Profile Setting.png


#### (OWNER / STAFF)

#### CALL MECHANISM

- Saya sebagai owner / staff
- Saya bisa menjawab panggilan oleh guest
- Saya juga bisa meng-transfer panggilan dari
extension A ke extension B
    - Hanya extension yang masih dalam jam operasional,
    yang bisa di transfer
       8. Owner or Staff -
       Home.png
(OWNER / STAFF)
TRANSFER
MECHANISM
- Saya sebagai owner / staff
- Saya dapat menerima telpon yang di transfer ke
extension yang ditugaskan kepada saya
8. Owner or Staff -
Home.png


## 2.0 Rancangan Database Hailoka v1.

### Bagian ini menjelaskan rancangan struktur database yang digunakan pada sistem Hailoka versi 1.0. Perancangan database dilakukan dengan

### tujuan untuk memastikan setiap entitas dan relasinya dapat mendukung kebutuhan fitur aplikasi secara optimal, mulai dari proses autentikasi

### pengguna, manajemen data, hingga aktivitas operasional di sisi Owner maupun Staff.

### Untuk melihat struktur Database secara keseluruhan, dapat dengan mengakses link di bawah.

### https://drive.google.com/file/d/1oCmROLF2kSbZMORxAH2fJFKO0nTn9n-6/view?usp=drive_link

### Adapun detail rinci setiap tabel yang akan dijelaskan di bawah.

### Setiap tabel di bawah ini menyajikan detail struktur data yang telah dirancang, meliputi beberapa elemen utama seperti:

### ● Nama tabel

### ● Nama kolom

### ● Tipe data yang digunakan

### ● Keterangan / deskripsi untuk memperjelas fungsi masing-masing field


## 2.1 Table Users

### Table ini akan digunakan untuk menyimpan informasi user, misal apakah dia adalah seorang Super Admin atau Owner , Staff maupun Guest.

### Nama table : users

```
column name data type description
id** UUID || PK
name VARCHAR (100) || NULLABLE
email VARCHAR (100) || NULLABLE
picture_path VARCHAR (255) || NULLABLE
is_verified_email SMALLINT(1) default value : 0
created_at DATETIME GMT+
updated_at DATETIME GMT+
```

## 2.2 Table User Auth Methods

### Table ini akan digunakan untuk menyimpan metode login setiap user, apakah user akan login menggunakan password, atau mungkin menggunakan

### metode “Sign In with Google” atau bisa juga digunakan untuk menyimpan token autentikasi yang dilakukan oleh Guest

### Nama table : user_auth_methods

```
column name data type description
user_id UUID value dari table users
provider** ENUM || PK
enum value:
```
- guest_token
- password
- google_login
default value : **guest_token**
provider_user_id** VARCHAR (20) || PK
IF provider IS guest_token
THEN value IS generated token by code
IF provider IS password
THEN value IS email user dari table users
IF provider IS google_login
THEN value IS value dari return google
password_hash VARCHAR (255) || NULLABLE
field ini hanya di isi jika
value column **provider** adalah **password**
last_login_at DATETIME GMT+
created_at DATETIME GMT+
updated_at DATETIME GMT+


## 2.3 Table Organizations

### Table ini akan digunakan untuk menyimpan informasi organisasi yang didaftarkan ke dalam sistem Hailoka. Seluruh organisasi dengan status in

### review atau live ataupun rejected akan tersimpan di dalam table ini.

### Nama table : Organizations

```
column name data type description
id** UUID || PK
name VARCHAR (100)
total_member INT
description TEXT
address TEXT
latitude INT default value : 0
longitude INT default value : 0
organization_status_id INT
primary_contact_full_name VARCHAR (100)
primary_contact_phone_number VARCHAR (50)
reviewer_notes TEXT || NULLABLE
internal_notes TEXT || NULLABLE
primary_did_number VARCHAR (50)
created_by UUID value ini, ambil dari user yang melakukan
updated_by UUID GMT+
created_at DATETIME GMT+
updated_at DATETIME GMT+
```
### Ada beberapa hal yang perlu diperhatikan, yaitu:


- Setiap kali status organisasi sudah **APPROVED** oleh **Super Admin** maka akan ada proses otomatis yang meng-insert / meng-update

### informasi di table general_extension_settings.

- Selain itu, jangan lupa untuk otomatis memasukkan informasi **owner** ke dalam table **organization_users**.
- Kemudian, di dalam table ini (organizations), ada field dengan nama **primary_did_number** field ini nantinya digunakan untuk menyimpan

### nomor telepon organisasi.


## 2.4 Table Organization Change Logs

### Table ini akan digunakan untuk menyimpan seluruh informasi perubahan yang terjadi pada organisasi.

### Nama table : organization_change_logs

```
column name data type description
id** INT || PK || AUTO_INCREMENT
organization_id UUID
old_data_json TEXT || NULLABLE
new_data_json TEXT
user_id UUID diambil dari user_id di table users
created_at DATETIME GMT+
```
### Ada beberapa hal yang perlu diperhatikan terkait table ini, yaitu:

- Setiap perubahan yang terjadi pada organisasi akan selalu meng-insert value ke dalam table ini bahkan termasuk ketika pertama kali

### organisasi di create.

- Ketika organisasi baru di create, maka value pada **old_data_json_text** adalah NULL dan **new_data_json** di isi dengan data yang ada pada

### organisasi.


## 2.5 Table Organization Generated QR

### Table ini akan digunakan untuk menyimpan informasi QR yang tersedia atau yang di generate oleh organisasi.

### Nama table : organization_generated_qr

```
column name data type description
id** UUID || PK
organization_id UUID
data_json TEXT digunakan untuk menyimpan seluruh informasi QR
created_by UUID diambil dari user_id pada table users
created_at DATETIME GMT+
expired_at DATETIME || NULLABLE GMT+
```
### Ada beberapa hal yang perlu diperhatikan, yaitu, setiap organisasi hanya akan memiliki 1 QR saja sehingga ketika user meng-generate QR lain,

### maka QR yang lama akan menjadi expired.


## 2.6 Table Organization Status

### Table ini akan digunakan untuk menyimpan informasi status organisasi, isi value pada tabel ini sudah di definisi dari awal ketika table ini terbentuk.

### Nama table : organization_status

```
column name data type description
id** INT || PK
value:
0 : PENDING APPROVAL
1 : APPROVED
2 : REJECTED
3 : SUSPENDED
name VARCHAR (20)
```
## 2.7 Table Role

### Table ini akan digunakan untuk menyimpan informasi built-in role, artinya value yang terdapat pada table ini sudah di definisi dari awal ketika table ini

### terbentuk.

### Nama table : role

```
column name data type description
id** INT || PK
value:
1 : OWNER
2 : BRANCH ADMIN
3 : CALL AGENT
name VARCHAR (20)
```

## 2.8 Table Organization Users

### Table ini akan digunakan untuk menyimpan informasi siapa saja user yang tergabung ke dalam organisasi, artinya, setiap user yang berada di

### organisasi tersebut, pasti memiliki relasi di dalam table organization_users.

### Nama table : organization_users

```
column name data type description
user_id UUID
organization_id** UUID || PK
user_email** VARCHAR (100) || PK
role_id INT value diambil dari table roles
status ENUM
value:
```
- PENDING
- REJECTED
- ACTIVE
- SUSPENDED
added_by UUID diambil dari **user_id** di table **users**
updated_by UUID diambil dari **user_id** di table **users**
removed_by UUID || NULLABLE diambil dari **user_id** di table **users**
removed_at DATETIME || NULLABLE GMT+
created_at DATETIME GMT+
updated_at DATETIME GMT+


## 2.9 Table Organization User Logs

### Table ini akan digunakan untuk mencatat seluruh banyak hal dan cukup variatif, seperti:

- Penambahan / perubahan role pada user
- Penambahan / perubahan extension yang di assigned
- Dll.

### Nama table : organization_user_logs

```
column name data type description
id** INT || PK || AUTO_INCREMENT
extension_id UUID
user_id UUID
old_data_json TEXT
new_data_json TEXT
created_by UUID diambil dari user_id di table users
created_at DATETIME GMT+
```

## 2.10 Table Extensions

### Table ini, akan digunakan untuk menyimpan seluruh informasi extension yang terbuat di semua organisasi.

### Nama table : extensions

```
column name data type description
id** UUID || PK
organization_id UUID
name VARCHAR (100)
status_id INT value ada pada table extension_status
added_by UUID diambil dari user_id pada table users
updated_by UUID diambil dari user_id pada table users
created_at DATETIME GMT+
updated_at DATETIME GMT+
```

## 2.11 Table Extension Assigned Staffs

### Table ini akan digunakan untuk menyimpan informasi staff yang ditugaskan ke dalam extension, artinya staff yang sudah di assign / di tugaskan ke

### extension tertentu, pasti akan memiliki record pada table ini.

### Nama table : extension_assigned_staffs

```
column name data type description
extension_id** UUID || PK
user_id** UUID || PK diambil dari user_id pada table users
assigned_by UUID diambil dari user_id pada table users
assigned_at DATETIME GMT+
```
## 2.12 Table General Extension Settings

### Table ini akan digunakan untuk menyimpan setting general / global pada organisasi, hal yang perlu diperhatikan adalah, jumlah informasi / row

### pada tabel ini, akan sejalan dengan organisasi yang statusnya sudah APPROVED.

### Nama table : general_extension_settings

```
column name data type description
organization_id** UUID || PK
ring_timeout_seconds INT default value : 60
is_record_a_call SMALLINT (1) || value 1 / 0 default 0
last_update_by UUID diambil dari user_id pada table users
created_at DATETIME GMT+
updated_at DATETIME GMT+
```

## 2.13 Table Extension Operational Hours

### Table ini akan digunakan untuk menyimpan informasi jam operasional pada setiap extension.

### Nama table : extension_operational_hours

```
column name data type description
id** INT || PK || AUTO_INCREMENT
extension_id UUID
day_of_week SMALLINT (1)
value:
1 - MONDAY
2 - TUESDAY
3 - WEDNESDAY
..
..
7 - SUNDAY
start_time TIME example value : 04:
end_time TIME example value : 20:
```

## 2.14 Table Extension Logs

### Table ini akan digunakan untuk menyimpan seluruh perubahan yang terjadi pada extension.

### Nama table : extension_logs

```
column name data type description
id** INT || PK || AUTO_INCREMENT
extension_id UUID
user_id UUID
old_data_json TEXT
new_data_json TEXT
created_at DATETIME GMT+
```

## 2.15 Table Extension Rules

### Table ini akan digunakan untuk menyimpan seluruh rules yang ada pada extension.

### Nama table : extension_rules

```
column name data type description
id** UUID || PK
organization_id UUID
extension_id UUID
timescope ENUM
value:
```
- ANY
- WORK_HOURS
- OFF_HOURS
condition ENUM
value:
- ALWAYS
- BUSY
- NO_ANSWER
- UNREACHABLE
created_by UUID diambil dari **user_id** pada table **users**
created_at DATETIME GMT+0
updated_by UUID diambil dari **user_id** pada table **users**
updated_at DATETIME GMT+0
deleted_by UUID || NULLABLE diambil dari **user_id** pada table **users**
deleted_at DATETIME GMT+0


## 2.16 Table Extension Status

### Table ini berisi extension status dan value di dalam table ini sudah di definisi ketika table ini diciptakan.

### Nama table : extension_status

```
column name data type description
id** INT || PK
value:
1 : ACTIVE
2 : INACTIVE
name VARCHAR (20)
```

## 2.17 Table Calls

### Table ini berisi record panggilan yang terjadi. Di dalam table ini akan ada 1 kolom dengan nama direction , di dalam kolom tersebut akan ada 3

### default value, berikut value dan penjelasannya:

- INBOUND, adalah panggilan yang dilakukan oleh **guest** terhadap **extension**
- OUTBOUND, adalah panggilan yang dilakukan oleh **staff / extension** terhadap **guest**
- INTERNAL, adalah panggilan yang dilakukan antara **sesama** extension / staff

### Nama table : calls

```
column name data type description
id** UUID || PK
organization_id UUID
join_code UUID || UNIQUE
harus unik,
sifatnya sama seperti google meet -> iozudnuxps,
jadi bisa gampang di copy jika perlu.
direction ENUM
value:
```
- INBOUND
- OUTBOUND
- INTERNAL
created_at DATETIME GMT+0


## 2.18 Table Call Participants

### Table ini akan digunakan untuk menyimpan siapa saja partisipan yang tergabung di dalam suatu sesi panggilan.

### Nama table : call_participants

```
column name data type description
id** INT || PK || AUTO_INCREMENT
call_id UUID
role ENUM
value:
```
- HOST
- CALLER
- RECIPIENT
kind ENUM
value:
- USER
- GUEST
- EXTENSION
ref_id UUID
value -> tergantung ID mana yang akan diambil,
bisa id milik guest / user / extension
created_at DATETIME GMT+0


## 2.19 Table Call Events

### Table ini akan berisi seluruh event dari panggilan yang terjadi, misal dimulai dari suatu panggilan di initiate, dijawab hingga dimatikan.

### Nama table : call_events

```
column name data type description
id** INT || PK || AUTO_INCREMENT
call_id UUID
call_participant_id INT || NULLABLE
hanya di isi untuk beberapa event_type
seperti -> answered, rejected dll
attempt_count INT default value : 0
event_type ENUM value ada di note di bawah
queue_count INT
default value: 0
hanya di isi jika event_type = queue
created_at DATETIME GMT+0
```
### Untuk value dari kolom event_type akan sangat beragam, berikut value dan penjelasannya:

- created: record panggilan dibuat.
- queued: masuk antrean (routing/ACD).
- queue_updated: posisi/prioritas antrean berubah.
- dial_attempt: percobaan dial ke endpoint (retry/route lain).
- ringing: callee awal berdering.
- answered: terjawab oleh callee awal.
- hold: call ditahan.
- unhold : call dilepas.
- forward: keputusan untuk meneruskan call (ke B).
- forward_ringing: panggilan ke B sedang berdering.


- forward_answered: dijawab oleh B.
- forward_no_answer: B tidak menjawab dalam TTL.
- forward_busy: B sibuk (busy).
- transfer: blind transfer dipicu.
- transfer_ringing: target transfer sedang berdering.
- transfer_answered: target transfer menjawab.
- transfer_no_answer: target transfer tidak menjawab dalam TTL.
- transfer_busy: target transfer sibuk.
- transfer_consulting: pada attended transfer, agent sedang konsultasi dengan target.
- transfer_connecting: caller sedang disambungkan ke target attended transfer.
- transfer_completed: proses transfer attended selesai, panggilan dialihkan.
- transfer_failed: kegagalan teknis saat melakukan transfer.
- transfer_canceled: transfer dibatalkan oleh agent/sistem.
- transfer_attended: attended/warm transfer berhasil (marker hasil).
- rejected: callee menolak (user action).
- busy: sibuk (untuk leg awal).
- timeout: habis waktu tanpa jawaban (untuk leg aktif).
- missed: tidak dijawab oleh target akhir.
- canceled: caller membatalkan sebelum terjawab.
- failed: kegagalan teknis (SIP/transport/codec).
- ended: sesi berakhir (hangup/teardown).


## 2.20 Table Call Feedbacks

### Sesuai dengan namanya, table ini akan digunakan untuk menampung feedback dari setiap panggilan yang terjadi.

### Nama table : call_feedbacks

```
column name data type description
id** UUID || PK || AUTO_INCREMENT
call_id UUID
kind ENUM
value:
```
- GUEST
- USER
ref_id ENUM
value -> tergantung ID mana yang akan diambil,
bisa id milik guest / user / extension
score SMALLINT value : 1 - 5
feedback VARCHAR (500)
created_at DATETIME GMT+0
updated_at DATETIME GMT+0


## 3.0 Flowchart Panggilan

### Ada juga beberapa proses bisnis atau alur logika yang terjadi pada sistem ketika suatu panggilan terjadi.


## 4.0 Simulasi Insert Data Ketika Terjadi Panggilan

### Berikut adalah simulasi data yang di insert ke dalam database ketika terjadi panggilan.

## 4.1 Simulasi Insert Data - Alur Normal (Tanpa Masuk Antrian)

### Berikut adalah simulasi data yang di insert ke dalam database ketika terjadi panggilan dengan alur normal, artinya tanpa masuk ke dalam antrian.

### —

### # 1

### # ketika guest melakukan panggilan ke extension

### # dan kebetulan tidak masuk ke dalam antrian

### # (contoh kasus di sini, guest menghubungi extension resepsionis), action:

- insert data ke dalam table **calls**
- insert data ke dalam table **call_participants**
- insert data ke dalam table **call_events**

### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
```

### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
```
### —

### # 2

### # lalu ketika panggilan dijawab oleh staff yang sedang bertugas, action:

- insert data ke dalam table **call_participants**
- insert data ke table **call_events**

### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
cp3 call111 recipient user staff111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 cp3 1 answered 0
```

### —

### # 3

### # kemudian jika panggilan sudah selesai atau dimatikan, action:

- insert ke table **call_events**

### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
cp3 call111 recipient user staff111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 cp3 1 answered 0
ce4 call111 - 1 ended 0
```

## 4.2 Simulasi Insert Data - Dengan Panggilan Masuk Antrian

### Berikut adalah contoh simulasi data insert yang terjadi ketika suatu panggilan masuk ke dalam antrian.

### —

### # 1

### # ketika guest melakukan panggilan ke extension

### # dan kebetulan masuk ke dalam antrian urutan ke 2

### # (contoh kasus di sini, guest menghubungi extension resepsionis), action:

- insert data ke dalam table **calls**
- insert data ke dalam table **call_participants**
- insert data ke dalam table **call_events**

### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 - 1 queued 2
```

### —

### # 2

### # kemudian antrian ter-update dari 2 menjadi 1, action:

- insert data pada **call_events**

### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 - 1 queued 2
ce4 call111 - 1 queue_updated 1
```
### —

### # 3

### # kemudian antrian ter-update kembali dari 1 menjadi 0, action:

- insert data pada table **call_events**


### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 - 1 queued 2
ce4 call111 - 1 queue_updated 1
ce5 call111 - 1 queue_updated 0
ce6 call111 - 1 ringing 0
```
### —

### # 4

### # kemudian panggilan di jawab, action:

- insert pada table **call_participants**
- insert pada table **call_events**


### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
cp3 call111 recipient user staff111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 - 1 queued 2
ce4 call111 - 1 queue_updated 1
ce5 call111 - 1 queue_updated 0
ce6 call111 - 1 ringing 0
ce7 call111 cp3 1 answered 0
```
### —

### # 5

### # ketika panggilannya sudah selesai atau dimatikan

### action

- insert pada table **call_events**


### Table - calls

```
id organization_id join_code direction
call111 org888 abcdef inbound
```
### Table - call_participants

```
id call_id role kind ref_id
cp1 call111 host extension resepsionis111
cp2 call111 caller guest guest111
cp3 call111 recipient user staff111
```
### Table - call_events

```
id call_id call_participant_id attempt_count event_type queue_count
ce1 call111 - 1 created 0
ce2 call111 - 1 ringing 0
ce3 call111 - 1 queued 2
ce4 call111 - 1 queue_updated 1
ce5 call111 - 1 queue_updated 0
ce6 call111 - 1 ringing 0
ce7 call111 cp3 1 answered 0
ce8 call111 - 1 ended 0
```

