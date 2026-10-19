# DOKUMEN 04: SPESIFIKASI KOMPONEN FRONTEND & UI WIREFRAME

## Proyek: ReSource — B2B Resource Matching & Circular Value Platform

**Pilar SDG:** SDG 12 — Responsible Consumption & Production  
**Basis dokumen:** `01_PRD_LENGKAP` + `02_DATABASE_SCHEMA_DAN_DATA` + `03_DATA_FLOW_STATE_MANAGEMENT_KONTRAK_FUNGSI`  
**Target implementasi:** MVP web app untuk sprint 4 jam vibecoding

---

# 1. TUJUAN DOKUMEN

Dokumen ini menerjemahkan PRD, database schema, dan data-flow ReSource menjadi spesifikasi frontend yang dapat langsung digunakan untuk implementasi.

Fokus dokumen:

1. Menentukan struktur halaman MVP.
2. Menentukan komponen UI utama.
3. Menentukan props/data yang diterima setiap komponen.
4. Menentukan state yang dimiliki komponen.
5. Menentukan action/event yang tersedia.
6. Menentukan hubungan komponen dengan API.
7. Menentukan responsive behavior.
8. Menentukan wireframe tekstual agar developer dan designer memiliki acuan yang sama.
9. Menjaga UI tetap ringan untuk target vibecoding 4 jam.

Prinsip utama:

> **Frontend bertanggung jawab terhadap presentation, interaction, form state, dan server-state consumption. Business-critical logic tetap berada di backend/service layer.**

Frontend **tidak boleh**:
- menghitung ulang Match Score;
- menentukan sendiri apakah match valid;
- mengubah metrik impact (`metrics`) secara langsung;
- membuat transaction tanpa API;
- menganggap tombol submit sebagai bukti bahwa data sudah tersimpan.

---

# 2. PRODUCT EXPERIENCE

Core experience ReSource:

```text
LIST
  ↓
SEARCH
  ↓
MATCH
  ↓
VALUE
  ↓
TRANSACTION
  ↓
IMPACT
```

Alur supplier:

```text
Open Resource Catalog
    ↓
Create Resource
    ↓
Fill Form
    ↓
Publish
    ↓
Resource appears in Catalog
```

Alur buyer:

```text
Open Matching
    ↓
Input Requirement
    ↓
Run Match
    ↓
Recommended Match
    ↓
View Score + Value
    ↓
Confirm Match
    ↓
Impact Updated
```

---

# 3. INFORMATION ARCHITECTURE

## 3.1 Struktur halaman MVP

```text
ReSource
│
├── Dashboard / Overview
│
├── Resources
│   ├── Resource Catalog
│   └── Create Resource
│
├── Matching
│   ├── Create Requirement
│   └── Match Result
│
└── Impact
    └── Value & Impact Dashboard
```

Untuk MVP 4 jam, navigasi dapat disederhanakan menjadi:

```text
Overview | Resources | Find Match | Impact
```

Header tetap menampilkan:
- Logo ReSource
- nama halaman/section
- status user/business
- navigation
- CTA kontekstual bila diperlukan

---

# 4. DESIGN DIRECTION

## 4.1 Karakter visual

UI harus:

- bersih;
- profesional;
- modern;
- mudah dipahami dalam beberapa detik;
- cocok untuk laptop dan proyektor;
- memiliki hierarchy yang jelas;
- tidak terasa seperti marketplace e-commerce umum;
- menonjolkan hubungan antara resource, match, dan business value.

## 4.2 Prinsip visual

```text
Clarity > Decoration
Information hierarchy > Density
Action visibility > Visual noise
Consistency > One-off styling
```

## 4.3 Tone

Gunakan tone:

```text
B2B
Practical
Trustworthy
Circular
Data-driven
Accessible
```

---

# 5. LAYOUT SYSTEM

## 5.1 Desktop

