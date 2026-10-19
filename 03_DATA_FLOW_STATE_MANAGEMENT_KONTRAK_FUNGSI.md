# DOKUMEN 03: DATA FLOW, STATE MANAGEMENT & KONTRAK FUNGSI

## Proyek: ReSource --- B2B Resource Matching & Circular Value Platform

**Pilar SDG:** SDG 12 --- Responsible Consumption & Production\
**Basis dokumen:** `01_PRD_LENGKAP` + `02_DATABASE_SCHEMA_DAN_DATA`\
**Target implementasi:** MVP web app untuk sprint 4 jam vibecoding

------------------------------------------------------------------------

# 1. TUJUAN DOKUMEN

Dokumen ini mendefinisikan bagaimana data bergerak di dalam aplikasi
ReSource, bagaimana state dikelola pada frontend dan backend, serta
bagaimana fungsi/API harus berkomunikasi satu sama lain.

Dokumen ini menjadi jembatan antara:

``` text
PRODUCT REQUIREMENT
        â†“
DATABASE SCHEMA
        â†“
DATA FLOW
        â†“
STATE MANAGEMENT
        â†“
FUNCTION CONTRACT
        â†“
IMPLEMENTATION
```

Tujuan utamanya:

1.  Menentukan aliran data end-to-end.
2.  Menentukan source of truth untuk setiap jenis data.
3.  Menentukan state yang wajib dikelola oleh aplikasi.
4.  Menentukan perubahan state pada setiap user action.
5.  Menentukan kontrak fungsi agar module tidak saling bergantung secara
    berlebihan.
6.  Menjaga konsistensi antara frontend, backend, database, dan Matching
    Engine.
7.  Menghindari duplicate business logic.
8.  Menjaga implementasi tetap ringan untuk MVP 4 jam.
9.  Menyediakan struktur yang dapat dikembangkan setelah MVP.

Prinsip utama:

> **UI mengelola presentation state, server/database menjadi source of
> truth untuk business data, dan business logic dipusatkan pada
> service/use-case layer.**

------------------------------------------------------------------------

# 2. ARSITEKTUR DATA & STATE

## 2.1 Arsitektur yang digunakan

Untuk MVP ReSource, gunakan arsitektur sederhana berikut:

``` text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚            UI LAYER           â”‚
â”‚ Pages / Components / Forms    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚
                â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚        STATE / QUERY LAYER    â”‚
â”‚ Server State + UI State       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚
                â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚       SERVICE / USE CASE      â”‚
â”‚ Resource / Demand / Matching  â”‚
â”‚ Transaction / Dashboard       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚
                â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚           API LAYER           â”‚
â”‚ REST Endpoint / Validation    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                â”‚
                â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚       DATABASE / REPOSITORY   â”‚
â”‚ PostgreSQL                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

## 2.2 Prinsip tanggung jawab

``` text
UI
â†’ menerima input dan menampilkan state

State Layer
â†’ menyimpan state tampilan dan cache server

Use Case / Service
â†’ menjalankan business logic

API
â†’ menerima request, validasi, memanggil use case,
  dan mengembalikan response

Repository / Database
â†’ membaca dan menulis persistent data
```

UI tidak boleh menghitung Match Score.

UI tidak boleh mengubah metrik impact (`metrics`) secara langsung.

UI tidak boleh menentukan apakah sebuah listing boleh dikonfirmasi.

Semua keputusan business-critical harus dilakukan pada backend.

------------------------------------------------------------------------

# 3. SOURCE OF TRUTH

Source of truth harus jelas agar satu data tidak memiliki beberapa versi
yang berbeda.

  Data                Source of Truth                  Cache / Derived State
  ------------------- -------------------------------- -------------------------------
  Business            `businesses`                     UI cache
  User                `users` / auth context           session state
  Resource Category   `categories`                     query cache
  Resource Listing    `resources`                      resource list state
  Demand Request      `demands`                        requirement state
  Match               `matches`                        match result state
  Transaction         `transactions`                   transaction result state
  Impact              `transactions` (dihitung ulang)  dashboard state / `metrics`
  Match Score         `matches` setelah scoring        UI hanya membaca
  Transaction Value   `transactions`                   UI hanya membaca
  Platform Fee        `transactions`                   UI hanya membaca
  Loading             frontend state                   tidak disimpan database
  Modal Open/Close    frontend UI state                tidak disimpan database
  Form Input          local form state                 tidak disimpan sebelum submit

Prinsip:

> **Derived state boleh di-cache, tetapi tidak boleh menjadi pengganti
> source of truth.**

Contoh:

``` text
transactions
     â†“
calculateImpact()
     â†“
metrics
     â†“
dashboard
```

`metrics` adalah aggregate/cache yang dihitung dari `transactions`,
bukan sumber transaksi utama.

------------------------------------------------------------------------

# 4. PEMBAGIAN STATE

State ReSource dibagi menjadi empat kelompok:

``` text
1. Server State
2. UI State
3. Form State
4. Session State
```

## 4.1 Server State

Server state adalah data yang berasal dari backend/database.

Contoh:

``` text
resources
requirements
matches
transactions
dashboard
business
categories
```

Karakteristik:

-   persistent;
-   dapat berubah dari luar component;
-   membutuhkan request API;
-   dapat stale;
-   harus dapat di-refresh;
-   backend adalah source of truth.

------------------------------------------------------------------------

## 4.2 UI State

UI state hanya mengontrol tampilan.

Contoh:

``` text
activeTab
isCreateResourceModalOpen
selectedListingId
selectedMatchId
showConfirmDialog
expandedCardId
toastMessage
```

UI state tidak boleh disimpan ke database.

------------------------------------------------------------------------

## 4.3 Form State

Form state berisi input sementara sebelum dikirim.

Contoh resource form:

``` text
material
quantity
unit
pricePerUnit
availableFrom
availableUntil
notes
```

Contoh requirement form:

``` text
categoryId
quantityNeeded
maxPricePerUnit
neededFrom
neededUntil
notes
```

Form state akan berubah menjadi server state setelah request berhasil.

------------------------------------------------------------------------

## 4.4 Session State

Session state menyimpan konteks pengguna aktif.

Contoh:

``` text
currentUser
currentBusiness
role
isAuthenticated
```

Untuk MVP, authentication dapat menggunakan mock user sesuai Dokumen 02.

------------------------------------------------------------------------

# 5. STATE STRUCTURE MVP

Struktur state global yang direkomendasikan:

``` text
appState
â”‚
â”œâ”€â”€ session
â”‚   â”œâ”€â”€ currentUser
â”‚   â”œâ”€â”€ currentBusiness
â”‚   â””â”€â”€ isAuthenticated
â”‚
â”œâ”€â”€ resources
â”‚   â”œâ”€â”€ items
â”‚   â”œâ”€â”€ status
â”‚   â”œâ”€â”€ error
â”‚   â””â”€â”€ pagination
â”‚
â”œâ”€â”€ requirements
â”‚   â”œâ”€â”€ items
â”‚   â”œâ”€â”€ status
â”‚   â””â”€â”€ error
â”‚
â”œâ”€â”€ matching
â”‚   â”œâ”€â”€ requestId
â”‚   â”œâ”€â”€ candidates
â”‚   â”œâ”€â”€ recommended
â”‚   â”œâ”€â”€ status
â”‚   â””â”€â”€ error
â”‚
â”œâ”€â”€ transaction
â”‚   â”œâ”€â”€ current
â”‚   â”œâ”€â”€ status
â”‚   â””â”€â”€ error
â”‚
â”œâ”€â”€ dashboard
â”‚   â”œâ”€â”€ metrics
â”‚   â”œâ”€â”€ status
â”‚   â””â”€â”€ error
â”‚
â””â”€â”€ ui
    â”œâ”€â”€ activeView
    â”œâ”€â”€ modal
    â”œâ”€â”€ selectedId
    â””â”€â”€ toast
