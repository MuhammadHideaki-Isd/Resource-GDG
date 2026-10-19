# 🛠️ Panduan Tugas Tech Spec: Role 1 — Backend & Database Developer
**Proyek:** ReSource — B2B Resource Matching Platform (SDG 12: Responsible Consumption & Production)  
**Role:** Anggota 1 (Backend & Database Developer)  
**Fokus Utama:** Database Schema & Migration, Data Dictionary, Smart Matching Engine Core, RESTful API Endpoints, Transaction Security (Row Locking), & Seed Data Setup.

---

## 📋 1. Ringkasan Peran & Tanggung Jawab
Sebagai Backend & Database Developer, Anda bertanggung jawab penuh untuk:
1. **Database Setup & Architecture:** Membangun dan mengelola database PostgreSQL/Supabase, mendefinisikan tipe Enum, tabel relational, relasi *Foreign Key*, constraint, serta mengunggah data *seed* awal.
2. **Data Dictionary Maintenance:** Mendokumentasikan tipe data, batasan (*constraints*), dan makna bisnis setiap kolom.
3. **Smart Matching Engine Logic:** Mengimplementasikan kalkulasi *Match Score* berbasis multi-kriteria 4 dimensi ($S_{\text{cat}}$, $S_{\text{qty}}$, $S_{\text{dist}}$, $S_{\text{avail}}$) dengan bobot $40:30:20:10$.
4. **API Development:** Membangun 6 REST API endpoints utama (`POST /resources`, `GET /resources`, `POST /requirements`, `POST /match`, `POST /matches/:id/confirm`, `GET /dashboard`).
5. **Data Integrity & Concurrency Control:** Mencegah masalah alokasi ganda (*double booking*) pada transaksi simultan menggunakan PostgreSQL *Row-Level Locking* (`FOR UPDATE`).

---

## 🗄️ 2. Skema Database PostgreSQL

Jalankan script SQL berikut pada PostgreSQL / Supabase SQL Editor untuk menyiapkan struktur database dasar:

```sql
-- Clean up existing objects
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS requirements CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS match_status CASCADE;
DROP TYPE IF EXISTS resource_status CASCADE;

-- Enums Definition
CREATE TYPE user_role AS ENUM ('PROVIDER', 'SEEKER', 'BOTH');
CREATE TYPE match_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED');
CREATE TYPE resource_status AS ENUM ('AVAILABLE', 'RESERVED', 'FULLY_UTILIZED');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'BOTH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resources Table (Suplai Limbah / Side-Stream Material)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    price_per_unit NUMERIC(12, 2) DEFAULT 0.00 CHECK (price_per_unit >= 0),
    waste_code VARCHAR(50),
    carbon_offset_factor NUMERIC(6, 3) DEFAULT 0.000, -- kg CO2e per unit
    status resource_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Requirements Table (Kebutuhan Material Seeker/Buyer)
CREATE TABLE requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seeker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    required_category VARCHAR(100) NOT NULL,
    min_quantity NUMERIC(10, 2) NOT NULL CHECK (min_quantity >= 0),
    max_price_per_unit NUMERIC(12, 2) CHECK (max_price_per_unit >= 0),
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Matches Table (Transaksi & Result Engine)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE RESTRICT,
    match_score NUMERIC(5, 2) CHECK (match_score >= 0 AND match_score <= 100),
    allocated_quantity NUMERIC(10, 2) NOT NULL CHECK (allocated_quantity > 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    carbon_saved_kg NUMERIC(10, 2) DEFAULT 0.00,
    status match_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📖 3. Kamus Data (Data Dictionary)

### A. Tabel `users`
| Nama Kolom | Tipe Data | Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Identifier unik pengguna |
| `company_name` | `VARCHAR(255)` | `NOT NULL` | Nama entitas bisnis / perusahaan |
| `industry` | `VARCHAR(100)` | `NOT NULL` | Sektor industri perusahan |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Email akun bisnis |
| `address` | `TEXT` | `NOT NULL` | Alamat lengkap perusahaan |
| `city` | `VARCHAR(100)` | `NOT NULL` | Kota lokasi operasional |
| `role` | `ENUM` | `DEFAULT 'BOTH'` | Peran pengguna (`PROVIDER`, `SEEKER`, `BOTH`) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT CURRENT_TIMESTAMP` | Waktu registrasi |