Rekomendasi:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo        Overview Resources Find Match Impact     User    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    Main Content Area                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Container:

```text
max-width: 1200–1280px
margin: auto
horizontal padding: 24px
```

Grid utama:

```text
12-column conceptual grid
```

Tidak perlu membuat sistem grid kompleks pada MVP. CSS Grid/Flexbox sederhana sudah cukup.

## 5.2 Mobile

```text
┌──────────────────────────┐
│ Logo              Menu   │
├──────────────────────────┤
│ Page Title               │
│                          │
│ Main Content             │
│                          │
│ Cards stack vertically   │
└──────────────────────────┘
```

Aturan:

- card menjadi satu kolom;
- form menjadi satu kolom;
- metric cards dapat menjadi 2 → 1 kolom;
- table kompleks dihindari pada MVP;
- navigation dapat berubah menjadi menu/drawer sederhana.

---

# 6. KOMPONEN FRONTEND

## 6.1 AppShell

### Tanggung jawab

Container utama aplikasi.

### Struktur

```text
<AppShell>
    <Header />
    <MainContent />
</AppShell>
```

### Props

```text
currentUser
currentBusiness
activeView
```

### Tidak bertanggung jawab atas

- fetching resource;
- matching;
- transaction;
- business logic.

---

# 7. HEADER

## Komponen

```text
Header
├── Logo
├── Navigation
├── Network/Resource Status
└── User Context
```

### Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ ReSource   Overview   Resources   Find Match   Impact   User │
└──────────────────────────────────────────────────────────────┘
```

### State

```text
activeView
mobileMenuOpen
```

### Event

```text
onNavigate(view)
onToggleMenu()
```

---

# 8. OVERVIEW / DASHBOARD

Halaman overview harus memperkenalkan value ReSource dengan cepat.

## Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ ReSource                                                     │
│ Turn Unused Resources Into Business Value                    │
│                                                              │
│ [ + Add Resource ]       [ Find a Match ]                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  RESOURCE MATCHED     TRANSACTIONS      TRANSACTION VALUE    │
│  300 kg               1                 Rp150.000            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ How ReSource Works                                           │
│                                                              │
│  LIST  →  MATCH  →  VALUE  →  IMPACT                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data

Dashboard mengambil:

```text
GET /dashboard
```

Minimal metrics:

```text
totalMatchedKg
totalTransactions
totalTransactionValue
totalPlatformRevenue
```

## State

```text
dashboard.status
dashboard.metrics
dashboard.error
```

## Empty state

Jika semua metrics = 0:

```text
No transactions yet.