```

Tidak semua state harus dibuat global.

Gunakan prinsip:

> **State ditempatkan sedekat mungkin dengan consumer-nya.**

Jika hanya satu form membutuhkan data tertentu, gunakan local state.

------------------------------------------------------------------------

# 6. RESOURCE STATE

Resource state merepresentasikan katalog resource supplier.

## 6.1 Struktur

``` text
resources = {
    items: [],
    status: "idle",
    error: null
}
```

Status:

``` text
idle
loading
success
error
```

## 6.2 Lifecycle

``` text
IDLE
 â†“
LOADING
 â†“
SUCCESS
```

Jika gagal:

``` text
LOADING
 â†“
ERROR
```

Saat refresh:

``` text
SUCCESS
 â†“
LOADING
 â†“
SUCCESS
```

UI tidak boleh menganggap request berhasil hanya karena tombol submit
ditekan.

------------------------------------------------------------------------

# 7. RESOURCE CREATE FLOW

## 7.1 Data flow

``` text
Supplier
   â†“
Create Resource Form
   â†“
Form State
   â†“
Client Validation
   â†“
POST /resources
   â†“
API Validation
   â†“
Create Resource Use Case
   â†“
Resource Repository
   â†“
resources INSERT
   â†“
Response
   â†“
Update Resource Server State
   â†“
Catalog UI
```

## 7.2 Detail state transition

``` text
Form:
IDLE
 â†“
USER_INPUT
 â†“
VALIDATING
 â†“
SUBMITTING
 â†“
SUCCESS / ERROR
```

Setelah sukses:

``` text
Form Reset
+
Resource List Refresh
+
Success Toast
```

## 7.3 Aturan

Jika POST gagal:

``` text
resource list tidak berubah
form input tetap tersedia
error ditampilkan
```

Jangan melakukan optimistic insert untuk MVP karena resource baru harus
benar-benar diterima database sebelum ditampilkan sebagai source of
truth.

------------------------------------------------------------------------

# 8. RESOURCE LISTING FLOW

## 8.1 Request

``` text
GET /resources
```

## 8.2 Data flow

``` text
Resource Page
   â†“
Resource Query
   â†“
GET /resources
   â†“
Resource Service
   â†“
Repository
   â†“
resources
   +
business
   +
categories
   â†“
Response DTO
   â†“
Resource State
   â†“
Resource Cards
```

## 8.3 Data yang dikirim ke UI

Minimal:

``` text
id
material
quantityAvailable
unit
pricePerUnit
availableFrom
availableUntil
businessName
city
status
```

Jangan mengirim seluruh row database apabila field tidak digunakan UI.

------------------------------------------------------------------------

# 9. DEMAND REQUEST STATE

Demand request merupakan kebutuhan buyer.

Struktur:

``` text
requirements = {
    items: [],
    status: "idle",
    error: null
}
```

Lifecycle:

``` text
OPEN
 â†“
MATCHED
 â†“
CLOSED
```

Creation flow:

``` text
Buyer
 â†“
Requirement Form
 â†“
Form State
 â†“
Validation
 â†“
POST /requirements
 â†“
Create Demand Request
 â†“
demands INSERT
 â†“
Response
 â†“
Requirement State
```

------------------------------------------------------------------------

# 10. MATCHING STATE

Matching merupakan state paling penting dalam ReSource karena
menghubungkan demand dengan resource.

Struktur:

``` text
matching = {
    requestId: null,
    candidates: [],
    recommended: null,
    status: "idle",
    error: null
}
```

Status:

``` text
idle
loading
success
empty
error
```

## 10.1 Matching flow

``` text
Demand Request
      â†“
POST /match
      â†“
Load Requirement
      â†“
Filter Candidates
      â†“
Calculate Scores
      â†“
Calculate Value
      â†“
Select Best Match
      â†“
Persist Match
      â†“
Return Recommended Match
      â†“
Matching State
      â†“
Recommended Match UI
```

------------------------------------------------------------------------

# 11. MATCHING ENGINE DATA FLOW

## 11.1 Candidate filtering

Filter harus dilakukan sebelum scoring.

``` text
All Resource Listings
        â†“
category_id
        â†“
status = available
        â†“
quantity_available > 0
        â†“
availability compatible
        â†“
Candidate Set
```

Contoh:

``` text
100.000 listings
      â†“
category match
      â†“
1.200
      â†“
available
      â†“
450
      â†“
availability
      â†“
80 candidates
```

Matching engine hanya melakukan scoring terhadap candidate set.

------------------------------------------------------------------------

# 12. MATCH SCORE CONTRACT

Formula wajib mengikuti PRD dan Database Schema:

``` text
Match Score =
    40% Material Compatibility
  + 30% Quantity Compatibility
  + 20% Distance
  + 10% Availability
```

Kontrak fungsi:

``` text
calculateMatchScore(
    materialScore,
    quantityScore,
    distanceScore,
    availabilityScore
) â†’ number
```

Input:

``` text
materialScore: 0..100
quantityScore: 0..100
distanceScore: 0..100
availabilityScore: 0..100
```

Output:

``` text
number: 0..100
```

Contoh:

``` text
material = 100
quantity = 60
distance = 90
availability = 100