### B. Tabel `resources`
| Nama Kolom | Tipe Data | Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Identifier unik listing material |
| `provider_id` | `UUID` | `FK -> users(id)` | ID penyedia limbah |
| `title` | `VARCHAR(255)` | `NOT NULL` | Nama/Judul material |
| `category` | `VARCHAR(100)` | `NOT NULL` | Kategori jenis material |
| `quantity` | `NUMERIC(10,2)` | `CHECK (>= 0)` | Stok kuantitas material |
| `unit` | `VARCHAR(50)` | `NOT NULL` | Satuan ukur (`Kg`, `Ton`, `M3`) |
| `city` | `VARCHAR(100)` | `NOT NULL` | Kota lokasi penyimpanan limbah |
| `price_per_unit` | `NUMERIC(12,2)` | `CHECK (>= 0)` | Harga jual per unit (IDR) |
| `waste_code` | `VARCHAR(50)` | Optional | Kode klasifikasi limbah industri |
| `carbon_offset_factor`| `NUMERIC(6,3)` | Default `0.000` | Estimasi offset $kg\ CO_2e$ per unit |
| `status` | `ENUM` | `DEFAULT 'AVAILABLE'` | Status ketersediaan (`AVAILABLE`, `RESERVED`, `FULLY_UTILIZED`) |

### C. Tabel `requirements`
| Nama Kolom | Tipe Data | Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Identifier unik kebutuhan |
| `seeker_id` | `UUID` | `FK -> users(id)` | ID pembeli/pencari material |
| `required_category` | `VARCHAR(100)` | `NOT NULL` | Kategori material yang dicari |
| `min_quantity` | `NUMERIC(10,2)` | `CHECK (>= 0)` | Kebutuhan kuantitas minimum |
| `max_price_per_unit`| `NUMERIC(12,2)` | Optional | Batas maksimum harga beli per unit |
| `city` | `VARCHAR(100)` | `NOT NULL` | Kota lokasi tujuan pengiriman |

### D. Tabel `matches`
| Nama Kolom | Tipe Data | Constraint | Deskripsi |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY` | Identifier unik transaksi match |
| `resource_id` | `UUID` | `FK -> resources(id)` | Referensi ke material suplai |
| `requirement_id` | `UUID` | `FK -> requirements(id)`| Referensi ke kriteria kebutuhan |
| `match_score` | `NUMERIC(5,2)` | `CHECK (0 - 100)` | Skor persentase kesesuaian |
| `allocated_quantity`| `NUMERIC(10,2)` | `CHECK (> 0)` | Jumlah kuantitas yang ditransaksikan |
| `total_price` | `NUMERIC(12,2)` | `CHECK (>= 0)` | Total nilai finansial transaksi |
| `carbon_saved_kg` | `NUMERIC(10,2)` | Default `0.00` | Total emisi karbon yang berhasil di-offset |
| `status` | `ENUM` | `DEFAULT 'PENDING'` | Status alur transaksi (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`) |

---

## ⚙️ 4. Algoritma Smart Matching Engine (40% Material, 30% Quantity, 20% Distance, 10% Availability)

Algoritma mengkalkulasi tingkat kesesuaian (*Match Score*) antara permintaan kebutuhan (*Requirement*) dan penawaran material (*Resource*) menggunakan formulasi berikut:

$$\text{Match Score} = (S_{\text{mat}} \times 0.40) + (S_{\text{qty}} \times 0.30) + (S_{\text{dist}} \times 0.20) + (S_{\text{avail}} \times 0.10)$$

### Rincian Komponen Scoring:
1. **Material Category Match Score ($S_{\text{mat}}$) — Bobot 40%:**
   * $S_{\text{mat}} = 100$ jika `resource.category == requirement.required_category`.
   * $S_{\text{mat}} = 0$ jika kategori berbeda.

2. **Quantity Match Score ($S_{\text{qty}}$) — Bobot 30%:**
   * Jika `resource.quantity >= requirement.min_quantity`: $S_{\text{qty}} = 100$.
   * Jika `resource.quantity < requirement.min_quantity`: $S_{\text{qty}} = \left( \frac{\text{resource.quantity}}{\text{requirement.min_quantity}} \right) \times 100$.