Start by listing a resource or creating a requirement.
```

Ini adalah success state dengan nilai nol, bukan error.

---

# 9. RESOURCE CATALOG

## Tujuan

Menampilkan resource listing yang tersedia.

## Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Resources                                  [+ Add Resource]   │
│ Available materials from local businesses                   │
├──────────────────────────────────────────────────────────────┤
│ Search material...       Category ▼       Status ▼            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌────────────────────────┐  ┌────────────────────────┐       │
│ │ Serbuk Kayu            │  │ Sisa Kain              │       │
│ │ 500 kg                 │  │ 120 kg                 │       │
│ │ Sukoharjo              │  │ Surakarta              │       │
│ │ Rp500/kg               │  │ Rp8.000/kg             │       │
│ │ Available 8 Oct        │  │ Available 10 Oct       │       │
│ │ [View]                 │  │ [View]                 │       │
│ └────────────────────────┘  └────────────────────────┘       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Resource Card

Field minimal sesuai data-flow:

```text
id
material/category
quantityAvailable
unit
pricePerUnit
availableFrom
availableUntil
businessName
city
status
```

## Props

```text
listing
onView(listingId)
```

## State

```text
resources.items
resources.status
resources.error
pagination
```

## API

```text
GET /resources
```

Frontend hanya menerima field yang digunakan UI.

---

# 10. RESOURCE CARD

## Hierarchy

```text
Material Name
Quantity
Location
Availability
Price
Status
Action
```

## Wireframe

```text
┌───────────────────────────────┐
│ SERBUK KAYU         available │
│                               │
│ 500 kg                        │
│ Sukoharjo                     │
│ Available 15 Oct              │
│ Rp500 / kg                    │
│                               │
│ [ View Resource ]             │
└───────────────────────────────┘
```

Status (sesuai DDL `resources.status`):

```text
available
reserved
matched
inactive
```

---

# 11. CREATE RESOURCE MODAL / PAGE

Untuk MVP, modal atau side panel diperbolehkan. Form tidak boleh terlalu panjang.

## Wireframe

```text
┌─────────────────────────────────────────────┐
│ Add Resource                           [X]  │
├─────────────────────────────────────────────┤
│ Material Category                           │
│ [ Serbuk Kayu                         ▼ ]   │
│                                             │
│ Quantity                                    │
│ [ 500 ] [ kg ▼ ]                            │
│                                             │
│ Indicative Price                            │
│ [ Rp 500 / kg ]                             │
│                                             │
│ Available From                              │
│ [ 08 Oct 2026 ]                             │
│                                             │
│ Available Until                             │
│ [ Optional ]                                │
│                                             │
│ Notes                                       │
│ [.......................................]   │
│                                             │
│                    [Cancel] [Publish]       │
└─────────────────────────────────────────────┘
```

## Form state

```text
categoryId
quantity
unit
pricePerUnit
availableFrom
availableUntil
notes
```

## Lifecycle

```text
IDLE
 ↓
USER_INPUT
 ↓
VALIDATING
 ↓
SUBMITTING
 ↓
SUCCESS / ERROR
```

## API

```text
POST /resources
```

## Success

```text
close form
refresh resource list
show success toast
```

## Error

```text
keep user input
show validation/server error
do not modify resource list
```

---

# 12. FIND MATCH PAGE

Ini adalah halaman utama buyer.

## Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Find a Resource Match                                        │
│ Tell ReSource what your business needs.                      │
├──────────────────────────────────────────────────────────────┤
│ Requirement                                                  │
│                                                              │
│ Material                                                     │
│ [ Serbuk Kayu                                          ▼ ]   │
│                                                              │
│ Quantity Needed                                              │
│ [ 300 ] [ kg ▼ ]                                             │
│                                                              │
│ Maximum Price / Unit                                         │
│ [ Rp450 ]                                                    │
│                                                              │
│ Needed From                                                   │
│ [ 08 Oct 2026 ]                                             │
│                                                              │
│ Needed Until                                                  │
│ [ Optional ]                                                 │
│                                                              │
│ Notes                                                         │
│ [.........................................................]   │
│                                                              │
│                              [ Find Best Match ]              │
└──────────────────────────────────────────────────────────────┘
```

## Form state

```text
categoryId
quantityNeeded
maxPricePerUnit
neededFrom
neededUntil
notes
```

## Submit flow

```text
POST /requirements
        ↓
requirement created
        ↓
POST /match
        ↓
matching state = loading
        ↓
result
```

---

# 13. MATCH RESULT

## Tujuan

Menunjukkan mengapa sebuah resource direkomendasikan.

## Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Recommended Match                                            │
│ Best resource for your current requirement                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ SERBUK KAYU                              MATCH SCORE      │ │
│ │ Sukoharjo                               98%              │ │
│ │                                                          │ │
│ │ 500 kg available                       ~15 km            │ │
│ │ Rp500/kg                               Suitable          │ │
│ │                                                          │ │
│ │ Match Breakdown                                           │ │
│ │ Material       100%                                      │ │
│ │ Quantity       100%                                      │ │
│ │ Distance        90%                                      │ │
│ │ Availability   100%                                      │ │
│ │                                                          │ │
│ │ Estimated Transaction        Rp150.000                   │ │
│ │ Estimated Buyer Saving        Rp45.000                   │ │
│ │                                                          │ │
│ │                 [ Confirm Match ]                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data contract