score =
100 Ã— 0.40
+ 60 Ã— 0.30
+ 90 Ã— 0.20
+ 100 Ã— 0.10

= 84
```

Tidak boleh ada implementasi UI yang membuat formula berbeda.

------------------------------------------------------------------------

# 13. MATERIAL SCORE CONTRACT

MVP:

``` text
same category      â†’ 100
different category â†’ 0
```

Kontrak:

``` text
calculateMaterialScore(
    listingCategoryId,
    requestCategoryId
) â†’ number
```

Aturan:

``` text
if category IDs equal:
    return 100
else:
    return 0
```

Future:

``` text
semantic similarity
material quality
processing compatibility
historical transaction data
```

Tidak termasuk MVP.

------------------------------------------------------------------------

# 14. QUANTITY SCORE CONTRACT

Tujuan quantity score adalah mengukur seberapa jauh resource dapat
memenuhi kebutuhan buyer.

Kontrak:

``` text
calculateQuantityScore(
    quantityAvailable,
    quantityNeeded
) â†’ number
```

Minimum behavior:

``` text
quantityAvailable >= quantityNeeded
    â†’ score = 100

quantityAvailable < quantityNeeded
    â†’ score proportional to coverage
```

Formula:

``` text
score = min((quantityAvailable / quantityNeeded) Ã— 100, 100)
```

Contoh:

``` text
500 kg available
300 kg needed

score = min(500 / 300 Ã— 100, 100)
      = min(166.6, 100)
      = 100

(stok lebih dari cukup â†’ score penuh)
```

Contoh partial coverage:

``` text
200 kg available
300 kg needed

score = min(200 / 300 Ã— 100, 100)
      = min(66.6, 100)
      = 66.6
```

Catatan:

> Formula wajib `min((resourceKg / demandKg) Ã— 100, 100)` â€” bukan
> `demandKg / resourceKg`. Ketika stok melebihi kebutuhan buyer,
> hasilnya dibatasi maksimal 100. Hasil harus berada pada range 0â€“100
> dan konsisten untuk input yang sama.

------------------------------------------------------------------------

# 15. DISTANCE SCORE CONTRACT

Kontrak:

``` text
calculateDistanceScore(
    distanceKm
) â†’ number
```

Input:

``` text
distanceKm >= 0
```

Output:

``` text
0..100
```

Jarak aktual dihitung berdasarkan koordinat jika tersedia.

Pada MVP, sistem dapat menggunakan estimasi jarak.

Jika koordinat tidak tersedia:

``` text
distanceKm = null
```

maka engine harus menggunakan fallback yang ditentukan service dan tidak
menghasilkan NaN atau nilai invalid.

------------------------------------------------------------------------

# 16. AVAILABILITY SCORE CONTRACT

Kontrak:

``` text
calculateAvailabilityScore(
    availableFrom,
    availableUntil,
    neededFrom,
    neededUntil
) â†’ number
```

Output:

``` text
0..100
```

Prinsip:

``` text
compatible availability
â†’ high score

partially compatible
â†’ lower score

not compatible
â†’ 0
```

Candidate yang benar-benar tidak tersedia sebaiknya sudah dibuang pada
tahap filtering.

------------------------------------------------------------------------

# 17. RECOMMENDED MATCH SELECTION

Untuk MVP, requirement utama adalah Recommended Match.

Kontrak:

``` text
findBestMatch(
    candidates
) â†’ MatchCandidate | null
```

Algoritma:

``` text
bestScore = -1
bestCandidate = null

for candidate in candidates:
    score = candidate.matchScore

    if score > bestScore:
        bestScore = score
        bestCandidate = candidate

return bestCandidate
```

Kompleksitas:

``` text
Time: O(K)
Memory: O(1)
```

Jika tidak ada candidate:

``` text
return null
```

UI harus menampilkan empty state, bukan error.

------------------------------------------------------------------------

# 18. MATCH RESULT CONTRACT

Response matching minimal:

``` text
{
    requestId,
    recommendedMatch,
    candidates,
    summary
}
```

Recommended match:

``` text
{
    matchId,
    listingId,
    requestId,
    materialScore,
    quantityScore,
    distanceScore,
    availabilityScore,
    matchScore,
    estimatedDistanceKm,
    estimatedTransactionValue,
    estimatedBuyerSaving,
    status
}
```

Summary:

``` text
{
    candidateCount,
    bestScore
}
```

------------------------------------------------------------------------

# 19. VALUE CALCULATION

Setelah match ditemukan, sistem menghitung nilai ekonomi.

## 19.1 Transaction value

``` text
transaction_value =
agreed_quantity Ã— agreed_unit_price
```

MVP estimation:

``` text
estimated_transaction_value =
requested / matched quantity Ã— price_per_unit
```

Nilai final tetap dihitung ketika transaction dibuat.

## 19.2 Buyer saving

``` text
estimated_buyer_saving =
reference_price - matched_price
```

Per unit atau total harus konsisten dengan API contract.

Jika tidak tersedia reference price:

``` text
estimated_buyer_saving = 0
```

Jangan membuat angka acak hanya untuk mengisi UI.

------------------------------------------------------------------------

# 20. TRANSACTION STATE

Struktur:

``` text
transaction = {
    current: null,
    status: "idle",
    error: null
}
```

Status database:

``` text
PENDING
COMPLETED
CANCELLED
```

Flow:

``` text
RECOMMENDED MATCH
       â†“
Buyer Selects
       â†“
Confirmation Dialog
       â†“
POST /matches/:id/confirm
       â†“
Validate
       â†“
BEGIN TRANSACTION
       â†“
Lock Listing
       â†“
Create Transaction
       â†“
Update Listing
       â†“
Update Request
       â†“
Update Impact Summary
       â†“
COMMIT
       â†“
Response
       â†“
Transaction State
       â†“
Impact Dashboard Refresh
```

------------------------------------------------------------------------

# 21. CONFIRM MATCH CONTRACT

Kontrak:

``` text
confirmMatch(
    matchId,
    agreedQuantity?,
    agreedUnitPrice?
) â†’ Transaction
```

Backend wajib melakukan:

``` text
1. Validate match
2. Load listing
3. Load request
4. Lock listing
5. Check quantity
6. Check status
7. Calculate transaction value
8. Calculate platform fee
9. Create transaction
10. Update listing
11. Update request
12. Update impact summary
13. Commit
```

Jika salah satu gagal:

``` text
ROLLBACK
```

Tidak boleh menghasilkan:

``` text
transaction = COMPLETED
listing = available
```

dalam kondisi yang seharusnya sudah berubah.

------------------------------------------------------------------------

# 22. DOUBLE BOOKING PROTECTION

Confirm match harus menggunakan database transaction dan row locking.

Konsep:

``` sql
SELECT *
FROM resources
WHERE id = $1
FOR UPDATE;
```

Flow:

``` text
Request A
    â†“
