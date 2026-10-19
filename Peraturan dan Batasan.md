# 📜 PERATURAN & TATA TERTIB TIM (TEAM WORKING AGREEMENTS)
## Proyek: ReSource — B2B Resource Matching & Circular Value Platform

---

## 🎯 PRINSIP UTAMA COLLABORATION & VIBECODING

1. **Satu Sumber Kebenaran (Single Source of Truth):**
   * Spesifikasi produk, kontrak API, dan skema database yang sudah disepakati di folder `docs/` adalah **HUKUM UTAMA**.
   * Dilarang mengubah nama kolom database, format JSON API, atau bobot formula secara sepihak.

2. **Isolasi Folder Kerja (Strict File Boundaries):**
   * **Role 1 (Backend Developer):** Hanya bekerja di folder `/backend` (atau `/server`).
   * **Role 2 (Frontend Developer):** Hanya bekerja di folder `/frontend` (atau `/client`).
   * **Role 3 (Integrator & Lead):** Mengelola root, folder `docs/`, dan melakukan integrasi/merge.
   * *Pelanggaran batas folder ini adalah penyebab utama Merge Conflict!*

3. **Backend Adalah Otoritas Keputusan Bisnis:**
   * Frontend **DILARANG** menghitung ulang *Match Score*, mengalkulasi *Platform Fee*, atau menentukan validitas transaksi.
   * Frontend hanya menampilkan data dari response API server.

---

## 🔀 PERATURAN GITHUB & BRANCHING STRATEGY

### A. Aturan Branch
* **`main`**: Terkunci (Locked). Hanya Role 3 (Integrator) yang boleh melakukan *merge* ke branch `main`.
* **`feature/backend-core`**: Branch kerja Role 1.
* **`feature/frontend-ui`**: Branch kerja Role 2.
* **DILARANG** melakukan `git push` langsung ke `main`.

### B. Konvensi Pesan Commit (Commit Message Rules)
Setiap commit harus jelas tujuannya menggunakan konvensi baku:
* `feat(backend): tambah endpoint POST /match`
* `feat(frontend): buat komponen MatchBreakdown`
* `fix(backend): perbaiki kalkulasi quantity score`
* `fix(frontend): perbaiki bug input form requirement`
* `docs: update panduan integrasi`

### C. Alur Kerja Git Harian (Git Workflow)
1. **Sebelum Mulai Coding:**
   Selalu jalankan `git pull origin main` untuk memastikan kode lokal kamu mendapatkan pembaruan terbaru.
2. **Setiap Selesai 1 Sub-Fitur:**
   Langsung commit dan push ke branch peran masing-masing agar progress tidak hilang.
3. **Saat Terjadi Merge Conflict:**
   * **JANGAN PANIK.**
   * Segera panggil **Role 3 (Team Leader/Integrator)**.
   * Gunakan AI Agent (Cursor/Copilot) untuk meninjau konflik berdasarkan file panduan di `docs/`.

---

## 🤖 ATURAN PENGGUNAAN AI CODING AGENT (VIBECODING RULES)

1. **Umpankan Context Terlebih Dahulu:**
   * Sebelum menyuruh AI menulis kode, pastikan AI membaca file panduan terkait di folder `docs/` (misalnya: `02_DATABASE_SCHEMA.md`, `03_DATA_FLOW_API.md`, atau `ROLE_X_...md`).
2. **Jangan Minta AI Mengubah Kontrak:**
   * Jika AI menyarankan untuk merestrukturisasi skema database atau mengubah format payload API, **TOLAK**. Perintahkan AI untuk menyesuaikan dengan kontrak yang sudah ada di dokumen.
3. **Prinsip File-by-File:**
   * Perintahkan AI untuk menyelesaikan kode secara bertahap (satu file/modul dalam satu waktu), bukan sekaligus membuat seluruh aplikasi dalam satu prompt.

---

## 🚨 PENANGANAN SKENARIO DARURAT & JADWAL HACKATHON

### A. Komunikasi Konflik/Kebutuhan Perubahan API
* Jika Frontend (Role 2) membutuhkan field tambahan dari Backend (Role 1):
  1. Diskusi terbuka maksimal **3 menit** bersama Role 3.
  2. Jika disetujui, Role 1 memperbarui backend & dokumen API.
  3. Role 2 melanjutkan integrasi.

### B. Batas Waktu Kritis (Hard Deadlines)
* **Jam 02.50:** *Code Freeze* untuk fitur baru. Semua anggota stop membuat fitur baru dan fokus merapikan kode.
* **Jam 03.00:** *First Integration Merge* oleh Role 3.
* **Jam 03.30:** *Golden Path Testing* (Pengujian alur demo dari awal hingga akhir).
* **Jam 03.45:** *Final Polish* & Persiapan Presentasi Pitching.

---

## ✅ CHECKLIST SEBELUM SETIAP PUSH / MERGE

* [ ] Kode bisa dijalankan tanpa error di lingkungan lokal (`npm run dev` / `node server.js`).
* [ ] Tidak ada file sampah / log kredensial rahasia yang ikut ter-push (`.env` harus ada di `.gitignore`).
* [ ] Tidak menimpa file di luar folder tanggung jawab peran masing-masing.
* [ ] Alur *Golden Path* (List → Match → Value → Confirm → Impact) tetap berjalan lancar.