3. **Distance Score ($S_{\text{dist}}$) — Bobot 20%:**
   * Jika `resource.city == requirement.city`: $S_{\text{dist}} = 100$ (Kota sama, misal Sukoharjo-Sukoharjo).
   * Jika beda kota tetapi masih dalam satu wilayah regional (misal Sukoharjo - Surakarta): $S_{\text{dist}} = 80$.
   * Jika wilayah berjarak jauh/beda provinsi: $S_{\text{dist}} = 40$.

4. **Availability Score ($S_{\text{avail}}$) — Bobot 10%:**
   * Jika `resource.status == 'AVAILABLE'`: $S_{\text{avail}} = 100$.
   * Jika `resource.status == 'RESERVED'`: $S_{\text{avail}} = 40$.
   * Jika `resource.status == 'FULLY_UTILIZED'`: $S_{\text{avail}} = 0$.

---

## 🔒 5. Transaksi Aman dengan Row Locking (`FOR UPDATE`)

Untuk mencegah fenomena *race condition* atau *double booking* saat dua pembeli mengonfirmasi transaksi pada stok yang sama secara bersamaan, eksekusi pada endpoint `POST /matches/:id/confirm` wajib dikemas dalam transaksi DB terisolasi:

```sql
BEGIN;

-- 1. Kunci baris resource terkait secara eksklusif
SELECT id, quantity, status 
FROM resources 
WHERE id = :resource_id 
FOR UPDATE;

-- 2. Periksa apakah stok mencukupi
-- Jika resources.quantity < matches.allocated_quantity -> ROLLBACK;

-- 3. Update status Match menjadi COMPLETED
UPDATE matches 
SET status = 'COMPLETED', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = :match_id;

-- 4. Potong stok kuantitas resource dan perbarui status jika habis
UPDATE resources 
SET quantity = quantity - :allocated_quantity,
    status = CASE 
                WHEN (quantity - :allocated_quantity) <= 0 THEN 'FULLY_UTILIZED'::resource_status 
                ELSE 'AVAILABLE'::resource_status 
             END
WHERE id = :resource_id;

COMMIT;
```

---

## 📡 6. Spesifikasi API Endpoints

### 1. `POST /api/v1/resources`
* **Deskripsi:** Mendaftarkan suplai limbah industri baru.
* **Request Body:**
  ```json
  {
    "provider_id": "11111111-1111-1111-1111-111111111111",
    "title": "Limbah Serbuk Kayu Jati Murni",
    "category": "Limbah Kayu & Briket",
    "quantity": 500,
    "unit": "Kg",
    "city": "Sukoharjo",
    "price_per_unit": 500,
    "waste_code": "B104-A",
    "carbon_offset_factor": 1.250
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "message": "Resource successfully listed",
    "data": {
      "id": "33333333-3333-3333-3333-333333333333",
      "status": "AVAILABLE"
    }
  }
  ```

---

### 2. `GET /api/v1/resources`
* **Deskripsi:** Mengambil daftar katalog limbah aktif.
* **Query Parameters:** `?category=Limbah Kayu & Briket&status=AVAILABLE`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "results": 1,
    "data": [
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "title": "Limbah Serbuk Kayu Jati Murni",
        "category": "Limbah Kayu & Briket",
        "quantity": 500.00,
        "unit": "Kg",
        "city": "Sukoharjo",
        "price_per_unit": 500.00,
        "waste_code": "B104-A",
        "carbon_offset_factor": 1.250,
        "status": "AVAILABLE"
      }
    ]
  }
  ```

---

### 3. `POST /api/v1/requirements`
* **Deskripsi:** Mendaftarkan profil kebutuhan pembeli/seeker.
* **Request Body:**
  ```json
  {
    "seeker_id": "22222222-2222-2222-2222-222222222222",
    "required_category": "Limbah Kayu & Briket",
    "min_quantity": 300,
    "max_price_per_unit": 600,
    "city": "Surakarta"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "data": {
      "id": "44444444-4444-4444-4444-444444444444"
    }
  }
  ```

---

### 4. `POST /api/v1/match`
* **Deskripsi:** Mengeksekusi Smart Matching Engine untuk menghasilkan skor rekomendasi terbaik.
* **Request Body:**
  ```json
  {
    "requirement_id": "44444444-4444-4444-4444-444444444444"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": [
      {
        "match_id": "55555555-5555-5555-5555-555555555555",
        "resource": {
          "id": "33333333-3333-3333-3333-333333333333",
          "title": "Limbah Serbuk Kayu Jati Murni",
          "provider_name": "Karya Kayu Workshop",
          "city": "Sukoharjo"
        },
        "scores": {
          "material_score": 100,
          "quantity_score": 100,
          "distance_score": 80,
          "availability_score": 100,
          "total_match_score": 96.00
        },
        "financial_and_impact": {
          "allocated_quantity": 300,
          "unit": "Kg",
          "price_per_unit": 500,
          "total_price": 150000,
          "carbon_saved_kg": 375.00
        }
      }
    ]
  }
  ```

---

### 5. `POST /api/v1/matches/:id/confirm`
* **Deskripsi:** Mengonfirmasi transaksi match dengan aman (memotong stok via *Row Locking*).
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Match transaction confirmed and inventory updated successfully",
    "data": {
      "match_id": "55555555-5555-5555-5555-555555555555",
      "status": "COMPLETED",
      "remaining_resource_quantity": 200.00
    }
  }
  ```