LOCK listing
    â†“
check quantity
    â†“
create transaction
    â†“
update listing
    â†“
COMMIT

Request B
    â†“
menunggu lock
    â†“
re-check quantity
    â†“
reject jika tidak cukup
```

Database adalah lapisan terakhir untuk menjaga konsistensi.

------------------------------------------------------------------------

# 23. IMPACT DASHBOARD STATE

Dashboard membutuhkan:

``` text
totalMatchedKg
totalTransactions
totalTransactionValue
totalPlatformRevenue
```

Source:

``` text
transactions
```

Untuk MVP, metrik dihitung ulang dari `transactions` setiap kali
diperlukan menggunakan `calculateImpact()`. Pada implementasi
PostgreSQL produksi, kalkulasi ini dapat dicache dalam tabel
`system_impact_summary` untuk performa, tetapi pada MVP localStorage
tidak ada tabel terpisah â€” `metrics` di `initialData` diperbarui
setelah setiap transaksi selesai.

Flow:

``` text
Transaction COMPLETED
        â†“
calculateImpact(transactions)
        â†“
Update metrics in storage
        â†“
GET /dashboard
        â†“
Dashboard State
        â†“
Impact Cards
```

Setelah confirm berhasil:

``` text
transaction success
        â†“
invalidate dashboard
        â†“
refetch dashboard
```

Jangan melakukan manual calculation di frontend jika server sudah
mengirim aggregate final.

------------------------------------------------------------------------

# 24. DASHBOARD STATE LIFECYCLE

``` text
IDLE
 â†“
LOADING
 â†“
SUCCESS
```

Error:

``` text
LOADING
 â†“
ERROR
```

Dashboard empty state:

``` text
SUCCESS
+
all metrics = 0
```

Ini bukan error.

UI dapat menampilkan:

``` text
0 kg matched
0 transactions
Rp0 transaction value
Rp0 platform revenue
```

------------------------------------------------------------------------

# 25. UI STATE CONTRACT

UI state bersifat lokal dan tidak masuk database.

## 25.1 Modal

``` text
isCreateResourceModalOpen: boolean
```

Contract:

``` text
openCreateResourceModal() â†’ void
closeCreateResourceModal() â†’ void
```

## 25.2 Selected resource

``` text
selectedListingId: number | null
```

Contract:

``` text
selectListing(id) â†’ void
clearSelectedListing() â†’ void
```

## 25.3 Confirmation dialog

``` text
isConfirmMatchOpen: boolean
selectedMatchId: number | null
```

------------------------------------------------------------------------

# 26. FORM STATE CONTRACT

## 26.1 Resource form

``` text
{
    categoryId,
    quantityAvailable,
    unit,
    pricePerUnit,
    availableFrom,
    availableUntil,
    notes
}
```

Validation:

``` text
categoryId required
quantityAvailable > 0
unit required
pricePerUnit >= 0
availableFrom required
availableUntil >= availableFrom
```

## 26.2 Requirement form

``` text
{
    categoryId,
    quantityNeeded,
    maxPricePerUnit,
    neededFrom,
    neededUntil,
    notes
}
```

Validation:

``` text
categoryId required
quantityNeeded > 0
maxPricePerUnit >= 0
neededFrom required
neededUntil >= neededFrom
```

------------------------------------------------------------------------

# 27. FORM VALIDATION FLOW

``` text
USER INPUT
    â†“
LOCAL VALIDATION
    â†“
invalid?
 â”Œâ”€â”€â”´â”€â”€â”
YES    NO
 â†“      â†“
SHOW   SUBMIT
ERROR    â†“
       API
```

Server validation tetap wajib.

Client validation hanya untuk UX.

Prinsip:

> **Client validation membantu user; server validation menjaga sistem.**

------------------------------------------------------------------------

# 28. API CONTRACT OVERVIEW

API MVP mengikuti Dokumen 02:

``` text
POST   /resources
GET    /resources
POST   /requirements
POST   /match
POST   /matches/:id/confirm
GET    /dashboard
```

Tambahan internal endpoint dapat dibuat bila diperlukan, tetapi enam
endpoint di atas adalah contract minimum untuk demo MVP.

------------------------------------------------------------------------

# 29. API --- CREATE RESOURCE

## Endpoint

``` text
POST /resources
```

## Request

``` json
{
  "businessId": 1,
  "categoryId": 1,
  "quantityAvailable": 500,
  "unit": "kg",
  "pricePerUnit": 500,
  "availableFrom": "2026-10-08T08:00:00",
  "availableUntil": null,
  "notes": "Serbuk kayu kering"
}
```

## Success

``` text
201 Created
```

``` json
{
  "data": {
    "id": 101,
    "status": "available"
  }
}
```

## Error

``` text
400 Validation Error
```

atau:

``` text
500 Internal Server Error
```

------------------------------------------------------------------------

# 30. API --- GET RESOURCES

## Endpoint

``` text
GET /resources
```

Optional query:

``` text
?categoryId=1
&status=available
&limit=50
```

Response:

``` json
{
  "data": [
    {
      "id": 101,
      "material": "Serbuk Kayu",
      "quantityAvailable": 500,
      "unit": "kg",
      "pricePerUnit": 500,
      "businessName": "Workshop Kayu",
      "city": "Sukoharjo",
      "status": "available"
    }
  ]
}
```

Server melakukan filtering.

Frontend tidak boleh mengambil seluruh database lalu melakukan filter
utama.

------------------------------------------------------------------------

# 31. API --- CREATE REQUIREMENT

## Endpoint

``` text
POST /requirements
```

Request:

``` json
{
  "businessId": 2,
  "categoryId": 1,
  "quantityNeeded": 300,
  "maxPricePerUnit": 450,
  "neededFrom": "2026-10-08T08:00:00",
  "neededUntil": null,
  "notes": "Untuk produksi papan olahan"
}
```

Success:

``` text
201 Created
```

Status awal:

``` text
OPEN
```

------------------------------------------------------------------------

# 32. API --- RUN MATCHING

## Endpoint

``` text
POST /match
```

Request:

``` json
{
  "requestId": 201
}
```

Flow:

``` text
requestId
 â†“
