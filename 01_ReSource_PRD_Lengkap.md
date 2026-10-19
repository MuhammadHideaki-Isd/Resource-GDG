# DOKUMEN 01: PRODUCT REQUIREMENT DOCUMENT (PRD) LENGKAP
## Proyek: ReSource — B2B Resource Matching & Circular Value Platform
**Pilar SDG:** **SDG 12** *(Responsible Consumption & Production)*

---

## 1. PENDAHULUAN & LATAR BELAKANG

* **Masalah Riil / Hipotesis Masalah:** Banyak usaha kecil dan menengah menghasilkan *by-product* atau material sisa dalam jumlah kecil dan tersebar. Material tersebut belum tentu tidak bernilai, tetapi sering sulit dipasarkan karena supplier dan calon buyer tidak mengetahui keberadaan, jumlah, kualitas, waktu ketersediaan, atau lokasi satu sama lain.
* **Solusi ReSource:** Platform web B2B yang mempertemukan bisnis yang memiliki *unused resource* dengan bisnis lain yang membutuhkan material tersebut sebagai bahan baku, menggunakan pencocokan berdasarkan jenis material, jumlah, lokasi, dan ketersediaan.
* **Nilai Utama Produk:** ReSource tidak diposisikan sebagai marketplace limbah biasa. Produk berfokus pada **menemukan nilai ekonomi dari resource yang sebelumnya sulit dimonetisasi atau sulit ditemukan oleh buyer**.
* **Visi Produk:** Membangun jaringan pertukaran resource lokal yang membuat material sisa dapat kembali masuk ke rantai nilai ekonomi secara lebih efisien.

---

## 2. USER PERSONA & USER STORIES

### 2.1 Persona

1. **Persona A (Resource Provider — Pemilik Usaha):**
   * *Nama:* Pak Dimas (42 tahun, Pemilik Workshop Furnitur Kecil)
   * *Karakteristik:* Menghasilkan serbuk kayu dan potongan kayu secara rutin. Sebagian material disimpan atau dijual secara tidak konsisten karena tidak selalu mengetahui siapa yang membutuhkan dalam jumlah kecil.

2. **Persona B (Resource Buyer — Pemilik Usaha):**
   * *Nama:* Rina (31 tahun, Pemilik UMKM Produk Ramah Lingkungan)
   * *Karakteristik:* Membutuhkan bahan baku alternatif secara berkala. Ia harus mencari supplier satu per satu dan kesulitan membandingkan lokasi, jumlah, serta ketersediaan material.

### 2.2 User Stories & Acceptance Criteria

| ID | User Story | Acceptance Criteria (Kriteria Sukses Fitur) |
| :--- | :--- | :--- |
| **US-01** | *Sebagai penyedia resource, saya ingin memasukkan material yang tersedia agar bisnis lain dapat menemukannya.* | • Form berisi nama material, kategori, jumlah, lokasi, tanggal tersedia, dan harga indikatif.<br>• Data baru langsung muncul pada katalog resource tanpa reload halaman. |
| **US-02** | *Sebagai buyer, saya ingin mencari resource berdasarkan kebutuhan saya.* | • Buyer dapat memilih material dan memasukkan jumlah kebutuhan.<br>• Sistem menampilkan resource yang kompatibel berdasarkan material dan jumlah. |
| **US-03** | *Sebagai buyer, saya ingin mengetahui resource mana yang paling cocok bagi saya.* | • Setiap hasil memiliki **Match Score** berdasarkan kompatibilitas material, kecukupan jumlah, jarak, dan ketersediaan.<br>• Hasil terbaik ditampilkan sebagai **Recommended Match**. |
| **US-04** | *Sebagai buyer dan supplier, saya ingin mengetahui nilai ekonomi dari sebuah match.* | • Setelah match dipilih, sistem menampilkan estimasi nilai transaksi, potensi pendapatan supplier, dan estimasi penghematan buyer. |
| **US-05** | *Sebagai pengguna, saya ingin melihat dampak resource yang berhasil dialihkan ke bisnis lain.* | • Dashboard menampilkan metrik seperti jumlah kilogram resource yang berhasil dimatch dan jumlah transaksi yang berhasil dibuat.<br>• Nilai impact diperbarui setelah match berhasil. |

---

## 3. RUANG LINGKUP FITUR: MVP (4 JAM) VS FUTURE ROADMAP

### A. FITUR MVP (WAJIB DIBUAT PADA HARI KE-1)

1. **Header & Navigation Bar:** Logo ReSource, navigasi sederhana, status jaringan/resource.
2. **Resource Listing Dashboard:** Kartu resource yang menampilkan material, jumlah, lokasi, waktu tersedia, dan harga indikatif.
3. **Create Resource Form:** Form cepat untuk supplier menambahkan resource baru ke dalam katalog.
4. **Smart Matching Engine:** Buyer memilih kebutuhan lalu sistem menghitung Match Score berdasarkan:
   * Material compatibility
   * Quantity compatibility
   * Distance
   * Availability
5. **Recommended Match Result:** Sistem menampilkan satu atau beberapa match terbaik beserta alasan rekomendasi.
6. **Value & Impact Dashboard:** Menampilkan estimasi nilai transaksi, supplier revenue, buyer saving, dan total resource yang berhasil dimatch.

### B. FITUR POST-MVP / FUTURE ROADMAP (BAHAN PRESENTASI PITCHING DAY 2)