---

### 6. `GET /api/v1/dashboard/impact`
* **Deskripsi:** Agregasi statistik keberlanjutan real-time untuk Impact Dashboard.
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "data": {
      "total_waste_diverted_kg": 300.00,
      "total_carbon_offset_kg": 375.00,
      "total_economic_value_idr": 150000.00,
      "completed_matches_count": 1
    }
  }
  ```

---

## 🌱 7. Seed Data Skenario Demo (Sukoharjo - Surakarta)

Jalankan query SQL berikut untuk mengisi data simulasi demo utama (*Golden Path*):

```sql
-- 1. Insert Users (Provider & Seeker)
INSERT INTO users (id, company_name, industry, email, address, city, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Karya Kayu Workshop', 'Mebel & Kayu', 'provider@karyakayu.com', 'Jl. Raya Ngater, Sukoharjo', 'Sukoharjo', 'PROVIDER'),
('22222222-2222-2222-2222-222222222222', 'EcoForm Studio', 'Manufaktur Bahan Bangunan', 'seeker@ecoform.com', 'Jl. Slamet Riyadi, Surakarta', 'Surakarta', 'SEEKER');

-- 2. Insert Supply Resource (Serbuk Kayu Jati)
INSERT INTO resources (id, provider_id, title, category, quantity, unit, city, price_per_unit, waste_code, carbon_offset_factor, status) VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Limbah Serbuk Kayu Jati Murni', 'Limbah Kayu & Briket', 500.00, 'Kg', 'Sukoharjo', 500.00, 'B104-A', 1.250, 'AVAILABLE');

-- 3. Insert Requirement (Demand dari Seeker)
INSERT INTO requirements (id, seeker_id, required_category, min_quantity, max_price_per_unit, city) VALUES
('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Limbah Kayu & Briket', 300.00, 600.00, 'Surakarta');
```

---

## 📌 8. Checklist Tugas Eksekusi (Backend Developer)
* [ ] **Tugas 1:** Menjalankan DDL Script PostgreSQL (Enums, Tables, Constraints).
* [ ] **Tugas 2:** Memasukkan Seed Data skenario Sukoharjo–Surakarta.
* [ ] **Tugas 3:** Mengimplementasikan fungsi pembantu kalkulasi Smart Matching Engine ($40:30:20:10$).
* [ ] **Tugas 4:** Membangun endpoint CRUD dasar (`POST /resources`, `GET /resources`, `POST /requirements`).
* [ ] **Tugas 5:** Membangun endpoint matching (`POST /match`).
* [ ] **Tugas 6:** Membangun endpoint konfirmasi transaksi (`POST /matches/:id/confirm`) lengkap dengan transaksi `BEGIN...COMMIT` dan `FOR UPDATE`.
* [ ] **Tugas 7:** Membangun endpoint agregasi statistik (`GET /dashboard/impact`).
* [ ] **Tugas 8:** Pengujian terintegrasi menggunakan Postman/REST Client sebelum diserahkan ke Role 3.
```

***

The technical Markdown specification file for **Role 1 (Backend & Database Developer)** has been generated above. It contains all code blocks, SQL scripts, API JSON specifications, and mathematical formulas formatted in LaTeX notation (`$`).