load demand request
 â†“
filter candidates
 â†“
calculate score
 â†“
calculate value
 â†“
find best match
 â†“
persist match
 â†“
return result
```

Success:

``` text
200 OK
```

Jika tidak ada candidate:

``` text
200 OK
```

dengan:

``` json
{
  "data": {
    "requestId": 201,
    "recommendedMatch": null,
    "candidates": [],
    "summary": {
      "candidateCount": 0,
      "bestScore": 0
    }
  }
}
```

Tidak adanya match bukan server error.

------------------------------------------------------------------------

# 33. API --- CONFIRM MATCH

## Endpoint

``` text
POST /matches/:id/confirm
```

Request:

``` json
{
  "agreedQuantity": 300,
  "agreedUnitPrice": 500
}
```

Success:

``` text
201 Created
```

Response:

``` json
{
  "data": {
    "transactionId": 301,
    "matchId": 101,
    "agreedQuantity": 300,
    "agreedUnitPrice": 500,
    "transactionValue": 150000,
    "platformFeeRate": 5,
    "platformFee": 7500,
    "status": "PENDING"
  }
}
```

------------------------------------------------------------------------

# 34. API --- DASHBOARD

## Endpoint

``` text
GET /dashboard
```

Response:

``` json
{
  "data": {
    "totalMatchedKg": 300,
    "totalTransactions": 1,
    "totalTransactionValue": 150000,
    "totalPlatformRevenue": 7500
  }
}
```

Dashboard tidak menghitung ulang angka tersebut di frontend.

------------------------------------------------------------------------

# 35. FUNCTION LAYERING

Function harus dibagi berdasarkan tanggung jawab.

``` text
Controller
   â†“
Use Case
   â†“
Service
   â†“
Repository
   â†“
Database
```

Contoh:

``` text
createResourceController()
        â†“
createResource()
        â†“
resourceRepository.create()
        â†“
INSERT resources
```

Controller tidak boleh berisi seluruh business logic.

------------------------------------------------------------------------

# 36. CONTROLLER CONTRACT

Controller bertanggung jawab untuk:

``` text
1. Read request
2. Parse input
3. Call use case
4. Map result
5. Return HTTP response
```

Controller tidak bertanggung jawab untuk:

``` text
- menghitung Match Score
- menghitung transaction value secara manual
- update dashboard secara langsung
- melakukan SQL kompleks jika repository layer tersedia
```

------------------------------------------------------------------------

# 37. RESOURCE SERVICE CONTRACT

``` text
createResource(input)
getResources(filters)
getResourceById(id)
```

### `createResource`

Input:

``` text
CreateResourceInput
```

Output:

``` text
Resource
```

Error:

``` text
ValidationError
CategoryNotFoundError
BusinessNotFoundError
```

### `getResources`

Input:

``` text
ResourceFilters
```

Output:

``` text
Resource[]
```

------------------------------------------------------------------------

# 38. REQUIREMENT SERVICE CONTRACT

``` text
createRequirement(input)
getRequirements(filters)
getRequirementById(id)
```

Input:

``` text
CreateRequirementInput
```

Output:

``` text
DemandRequest
```

Business rule:

``` text
new requirement status = OPEN
```

------------------------------------------------------------------------

# 39. MATCHING SERVICE CONTRACT

Core functions:

``` text
findCandidates(request)
calculateCandidateScore(candidate, request)
calculateMatchValue(candidate, request)
findBestMatch(candidates)
createMatches(request, candidates)
runMatching(requestId)
```

Dependency:

``` text
runMatching()
 â”œâ”€â”€ getRequirement()
 â”œâ”€â”€ findCandidates()
 â”œâ”€â”€ calculateCandidateScore()
 â”‚    â”œâ”€â”€ calculateMaterialScore()
 â”‚    â”œâ”€â”€ calculateQuantityScore()
 â”‚    â”œâ”€â”€ calculateDistanceScore()
 â”‚    â””â”€â”€ calculateAvailabilityScore()
 â”œâ”€â”€ calculateMatchValue()
 â”œâ”€â”€ findBestMatch()
 â””â”€â”€ saveMatch()
```

------------------------------------------------------------------------

# 40. MATCHING FUNCTION CONTRACT

## `findCandidates`

``` text
findCandidates(request)
â†’ CandidateListing[]
```

Rules:

``` text
category matches
status = available
quantity > 0
availability compatible
```

Complexity target:

``` text
O(log N + K)
```

------------------------------------------------------------------------

## `calculateCandidateScore`

``` text
calculateCandidateScore(
    listing,
    request
) â†’ MatchScoreBreakdown
```

Output:

``` text
{
    materialScore,
    quantityScore,
    distanceScore,
    availabilityScore,
    matchScore
}
```

------------------------------------------------------------------------

## `calculateMatchValue`

``` text
calculateMatchValue(
    listing,
    request
) â†’ MatchValue
```

Output:

``` text
{
    estimatedTransactionValue,
    estimatedBuyerSaving
}
```

------------------------------------------------------------------------

# 41. TRANSACTION SERVICE CONTRACT

Core:

``` text
confirmMatch(input)
createTransaction(input)
calculateTransactionValue(quantity, unitPrice)
calculatePlatformFee(transactionValue, feeRate)
```

`confirmMatch()` adalah orchestration function.

``` text
confirmMatch()
    â†“
validateMatch()
    â†“
lockListing()
    â†“
validateQuantity()
    â†“
createTransaction()
    â†“
updateListing()
    â†“
updateRequirement()
    â†“