* **Geolocation & Map Integration:** Menghitung radius dan jarak antar supplier dan buyer secara lebih akurat.
* **Verified Business Profiles:** Verifikasi identitas bisnis, jenis material, dan reputasi supplier/buyer.
* **Transaction & Payment:** Integrasi pembayaran dan status transaksi.
* **Smart Logistics:** Perkiraan biaya pickup/delivery dan rekomendasi pengiriman.
* **AI Matching Engine:** Meningkatkan rekomendasi dengan mempertimbangkan histori transaksi, kualitas material, frekuensi supply, dan pola demand.
* **Recurring Procurement:** Buyer dapat membuat kebutuhan rutin dan sistem mencari resource secara berkala.
* **Impact Report:** Laporan circular economy yang dapat digunakan bisnis untuk pelaporan keberlanjutan.

---

## 4. KRITERIA PENILAIAN JURI & FOKUS KUALITAS

1. **Relevansi Solusi SDG:** Produk harus jelas menunjukkan bagaimana resource yang sebelumnya kurang termanfaatkan dapat kembali masuk ke rantai produksi, sesuai dengan **SDG 12 — Responsible Consumption & Production**.
2. **Kreativitas & Alur Logika:** Keunggulan utama bukan sekadar katalog, tetapi mekanisme **List → Match → Value** yang membuat proses pencarian resource lebih terarah.
3. **Fungsionalitas & Bug-Free:** Alur utama wajib berjalan mulus saat demo:
   * Buat resource
   * Cari kebutuhan
   * Tampilkan match
   * Pilih recommendation
   * Tampilkan nilai dan impact
4. **UI/UX & Desain Visual:** Tampilan harus bersih, profesional, mudah dipahami dalam beberapa detik, dan tetap nyaman dilihat pada layar laptop maupun proyektor.
5. **Business Model:** ReSource harus menunjukkan bagaimana value yang tercipta dapat menghasilkan revenue, terutama melalui **transaction fee** pada transaksi yang berhasil dimatch. Fitur subscription/B2B analytics dapat menjadi tahap lanjutan.
6. **Demo Value:** Demo harus menggunakan satu kasus konkret dan mudah dipahami, misalnya **workshop furnitur → material sisa kayu → UMKM pengguna bahan olahan**, sehingga juri dapat langsung melihat hubungan antara resource, matching, dan nilai ekonomi.
7. **Scalability:** Strategi awal berfokus pada satu wilayah dan kategori resource terlebih dahulu, kemudian memperluas jaringan supplier dan buyer setelah pola transaksi terbentuk.

---

## 5. CONTOH ALUR DEMO UTAMA

### Skenario: Workshop Furnitur → UMKM Produk Olahan Kayu

**Supplier**
* Material: Serbuk Kayu
* Quantity: 500 kg
* Location: Sukoharjo
* Available: 8 Oktober
* Indicative Value: Rp500/kg

**Buyer**
* Required Material: Serbuk Kayu
* Quantity Needed: 300 kg
* Location: Surakarta

### Hasil ReSource

**Recommended Match**
* Material Match: 100%
* Quantity Match: 60%
* Distance: 14 km
* Availability: Suitable
* Match Score: 88%

**Estimated Value**
* Potential Transaction: Rp150.000
* Supplier Revenue: Rp150.000
* Estimated Buyer Saving: Rp30.000

**Impact**
* Resource Matched: 300 kg
* Successful Matches: +1

> Catatan: angka di atas adalah **dummy data untuk demo**, bukan klaim harga pasar nyata.

---

## 6. CORE PRODUCT LOGIC

### Supplier Flow

`Create Listing → Input Resource → Publish → Resource Available`

### Buyer Flow

`Search Need → Match Engine → Recommended Resource → View Value → Confirm Match`

### Core Matching Formula

**Match Score =**

`40% Material Compatibility`
`+ 30% Quantity Compatibility`
`+ 20% Distance`
`+ 10% Availability`

Formula ini digunakan sebagai logika MVP yang sederhana dan transparan. Pada tahap lanjutan, bobot dapat dikembangkan berdasarkan data transaksi nyata.

---

## 7. BUSINESS MODEL

### A. Transaction Fee

ReSource mengambil biaya layanan dari transaksi yang berhasil.

Contoh demo:

`Nilai transaksi: Rp150.000`
`ReSource fee: 5%`
`Revenue ReSource: Rp7.500`

### B. Future B2B Subscription

Bisnis yang membutuhkan resource secara rutin dapat membayar subscription untuk:

* recurring procurement
* supplier analytics
* demand tracking
* historical matching
* impact reporting

### C. Growth Model

`One Region → One Resource Category → Initial Network → More Suppliers → More Buyers → More Transactions`

ReSource tidak mencoba melayani semua jenis limbah atau semua industri sejak awal. Fokus awal adalah membuktikan bahwa **supply dan demand yang tersebar dapat dipertemukan secara bernilai**.

---

## 8. MVP SUCCESS CRITERIA

Produk dianggap berhasil untuk sesi lomba apabila:

1. Supplier dapat membuat listing resource baru.
2. Buyer dapat memasukkan kebutuhan resource.
3. Sistem dapat menghasilkan Match Score.
4. Sistem dapat menampilkan Recommended Match.
5. Sistem dapat menghitung nilai ekonomi sederhana.
6. Dashboard impact berubah setelah match dilakukan.
7. Seluruh alur dapat didemokan tanpa error dalam satu sesi.

---

## 9. POSITIONING

### Bukan:

> "Marketplace limbah."

### ReSource adalah:

> **B2B resource matching platform yang membantu bisnis menemukan dan memonetisasi material yang sulit dimanfaatkan sendiri.**

### Tagline:

> **Turn Unused Resources Into Business Value.**