```text
requestId
recommendedMatch
candidates
summary
```

Recommended match:

```text
matchId
listingId
requestId
materialScore
quantityScore
distanceScore
availabilityScore
matchScore
estimatedDistanceKm
estimatedTransactionValue
estimatedBuyerSaving
status
```

## Important

Frontend **hanya menampilkan** score.

Frontend tidak menjalankan:

```text
40% material
30% quantity
20% distance
10% availability
```

Formula tersebut merupakan business logic backend.

---

# 14. MATCH BREAKDOWN COMPONENT

Komponen ini menjelaskan recommendation secara transparan.

```text
Match Breakdown
────────────────────────
Material       100%
Quantity       100%
Distance        90%
Availability   100%
────────────────────────
Overall          98%
```

Gunakan progress bar sederhana.

Catatan quantity 100%: stok supplier (500 kg) ≥ kebutuhan buyer (300 kg),
sehingga `min(500/300×100, 100) = 100`. Score penuh karena stok mencukupi.

Props:

```text
materialScore
quantityScore
distanceScore
availabilityScore
matchScore
```

Tidak memiliki business calculation.

---

# 15. VALUE SUMMARY

Menunjukkan nilai ekonomi dari match.

```text
┌──────────────────────────────────────────┐
│ Estimated Value                          │
├──────────────────────────────────────────┤
│ Transaction Value       Rp150.000        │
│ Platform Fee (5%)         Rp7.500        │
│ Supplier Revenue        Rp142.500        │
│ Buyer Saving             Rp45.000        │
└──────────────────────────────────────────┘
```

Catatan:

- `Transaction Value` = qty × harga/kg = 300 × Rp500 = Rp150.000
- `Platform Fee` = Transaction Value × 5% = Rp7.500
- `Supplier Revenue` = Transaction Value − Platform Fee = Rp142.500
- `Buyer Saving` = (harga alternatif − harga resource) × qty = (Rp650 − Rp500) × 300 = Rp45.000

Nilai estimasi berasal dari backend.

Jangan membuat angka random pada frontend.

---

# 16. CONFIRM MATCH DIALOG

## Wireframe

```text
┌────────────────────────────────────────────┐
│ Confirm Match                              │
├────────────────────────────────────────────┤
│ You are about to confirm this resource.    │
│                                            │
│ Material        Serbuk Kayu                │
│ Quantity        300 kg                     │
│ Price           Rp500/kg                   │
│ Estimated Value Rp150.000                  │
│                                            │
│ This action will create a transaction.     │
│                                            │
│                  [Cancel] [Confirm Match]  │
└────────────────────────────────────────────┘
```

## State

```text
isConfirmMatchOpen
selectedMatchId
transaction.status
transaction.error
```

## API

```text
POST /matches/:id/confirm
```

## Setelah sukses

```text
transaction success
        ↓
close dialog
        ↓
refresh/invalidate resources
        ↓
refresh/invalidate matching
        ↓
refresh/invalidate dashboard
        ↓
success toast
```

---

# 17. IMPACT DASHBOARD

## Wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Value & Impact                                               │
│ Track the value created through resource matching.           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────────────┐ ┌──────────────┐ ┌────────────────────────┐ │
│ │ 300 kg       │ │ 1            │ │ Rp150.000              │ │
│ │ Matched      │ │ Transactions │ │ Transaction Value      │ │
│ └──────────────┘ └──────────────┘ └────────────────────────┘ │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ReSource Revenue                                         │ │
│ │ Rp7.500                                                   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ Every successful match keeps an unused resource in value     │
│ circulation.                                                │
└──────────────────────────────────────────────────────────────┘
```

Data source:

```text
GET /dashboard
```

Pada MVP localStorage, metrik dihitung langsung dari `transactions`
menggunakan `calculateImpact()`. Tidak ada tabel `system_impact_summary`
terpisah di DDL MVP — fungsi tersebut hanya relevan untuk PostgreSQL
produksi sebagai optimization cache.

---

# 18. TOAST & FEEDBACK

Toast hanya untuk feedback singkat.

Contoh:

```text
Resource published successfully.
```

```text
Match confirmed successfully.
```

```text
We couldn't create this resource. Please check the form.
```

State:

```text
toastMessage
```

Toast bukan source of truth.

---

# 19. LOADING STATES

Gunakan skeleton atau disabled state.

## Resource loading

```text
[████████████████]
[██████████]
[████████████]
```

## Matching loading

```text
Finding the best resource match...

[progress/skeleton]
```

Jangan menampilkan:

```text
Match Score = 88%
```

sebelum response backend diterima.

---

# 20. EMPTY STATES

## No resources

```text
No resources available yet.

Be the first business to list an unused resource.

[ Add Resource ]
```

## No match

```text
No compatible resource found.

Try changing the quantity, material, or required availability.
```

No match adalah:

```text
matching.status = empty
```

bukan system error.

## No transactions

```text
No transactions yet.

Create a requirement and find your first match.
```

---

# 21. ERROR STATES

Error harus membedakan:

```text
Validation Error
Network Error
Server Error
Empty Result
```

Contoh:

```text
Unable to load resources.

[ Try Again ]
```

Frontend tidak menampilkan technical stack trace kepada user.

---

# 22. RESPONSIVE RULES

## Desktop ≥ 1024px

```text
2–3 column card grid
horizontal navigation
wide match result
metric cards horizontal
```

## Tablet 768–1023px

```text
2 column cards
compressed navigation
form width reduced
```

## Mobile < 768px

```text
1 column
stacked cards
full-width CTA
collapsible navigation
```

Prioritas mobile:

```text
Material
Quantity
Match Score
Value
Primary Action
```

---

# 23. ACCESSIBILITY

Minimum MVP:

- semua form memiliki label;
- tombol memiliki text yang jelas;
- focus state terlihat;
- warna bukan satu-satunya indikator status;
- modal dapat ditutup dengan keyboard;
- input error berada dekat field terkait;
- heading memiliki hierarchy;
- contrast cukup untuk teks utama.

---

# 24. COMPONENT TREE

```text
App
└── AppShell
    ├── Header
    └── Router/View
        ├── OverviewPage
        │   ├── Hero
        │   ├── MetricCards
        │   └── HowItWorks
        │
        ├── ResourcesPage
        │   ├── PageHeader
        │   ├── ResourceFilters
        │   ├── ResourceGrid
        │   │   └── ResourceCard
        │   └── CreateResourceModal
        │
        ├── MatchingPage
        │   ├── RequirementForm
        │   ├── MatchLoading
        │   ├── RecommendedMatchCard
        │   ├── MatchBreakdown
        │   ├── ValueSummary
        │   └── ConfirmMatchDialog
        │
        └── ImpactPage
            ├── MetricCards
            └── ImpactSummary
```

---

# 25. STATE OWNERSHIP

Gunakan prinsip:

> **State ditempatkan sedekat mungkin dengan consumer-nya.**

## Global/server state

```text
session
resources
requirements
matching
transaction
dashboard
```

## Local UI state

```text
activeView
modal
selectedId
expandedCardId
toast
```

## Local form state

```text
resourceForm
requirementForm
```

Jangan membuat semua state menjadi global hanya karena menggunakan state manager.

---

# 26. API INTEGRATION MAP

| UI | API | Result |
|---|---|---|
| Resource Catalog | `GET /resources` | Resource cards |
| Create Resource | `POST /resources` | New listing |
| Requirement Form | `POST /requirements` | Requirement |
| Find Match | `POST /match` | Match result |
| Confirm Match | `POST /matches/:id/confirm` | Transaction |
| Impact Dashboard | `GET /dashboard` | Impact metrics |

Minimal API ini mengikuti rancangan database dan rekomendasi implementasi MVP.

---

# 27. DATA CONTRACT FRONTEND

Frontend DTO tidak perlu sama dengan full database row.

## Resource DTO

```text
{
  id,
  material,
  quantityAvailable,
  unit,
  pricePerUnit,
  availableFrom,
  availableUntil,
  businessName,
  city,
  status
}
```

## Match DTO

```text
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