updateImpactSummary()
```

Semua operasi database berada dalam satu transaction.

------------------------------------------------------------------------

# 42. DASHBOARD SERVICE CONTRACT

``` text
getDashboardSummary()
```

Output:

``` text
{
    totalMatchedKg,
    totalTransactions,
    totalTransactionValue,
    totalPlatformRevenue
}
```

Source:

``` text
calculateImpact(transactions)
```

Pada MVP, dashboard dihitung langsung dari `transactions` menggunakan
`calculateImpact()`. Fallback ini juga berlaku untuk recovery jika
cache tidak tersedia.

------------------------------------------------------------------------

# 43. REPOSITORY CONTRACT

Repository hanya menangani persistence.

## Resource Repository

``` text
create(data)
findMany(filters)
findById(id)
update(id, data)
```

## Requirement Repository

``` text
create(data)
findById(id)
findMany(filters)
update(id, data)
```

## Match Repository

``` text
create(data)
findById(id)
findByRequestId(requestId)
```

## Transaction Repository

``` text
create(data)
findById(id)
```

Repository tidak menghitung business score.

------------------------------------------------------------------------

# 44. ERROR CONTRACT

Error harus konsisten.

Format:

``` json
{
  "error": {
    "code": "RESOURCE_VALIDATION_ERROR",
    "message": "Quantity must be greater than 0",
    "field": "quantityAvailable"
  }
}
```

Kategori error:

``` text
VALIDATION_ERROR
NOT_FOUND
CONFLICT
BUSINESS_RULE_ERROR
MATCH_NOT_FOUND
INSUFFICIENT_QUANTITY
INVALID_STATUS
INTERNAL_ERROR
```

------------------------------------------------------------------------

# 45. ERROR MAPPING

  Condition                      Code                      HTTP
  ------------------------------ ----------------------- ------
  Invalid form                   VALIDATION_ERROR           400
  Resource not found             NOT_FOUND                  404
  Requirement not found          NOT_FOUND                  404
  Match not found                MATCH_NOT_FOUND            404
  Quantity insufficient          INSUFFICIENT_QUANTITY      409
  Listing already reserved       CONFLICT                   409
  Invalid lifecycle transition   INVALID_STATUS             409
  Unexpected backend error       INTERNAL_ERROR             500

------------------------------------------------------------------------

# 46. STATE VS ERROR

Error state tidak boleh mengubah business data.

Contoh:

``` text
POST /resources
      â†“
ERROR
```

Maka:

``` text
resources.items
```

tetap seperti sebelumnya.

Form dapat tetap menyimpan input user agar dapat diperbaiki.

------------------------------------------------------------------------

# 47. LOADING STRATEGY

Gunakan loading state per domain.

``` text
resources.status
matching.status
transaction.status
dashboard.status
```

Jangan menggunakan satu global:

``` text
isLoading = true
```

untuk seluruh aplikasi jika tidak diperlukan.

Contoh:

``` text
matching.loading
```

tidak boleh membuat:

``` text
dashboard
```

terlihat loading jika dashboard tidak sedang mengambil data.

------------------------------------------------------------------------

# 48. EMPTY STATE

Empty bukan error.

Resource:

``` text
Tidak ada resource tersedia.
```

Requirement:

``` text
Belum ada kebutuhan material.
```

Matching:

``` text
Belum ditemukan resource yang cocok.
```

Dashboard:

``` text
Belum ada transaksi.
```

Flow:

``` text
SUCCESS
+
items.length = 0
â†’ EMPTY UI
```

------------------------------------------------------------------------

# 49. STALE DATA STRATEGY

Server state dapat menjadi stale.

MVP strategy:

``` text
GET resources
     â†“
cache in memory
```

Setelah mutation:

``` text
POST resource
     â†“
invalidate resources
     â†“
GET resources
```

Setelah confirm match:

``` text
POST confirm
     â†“
invalidate:
    matching
    resources
    requirements
    dashboard
     â†“
refetch relevant data
```

Tujuannya menghindari UI menampilkan quantity/status lama.

------------------------------------------------------------------------

# 50. OPTIMISTIC VS PESSIMISTIC UPDATE

Untuk ReSource MVP:

``` text
Resource creation:
PESSIMISTIC

Requirement creation:
PESSIMISTIC

Matching:
PESSIMISTIC

Confirm transaction:
PESSIMISTIC
```

Alasan:

``` text
database menjadi source of truth
+
matching bersifat business-critical
+
quantity dapat berubah
+
double booking harus dicegah
```

Optimistic UI dapat digunakan hanya untuk interaksi visual non-critical
seperti:

``` text
modal open
tab switch
accordion
```

------------------------------------------------------------------------

# 51. COMPLETE RESOURCE FLOW

``` text
USER
 â†“
Create Resource
 â†“
Form State
 â†“
Validate
 â†“
POST /resources
 â†“
Controller
 â†“
CreateResource Use Case
 â†“
Resource Repository
 â†“
resources
 â†“
201 Response
 â†“
Invalidate Resource Query
 â†“
GET /resources
 â†“
Resource State = SUCCESS
 â†“
Catalog UI
```

------------------------------------------------------------------------

# 52. COMPLETE BUYER FLOW

``` text
USER
 â†“
Create Requirement
 â†“
Form State
 â†“
POST /requirements
 â†“
demands
 â†“
Requirement Created
 â†“
POST /match
 â†“
Matching Engine
 â†“
Candidate Filtering
 â†“
Score Calculation
 â†“
Best Match
 â†“
matches
 â†“
Recommended Match UI
 â†“
Buyer Confirm
 â†“
POST /matches/:id/confirm
 â†“
Transaction
 â†“
Impact Update
 â†“
Dashboard Refresh
```

------------------------------------------------------------------------

# 53. END-TO-END DEMO FLOW

Sesuai skenario PRD:

``` text
Workshop Furnitur
        â†“
Serbuk Kayu 500 kg
        â†“
Create Resource
        â†“
Resource Catalog
        â†“
Buyer membutuhkan 300 kg
        â†“
Create Requirement
        â†“
Matching Engine
        â†“
Material Match 100%
        â†“
Quantity Match 60%
        â†“
Distance
        â†“
Availability
        â†“
Match Score
        â†“
Recommended Match
        â†“
Estimated Value
        â†“
Confirm Match
        â†“
Transaction
        â†“
Impact +300 kg
        â†“
Dashboard
```

------------------------------------------------------------------------

# 54. DATA FLOW MAP

``` text
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚    USER     â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚     UI      â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ STATE LAYER â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚  USE CASE   â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚    API      â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ REPOSITORY  â”‚
                    â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
                           â†“
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚ PostgreSQL  â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Response:

``` text
PostgreSQL
    â†‘
Repository
    â†‘
API
    â†‘
Use Case
    â†‘
State Layer
    â†‘
UI
    â†‘
USER
```

------------------------------------------------------------------------

# 55. DOMAIN DEPENDENCY MAP

``` text
SESSION
   â†“
BUSINESS
   â†“
RESOURCE
   â†“
DEMAND
   â†“
MATCHING
   â†“
TRANSACTION
   â†“
IMPACT
```

Dependencies:

``` text
Resource â†’ Business + Category
Demand â†’ Business + Category
Match â†’ Resource + Demand
Transaction â†’ Match
Impact â†’ Transaction
```

Matching Engine membaca:

``` text
Resource
+
Demand
+
Business Location
```

Matching Engine tidak bergantung langsung pada UI.

