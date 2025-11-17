# ArkeoGIS - Archaeological Data API

This repository contains the complete backend API server for **ArkeoGIS**, a collaborative, verification-based Web GIS application designed for archaeological data management.

It is built using Node.js (Express) and PostgreSQL, with a secure authentication system, 3-tier Role-Based Access Control (RBAC), robust data validation, and a complete submission–verification workflow.  
This API is intended to be used by a separate frontend application (e.g., Leaflet.js, React, or Vue).


## ✨ Key Features

- **JWT Authentication:** Secure `register` and `login` endpoints using JSON Web Tokens.
- **3-Tier Role System (RBAC):**
  - **Contributor:** Can submit new archaeological data for verification.
  - **Verifier:** Reviews, approves, or rejects submitted data.
  - **Administrator:** Full control, including user management and permanent deletion.
- **Data Verification Workflow:** Newly submitted data (`situs_arkeologi`, `objek_temuan`) is created with a `pending` status and hidden from the public API until approved.
- **Highly Modular Architecture:** Clean folder separation for routes, validators, middleware, and database.
- **Robust Input Validation:** All inputs are validated with **Joi** before accessing the database.
- **Security Best Practices:**
  - Password hashing with `bcrypt`
  - Environment variables using `dotenv`
  - Connection pooling using `pg`


## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **jsonwebtoken (JWT)**
- **bcrypt**
- **Joi**
- **dotenv**
- **pg (node-postgres)**


## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Git
- API testing tool (Postman, Thunder Client, etc.)


### 2. Clone and Install

```bash
git clone https://github.com/ravifposeur/archeology_db_project.git
cd archeology_db_project

npm install
```


### 3. Setup Database

1. Login to PostgreSQL:

```bash
sudo -i -u postgres
psql
```

2. Run the SQL:

```sql
CREATE DATABASE arkeologiDB;

CREATE USER arkeologi_app WITH PASSWORD 'your_secret_password_here';

GRANT ALL PRIVILEGES ON DATABASE arkeologiDB TO arkeologi_app;

\c arkeologiDB
GRANT ALL ON SCHEMA public TO arkeologi_app;
```

3. Execute the `scheme.sql` file using DBeaver or `psql`.


## 4. Environment Variables

Create `.env` in the root folder:

```
DB_USER=arkeologi_app
DB_HOST=localhost
DB_NAME=arkeologiDB
DB_PASSWORD=your_secret_password_here
DB_PORT=5432

JWT_SECRET=this_is_a_very_long_and_random_secret_key_for_jwt
```


## 5. Run the Server

```bash
node index.js
```

Server will run at:

```
http://localhost:3000
```


# 📖 API Documentation (CRUD & Workflow Demo)

All endpoints are under `/api`.  
Protected routes require:

```
Authorization: Bearer <token>
```


# 1. Authentication (`/api/auth`)

## **POST /auth/register**

- Registers a new user (default role: `contributor`)
- **Public**
- **Request Body:**
```json
{
    "nama_pengguna": "kontributor_baru",
    "email": "kontributor@example.com",
    "password": "passwordminimal8karakter"
}
```

- **Response:**
```json
{
    "message": "User dibuat!",
    "user": {
        "pengguna_id": 1,
        "nama_pengguna": "kontributor_baru",
        "email": "kontributor@example.com",
        "role": "kontributor"
    }
}
```


## **POST /auth/login**

- Logs in user and returns JWT  
- **Public**

**Request:**
```json
{
    "email": "kontributor@example.com",
    "password": "passwordminimal8karakter"
}
```

**Response:**
```json
{
    "message": "Login Berhasil!",
    "token": "jwt_token_here"
}
```


# 2. Situs Arkeologi (`/api/situs`)

Demonstrates the verification workflow.


## **GET /situs/verified**

- Returns all approved archaeological sites  
- **Public**


## **POST /situs**

- Contributor submits a new site  
- Status = `pending`  
- **Requires: Contributor**

**Request:**
```json
{
    "nama_situs": "Makam Imogiri",
    "jalan_dusun": "Dusun Pajimatan",
    "desa_kelurahan_id": 1,
    "latitude": -7.9234,
    "longitude": 110.3876,
    "jenis_situs": "Makam",
    "kerajaan_id": 1
}
```


## **GET /situs/pending**

- Verifier sees all pending sites  
- **Requires: Verifier**


## **PUT /situs/approve/:id**

- Verifier approves pending submission  
- Makes it public  
- **Requires: Verifier**

**Response:**
```json
{
    "message": "Situs berhasil diverifikasi!",
    "data": {
        "situs_id": 1,
        "status_verifikasi": "verified"
    }
}
```


## **PUT /situs/reject/:id**

- Verifier rejects submission  
- **Requires: Verifier**


## **DELETE /situs/:id**

- Permanently deletes a site  
- **Requires: Administrator**

# 3. Master Data (`/api/kerajaan`)

Applies similarly to `/api/alamat`, `/api/tokoh`, `/api/arkeolog`, etc.



## **GET /kerajaan**

- Returns all kingdoms  
- **Requires: Any authenticated user**


## **POST /kerajaan**

- Verifier adds new master data  
- **Requires: Verifier**

```json
{
    "nama_kerajaan": "Majapahit",
    "tahun_berdiri": 1293,
    "tahun_runtuh": 1527,
    "pusat_pemerintahan": "Trowulan",
    "deskripsi_singkat": "Kerajaan Hindu-Buddha terbesar di Nusantara."
}
```


## **PUT /kerajaan/:id**

- Edit kingdom  
- **Requires: Verifier**


## **DELETE /kerajaan/:id**

- Delete kingdom  
- **Requires: Administrator**


# 4. Many-to-Many Relations (`/api/relasi`)


## **POST /relasi/penelitian**

Links an archaeologist to a site.  
**Requires: Verifier**

```json
{
    "arkeolog_id": 1,
    "situs_id": 1
}
```


## **DELETE /relasi/penelitian**

Unlinks them.  
**Requires: Verifier**

```json
{
    "arkeolog_id": 1,
    "situs_id": 1
}
```


# 📁 Project Structure

```
proyek_arkeologi_backend/
├── middleware/
│   ├── auth.js
│   └── validation.js
├── node_modules/
├── routes/
│   ├── alamat.js
│   ├── arkeolog.js
│   ├── kerajaan.js
│   ├── objek_temuan.js
│   ├── pengguna.js
│   ├── relasi.js
│   ├── situs.js
│   └── tokoh.js
├── validators/
│   ├── alamat.validator.js
│   ├── ...other validators
│   └── shared.validator.js
├── .env
├── .gitignore
├── db.js
├── index.js
├── package.json
└── skema_lengkap.sql
```