## Dashboard DTO

```text
{
  totalMatchedKg,
  totalTransactions,
  totalTransactionValue,
  totalPlatformRevenue
}
```

---

# 28. FRONTEND VALIDATION

Client validation hanya untuk UX.

Contoh:

```text
quantity > 0
price >= 0
category required
availableFrom required
neededFrom required
```

Tetapi validasi final tetap:

```text
Client
  ↓
Server
  ↓
Database
```

Server/database adalah authority.

---

# 29. MVP PRIORITY MATRIX

## P0 — wajib

```text
AppShell
Header
Resource Catalog
Resource Card
Create Resource Form
Requirement Form
Recommended Match
Match Breakdown
Value Summary
Confirm Match Dialog
Impact Dashboard
Loading / Empty / Error states
```

## P1 — jika waktu cukup

```text
Filters
Pagination
Resource Detail
Candidate List
Recent Transactions
```

## P2 — post-MVP

```text
Map
Verified Badge
Advanced analytics
AI explanation
Logistics
Payment UI
Recurring procurement
Impact report
```

---

# 30. WIREFRAME DEMO END-TO-END

```text
[OVERVIEW]
    │
    ├── Add Resource
    │       ↓
    │   [CREATE RESOURCE]
    │       ↓
    │   POST /resources
    │       ↓
    │   [RESOURCE CATALOG]
    │
    └── Find Match
            ↓
       [REQUIREMENT FORM]
            ↓
       POST /requirements
            ↓
       POST /match
            ↓
       [RECOMMENDED MATCH]
            ↓
       [VALUE SUMMARY]
            ↓
       [CONFIRM DIALOG]
            ↓
       POST /matches/:id/confirm
            ↓
       [IMPACT DASHBOARD]
```

---

# 31. DEFINITION OF DONE — FRONTEND MVP

Frontend dianggap selesai jika:

1. User dapat membuka Resource Catalog.
2. User dapat membuat resource.
3. Resource baru muncul setelah API berhasil.
4. Buyer dapat membuat requirement.
5. Buyer dapat menjalankan matching.
6. Recommended Match tampil dari response backend.
7. Match Breakdown tampil tanpa menghitung ulang score.
8. Estimated Value tampil.
9. Buyer dapat membuka confirmation dialog.
10. Confirm Match membuat transaction melalui API.
11. Dashboard impact diperbarui setelah transaction berhasil.
12. Loading, empty, dan error state tersedia.
13. UI tetap usable pada laptop/proyektor.
14. Tidak ada business logic penting yang diduplikasi di frontend.

---

# 32. KESIMPULAN

Frontend ReSource harus memperjelas value proposition:

```text
Unused Resource
      ↓
Discoverable
      ↓
Matched
      ↓
Valued
      ↓
Transacted
      ↓
Impact Measured
```

UI bukan sekadar katalog. Komponen paling penting adalah:

```text
Resource Card
+
Requirement Form
+
Recommended Match
+
Match Breakdown
+
Value Summary
+
Impact Dashboard
```

Dengan struktur tersebut, frontend tetap sederhana untuk vibecoding 4 jam tetapi cukup kuat untuk mendemonstrasikan diferensiasi utama ReSource:

> **List → Match → Value → Impact**