------------------------------------------------------------------------

# 56. STATE TRANSITION MAP

## Resource

``` text
available
 â†“
reserved
 â†“
matched
```

atau:

``` text
available
 â†“
inactive
```

## Demand

``` text
OPEN
 â†“
MATCHED
 â†“
CLOSED
```

## Match

``` text
RECOMMENDED
 â†“
SELECTED
 â†“
TRANSACTION
```

atau:

``` text
RECOMMENDED
 â†“
REJECTED
```

## Transaction

``` text
PENDING
 â†“
COMPLETED
```

atau:

``` text
PENDING
 â†“
CANCELLED
```

------------------------------------------------------------------------

# 57. INVALID STATE TRANSITIONS

Backend harus menolak transition yang tidak valid.

Contoh:

``` text
matched â†’ available
```

tidak boleh dilakukan melalui confirm match.

``` text
fulfilled â†’ open
```

tidak boleh dilakukan tanpa business operation khusus.

``` text
completed â†’ pending
```

tidak boleh.

UI tidak menentukan valid/tidaknya transition.

Backend adalah authority.

------------------------------------------------------------------------

# 58. FUNCTION NAMING CONVENTION

Gunakan nama yang menggambarkan intent.

### Query

``` text
getResources()
getResourceById()
getRequirements()
getDashboardSummary()
```

### Mutation

``` text
createResource()
createRequirement()
confirmMatch()
```

### Calculation

``` text
calculateMatchScore()
calculateQuantityScore()
calculateDistanceScore()
calculateTransactionValue()
calculatePlatformFee()
```

### Selection

``` text
findCandidates()
findBestMatch()
```

Hindari:

``` text
doThing()
processData()
handleEverything()
calculateStuff()
```

------------------------------------------------------------------------

# 59. PURE FUNCTION RULE

Fungsi calculation sebaiknya pure.

Contoh:

``` text
calculateMatchScore(...)
```

Tidak boleh:

``` text
calculateMatchScore()
â†’ query database
â†’ update match
â†’ send response
```

Yang benar:

``` text
Repository
    â†“
Data
    â†“
Pure Calculation
    â†“
Result
```

Manfaat:

``` text
lebih mudah dites
lebih mudah dipahami
tidak memiliki side effect
lebih mudah di-debug
```

------------------------------------------------------------------------

# 60. SIDE EFFECT RULE

Side effect hanya dilakukan pada layer yang sesuai.

``` text
calculateMatchScore
â†’ NO side effect

findBestMatch
â†’ NO side effect

createResource
â†’ database write

confirmMatch
â†’ database transaction

updateImpactSummary
â†’ database write
```

Jangan membuat calculation function melakukan database mutation.

------------------------------------------------------------------------

# 61. CONTRACT TEST MATRIX

  Function                       Input               Output           Side Effect
  ------------------------------ ------------------- ---------------- ----------------
  `calculateMaterialScore`       category IDs        score            None
  `calculateQuantityScore`       quantities          score            None
  `calculateDistanceScore`       distance            score            None
  `calculateAvailabilityScore`   dates               score            None
  `calculateMatchScore`          4 scores            score            None
  `findBestMatch`                candidates          candidate/null   None
  `createResource`               resource input      resource         DB write
  `createRequirement`            requirement input   requirement      DB write
  `runMatching`                  request ID          match result     DB write
  `confirmMatch`                 match input         transaction      DB transaction
  `getDashboardSummary`          none                metrics          Read

------------------------------------------------------------------------

# 62. DATA VALIDATION MATRIX

  Data                        Client     Server   Database
  --------------------------- ---------- -------- ----------
  Quantity \> 0               Yes        Yes      CHECK
  Price \>= 0                 Yes        Yes      CHECK
  Category exists             Yes        Yes      FK
  Business exists             Optional   Yes      FK
  Status valid                No         Yes      CHECK
  Match Score 0--100          No         Yes      CHECK
  Transaction quantity \> 0   Yes        Yes      CHECK
  Platform fee \>= 0          No         Yes      CHECK

Prinsip:

``` text
Client
â†’ UX validation

Server
â†’ Business validation

Database
â†’ Integrity validation
```

------------------------------------------------------------------------

# 63. CONCURRENCY RULES

Operation yang membutuhkan protection:

``` text
confirm match
update listing quantity
reserve resource
create transaction
```

Gunakan:

``` text
database transaction
+
row locking
```

Tidak cukup hanya:

``` text
frontend button disabled
```

Karena dua client berbeda tetap dapat mengirim request bersamaan.

------------------------------------------------------------------------

# 64. IDEMPOTENCY CONSIDERATION

MVP dapat menggunakan protection sederhana pada confirm transaction.

Rule:

``` text
match yang sudah memiliki transaction
â†’ tidak boleh dibuat transaction kedua
```

Database:

``` text
transactions.match_id
UNIQUE
```

Jika request confirm dikirim dua kali:

``` text
first request
â†’ transaction created

second request
â†’ conflict
```

Hal ini sesuai schema Dokumen 02.

------------------------------------------------------------------------

# 65. CACHE INVALIDATION MATRIX

  Mutation             Resource   Requirement   Match     Transaction   Dashboard
  -------------------- ---------- ------------- --------- ------------- -----------
  Create Resource      Refresh    \-            \-        \-            \-
  Create Requirement   \-         Refresh       \-        \-            \-
  Run Match            \-         \-            Refresh   \-            \-
  Confirm Match        Refresh    Refresh       Refresh   Refresh       Refresh

Tidak semua data harus di-refetch jika UI tidak membutuhkannya, tetapi
domain yang berpotensi berubah harus dianggap stale.

------------------------------------------------------------------------

# 66. PERFORMANCE RULES

## Wajib

``` text
1. Filter sebelum scoring
2. Gunakan index
3. Hindari SELECT *
4. Hindari N+1
5. Gunakan LIMIT
6. Jangan load seluruh listing
7. TOP 1 gunakan streaming max
8. Dashboard gunakan summary counter
9. Gunakan database transaction
10. Hitung Match Score sekali saat matching
```

## Hindari

``` text
Frontend filter 100.000 records
Frontend calculate Match Score
Repeated API request tanpa alasan
Global loading untuk semua domain
Duplicate business logic
```

------------------------------------------------------------------------

# 67. MEMORY EFFICIENCY

Matching engine:

``` text
Candidate Set = K
```

Jika hanya mencari TOP 1:

``` text
Time = O(K)
Memory = O(1)
```

Jika TOP 10:

``` text
Time = O(K log 10)
Memory = O(10)
```

Frontend tidak boleh menerima dataset yang lebih besar dari kebutuhan
UI.

Gunakan:

``` text
LIMIT
pagination
field selection
```

------------------------------------------------------------------------

# 68. OBSERVABILITY MINIMUM

Untuk MVP, log minimal:

``` text
request ID
user/business ID
operation
duration
success/failure
error code
```

Contoh:

``` text
MATCH_REQUEST
requestId=201
candidateCount=80
bestScore=88
duration=42ms
status=SUCCESS
```

Jangan log:

``` text
password
password_hash
sensitive authentication data
```

------------------------------------------------------------------------

# 69. DEMO FAILURE HANDLING

Jika matching gagal:

``` text
Matching Engine Error
```

UI harus menyediakan:

``` text
Retry
```

Jika tidak ada match:

``` text
No compatible resource found
```

Jika confirm gagal karena quantity:

``` text
Resource is no longer available in the requested quantity.
```

UI kemudian:

``` text
Refresh Match
```

------------------------------------------------------------------------

# 70. MVP IMPLEMENTATION ORDER

Karena target implementasi adalah sprint 4 jam:

## P0

``` text
1. Database connection
2. Resource CRUD minimum
3. Requirement creation
4. Candidate query
5. Match Score
6. Recommended Match
7. Confirm Match
8. Dashboard
```

## P1

``` text
1. Better validation
2. Empty states
3. Error handling
4. Query cache
5. Loading states
```

## P2

``` text
1. Authentication
2. Verified business
3. Geolocation
4. Advanced matching
5. AI matching
6. Recurring procurement
```

------------------------------------------------------------------------

# 71. IMPLEMENTATION CHECKLIST

## Data Flow

``` text
[ ] Resource creation flow works
[ ] Requirement creation flow works
[ ] Matching flow works
[ ] Confirm flow works
[ ] Dashboard flow works
```

## State

``` text
[ ] Loading state
[ ] Success state
[ ] Error state
[ ] Empty state
[ ] Form state
[ ] Modal state
[ ] Server state
```

## Contract

``` text
[ ] API request schema
[ ] API response schema
[ ] Function input
[ ] Function output
[ ] Error contract
[ ] State transition
```

## Integrity

``` text
[ ] FK
[ ] CHECK constraints
[ ] Unique match transaction
[ ] Row locking
[ ] Database transaction
```

------------------------------------------------------------------------

# 72. FINAL ARCHITECTURE

Arsitektur final MVP:

``` text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  USER                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    UI                   â”‚
â”‚ Pages / Components / Forms / Modal     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚              STATE LAYER                â”‚
â”‚ Server State / Form / UI / Session     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚            USE CASE / SERVICE           â”‚
â”‚ Resource / Demand / Matching / Tx       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  API                    â”‚
â”‚ Validation / Auth / Response Mapping    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚               REPOSITORY                â”‚
â”‚ Queries / Persistence / Transactions    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚               PostgreSQL                â”‚
â”‚ Business / Resource / Demand / Match   â”‚
â”‚ Transaction / Impact                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

------------------------------------------------------------------------

# 73. CORE PRINCIPLE

ReSource harus mengikuti satu prinsip arsitektur:

``` text
UI
â†’ hanya mengatur tampilan dan input

STATE
â†’ mengatur data yang sedang digunakan UI

USE CASE
â†’ mengatur business flow

SERVICE
â†’ mengatur business rules

REPOSITORY
â†’ mengatur persistence

DATABASE
â†’ menjaga data integrity
```

Dan untuk matching:

``` text
FILTER
   â†“
CANDIDATE SET
   â†“
SCORE
   â†“
VALUE
   â†“
BEST MATCH
   â†“
PERSIST
```

Bukan:

``` text
LOAD EVERYTHING
   â†“
SEND TO FRONTEND
   â†“
FILTER IN UI
   â†“
CALCULATE IN UI
```

------------------------------------------------------------------------

# 74. KESIMPULAN

Data Flow, State Management, dan Function Contract ReSource dirancang
dengan tujuan menjaga keseimbangan antara:

``` text
Simplicity
     +
Consistency
     +
Performance
     +
Data Integrity
     +
Scalability
```

Core flow:

``` text
LIST
 â†“
SEARCH
 â†“
MATCH
 â†“
VALUE
 â†“
CONFIRM
 â†“
TRANSACTION
 â†“
IMPACT
```

Core state:

``` text
SERVER STATE
+
UI STATE
+
FORM STATE
+
SESSION STATE
```

Core architecture:

``` text
UI
 â†“
STATE
 â†“
USE CASE
 â†“
API
 â†“
REPOSITORY
 â†“
DATABASE
```

Core matching:

``` text
FILTER
 â†“
CANDIDATE
 â†“
SCORE
 â†“
BEST MATCH
```

Core transaction safety:

``` text
VALIDATE
 â†“
LOCK
 â†“
CREATE TRANSACTION
 â†“
UPDATE RESOURCE
 â†“
UPDATE REQUIREMENT
 â†“
UPDATE IMPACT
 â†“
COMMIT
```

Dengan struktur ini, implementasi MVP tetap sederhana untuk sprint 4
jam, tetapi business logic tidak tersebar di frontend dan database tetap
menjadi source of truth.

------------------------------------------------------------------------

## QUICK REFERENCE

### Core entities

``` text
businesses
categories
resources
demands
matches
transactions
metrics (MVP: dihitung dari transactions)
```

### Core state

``` text
session
resources
requirements
matching
transaction
dashboard
ui
```

### Core API

``` text
POST /resources
GET /resources
POST /requirements
POST /match
POST /matches/:id/confirm
GET /dashboard
```

### Core functions

``` text
createResource()
createRequirement()

findCandidates()
calculateMaterialScore()
calculateQuantityScore()
calculateDistanceScore()
calculateAvailabilityScore()
calculateMatchScore()
calculateMatchValue()
findBestMatch()
runMatching()

confirmMatch()
calculateTransactionValue()
calculatePlatformFee()

getDashboardSummary()
```

### Core optimization

``` text
Index
â†’ Filter
â†’ Candidate Set
â†’ Score
â†’ Best Match
```

### Core state rule

``` text
Server = Source of Truth
UI = Presentation State
Form = Temporary Input
Service = Business Logic
Database = Integrity Authority
```

### Target MVP

``` text
1 Resource
â†“
1 Buyer Need
â†“
1 Recommended Match
â†“
1 Transaction
â†“
1 Impact Result
```
