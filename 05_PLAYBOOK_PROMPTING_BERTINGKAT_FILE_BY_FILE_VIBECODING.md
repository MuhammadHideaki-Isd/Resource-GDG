# DOKUMEN 05: PLAYBOOK PROMPTING BERTINGKAT (FILE-BY-FILE VIBECODING)

## Proyek: ReSource — B2B Resource Matching & Circular Value Platform

**Pilar SDG:** SDG 12 — Responsible Consumption & Production  
**Basis dokumen:** `01_PRD_LENGKAP` + `02_DATABASE_SCHEMA_DAN_DATA` + `03_DATA_FLOW_STATE_MANAGEMENT_KONTRAK_FUNGSI` + `04_SPESIFIKASI_KOMPONEN_FRONTEND_UI_WIREFRAME`  
**Target:** Implementasi MVP web app melalui vibecoding dengan kontrol scope ketat.

---

# 1. TUJUAN PLAYBOOK

Dokumen ini menjadi panduan prompting bertingkat agar AI coding agent membangun ReSource secara:

- file-by-file;
- dependency-aware;
- contract-first;
- mudah diuji;
- mudah diperbaiki;
- tidak menghasilkan overengineering;
- tetap sesuai PRD;
- tetap sesuai database dan data-flow;
- dapat selesai untuk MVP 4 jam.

Prinsip:

> **Jangan meminta AI membangun seluruh aplikasi dalam satu prompt. Bangun kontrak dan dependency secara bertahap.**

---

# 2. ATURAN BESAR VIBECODING

## Rule 1 — Satu prompt, satu outcome

Hindari:

```text
"Build the whole ReSource app."
```

Gunakan:

```text
"Create the resource listing repository and GET /resources endpoint
according to the existing database contract."
```

## Rule 2 — Jangan mengarang contract

AI harus mengikuti:

```text
PRD
↓
Database Schema
↓
Data Flow
↓
Frontend Contract
```

Jika informasi tidak tersedia:

```text
STOP
ASK
```

bukan:

```text
INVENT
```

## Rule 3 — Jangan mengubah business logic

Formula:

```text
40% material
30% quantity
20% distance
10% availability
```

harus tetap sama.

## Rule 4 — Backend adalah source of truth

Frontend tidak boleh:

```text
calculateMatchScore()
calculateTransactionValue()
updateImpactSummary()
```

sebagai business decision.

## Rule 5 — Minimal viable architecture

Target:

```text
Frontend
    ↓
Backend API
    ↓
PostgreSQL
```

Hindari service tambahan yang tidak dibutuhkan MVP.

---

# 3. CONTEXT PACK YANG WAJIB DIBERIKAN KE AI

Sebelum coding, AI agent harus memiliki context berikut:

```text
01_PRD_LENGKAP.md
02_DATABASE_SCHEMA_DAN_DATA.md
03_DATA_FLOW_STATE_MANAGEMENT_KONTRAK_FUNGSI.md
04_SPESIFIKASI_KOMPONEN_FRONTEND_UI_WIREFRAME.md
```

Urutan membaca:

```text
01 → product intent
02 → data structure
03 → runtime/data contracts
04 → UI implementation
```

---

# 4. GLOBAL SYSTEM PROMPT UNTUK CODING AGENT

Gunakan prompt dasar ini sekali pada awal sesi:

```text
You are implementing ReSource, a B2B Resource Matching & Circular Value Platform.

Source of truth:
1. PRD
2. Database schema
3. Data flow/state/function contracts
4. Frontend/UI specification

Rules:
- Do not invent business requirements.
- Do not change existing API or database contracts without explicit instruction.
- Keep MVP scope small.
- Business logic belongs to backend/service layer.
- Frontend consumes server state and manages presentation/form state.
- Match Score must remain:
  40% material compatibility
  30% quantity compatibility
  20% distance
  10% availability
- Database target is PostgreSQL.
- Minimal MVP API:
  POST /resources
  GET /resources
  POST /requirements
  POST /match
  POST /matches/:id/confirm
  GET /dashboard
- Avoid SELECT *.
- Avoid N+1 queries.
- Filter candidates before scoring.
- Use database transaction + row locking for confirm match.
- Do not generate random business data just to make UI look populated.
- If a requirement is ambiguous or conflicts with the source documents, stop and explain the conflict before coding.

For every task:
1. State which files will change.
2. State what contract is being implemented.
3. Implement only that scope.
4. Run or describe the relevant validation.
5. Summarize files changed.
```

---

# 5. TARGET PROJECT STRUCTURE

Recommended structure:

```text
resource-app/
│
├── frontend/
│   ├── components/
│   │   ├── layout/
│   │   ├── resource/
│   │   ├── matching/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── pages/
│   ├── state/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── matching/
│   └── types/
│
├── database/
│   ├── migrations/
│   └── seed/
│
└── README.md
```

Struktur aktual boleh menyesuaikan framework yang dipilih. Yang tidak boleh berubah adalah separation of responsibility.

---

# 6. IMPLEMENTATION ORDER

Urutan paling aman:

```text
PHASE 0  Project scaffold
PHASE 1  Database
PHASE 2  Repository
PHASE 3  API resources
PHASE 4  API requirements
PHASE 5  Matching engine
PHASE 6  Transaction confirmation
PHASE 7  Dashboard
PHASE 8  Frontend shell
PHASE 9  Resource UI
PHASE 10 Matching UI
PHASE 11 Impact UI
PHASE 12 Integration test
PHASE 13 Demo polish
```

---

# 7. PHASE 0 — PROJECT SCAFFOLD

## Prompt 01 — Scaffold

```text
Create the ReSource MVP project scaffold.

Requirements:
- Separate frontend and backend responsibilities.
- Prepare PostgreSQL integration.
- Prepare environment configuration.
- Add a minimal health endpoint.
- Add a minimal frontend route/shell.
- Do not implement business features yet.

Do not add:
- authentication system
- payment
- maps
- AI
- analytics platform
- complex state management

After implementation:
- list changed files
- explain how to run frontend and backend
- verify the health endpoint
```

### Acceptance

```text
Frontend starts.
Backend starts.
Database connection configuration exists.
Health endpoint works.
```

---

# 8. PHASE 1 — DATABASE

## Prompt 02 — Schema

```text
Implement the PostgreSQL MVP schema based strictly on 02_DATABASE_SCHEMA_DAN_DATA.md.

Required tables:
- businesses
- users
- resource_categories
- resource_listings
- demand_requests
- matches
- transactions
- system_impact_summary

Required:
- primary keys
- foreign keys
- basic CHECK constraints
- relevant indexes
- transactions.match_id UNIQUE
- status constraints where defined

Do not add tables that are not required by the source documents.

Return:
1. migration files
2. seed strategy
3. validation result
```

## Prompt 03 — Seed

```text
Create deterministic seed data for the ReSource demo.

Use the documented demo scenario:
Supplier:
- workshop furniture
- Serbuk Kayu
- 500 kg
- Sukoharjo
- Rp500/kg

Buyer:
- UMKM product olahan kayu
- Serbuk Kayu
- 300 kg
- Surakarta

Clearly mark demo data as seed/demo data.
Do not claim these values are real market prices.
```

---

# 9. PHASE 2 — REPOSITORY LAYER

## Prompt 04 — Resource Repository

```text
Implement resource repository functions according to the database contract.

Required:
- createResource()
- findActiveResources()
- findResourceById()

findActiveResources must:
- filter by category when supplied
- filter ACTIVE status
- require quantity_available > 0
- respect availability
- join business when businessName/city are required
- select only fields needed by the API
- avoid N+1 queries

Do not implement matching logic here.
```

## Prompt 05 — Requirement Repository

```text
Implement demand request repository functions.

Required:
- createRequirement()
- findRequirementById()

Follow the demand_requests schema exactly.
Do not move business logic into the repository.
```

---

# 10. PHASE 3 — RESOURCE API

## Prompt 06 — POST /resources

```text
Implement POST /resources.

Flow:
request
→ validation
→ resource use case
→ repository
→ response DTO

Validate:
- category exists
- quantity > 0
- price >= 0
- required availability fields

Do not return the entire database row.
Return the minimal resource DTO used by frontend.

On success, resource should be available to GET /resources.
```

## Prompt 07 — GET /resources

```text
Implement GET /resources.

Return only fields required by the Resource Catalog UI:
- id
- material
- quantityAvailable
- unit
- pricePerUnit
- availableFrom
- availableUntil
- businessName
- city
- status

Do not use SELECT *.
Add pagination/limit if the existing API convention supports it.
```

---

# 11. PHASE 4 — REQUIREMENT API

## Prompt 08 — POST /requirements

```text
Implement POST /requirements based on demand_requests schema.

Input:
- categoryId
- quantityNeeded
- maxPricePerUnit
- neededFrom
- neededUntil
- notes

Validate server-side.
Return requirement ID and relevant DTO.
Do not run matching inside this endpoint unless the existing application contract explicitly requires it.
```

---

# 12. PHASE 5 — MATCHING ENGINE

## Prompt 09 — Candidate Filter

```text
Implement candidate filtering for ReSource matching.

Order:
1. category_id
2. status = ACTIVE
3. quantity_available > 0
4. availability compatibility

Use indexed database filtering where possible.

Do not calculate Match Score in the database unless the existing contract requires it.
Return candidate data required by the scoring service.
```

## Prompt 10 — Scoring Functions

```text
Implement these pure functions:

calculateMaterialScore()
calculateQuantityScore()
calculateDistanceScore()
calculateAvailabilityScore()
calculateMatchScore()

Rules:
- all component scores are 0..100
- material:
  same category = 100
  different category = 0
- Match Score:
  40% material
  30% quantity
  20% distance
  10% availability

Do not add AI or semantic matching.
Write unit tests for deterministic inputs.
```

## Prompt 11 — Best Match

```text
Implement findBestMatch(candidates).

Requirement:
- return candidate with highest matchScore
- return null if no candidate
- do not sort the entire candidate list
- use O(K) iteration and O(1) extra memory for TOP 1

Write tests for:
- empty candidate list
- one candidate
- multiple candidates
- tie behavior
```

## Prompt 12 — POST /match

```text
Implement POST /match.

Flow:
Demand Request
→ load requirement
→ filter candidates
→ calculate component scores
→ calculate Match Score
→ calculate estimated transaction value
→ calculate estimated buyer saving
→ persist required match result
→ return recommended match

Response:
{
  requestId,
  recommendedMatch,
  candidates,
  summary
}

Do not calculate the same score again on the frontend.
```

---

# 13. PHASE 6 — TRANSACTION CONFIRMATION

## Prompt 13 — Confirm Match

```text
Implement POST /matches/:id/confirm.

Must execute in a database transaction.

Steps:
1. validate match
2. load listing
3. load request
4. lock listing row
5. re-check quantity
6. re-check status
7. calculate transaction value
8. calculate platform fee
9. create transaction
10. update listing
11. update request
12. update system_impact_summary
13. commit

If any step fails:
ROLLBACK.

Prevent double booking.
Use transactions.match_id UNIQUE as idempotency protection.
```

## Prompt 14 — Confirm Tests

```text
Write integration tests for confirm match.

Required cases:
- successful confirmation
- insufficient quantity
- inactive listing
- already confirmed match
- concurrent confirmation
- rollback when transaction creation fails

Verify database consistency after each case.
```

---

# 14. PHASE 7 — DASHBOARD

## Prompt 15 — GET /dashboard

```text
Implement GET /dashboard.

Return:
- totalMatchedKg
- totalTransactions
- totalTransactionValue
- totalPlatformRevenue

Use system_impact_summary as the fast aggregate source.
Do not make frontend calculate these totals.
```

---

# 15. PHASE 8 — FRONTEND SHELL

## Prompt 16 — App Shell

```text
Implement the ReSource frontend shell based on Document 04.

Required:
- AppShell
- Header
- navigation:
  Overview
  Resources
  Find Match
  Impact
- responsive layout
- placeholder pages

Do not implement backend logic or business calculations.
```

---

# 16. PHASE 9 — RESOURCE UI

## Prompt 17 — Resource Catalog

```text
Implement Resource Catalog.

Components:
- PageHeader
- ResourceFilters
- ResourceGrid
- ResourceCard
- CreateResourceModal

Use GET /resources.
Use server response as source of truth.
Show loading, empty, and error states.
```

## Prompt 18 — Create Resource UI

```text
Implement Create Resource form.

Fields:
- category
- quantity
- unit
- price per unit
- available from
- available until
- notes

On submit:
POST /resources

After success:
- close form
- refresh/invalidate resource list
- show success toast

On error:
- preserve user input
- show useful error
- do not mutate resource list
```

---

# 17. PHASE 10 — MATCHING UI

## Prompt 19 — Requirement Form

```text
Implement Find Match page.

Fields:
- material/category
- quantity needed
- max price per unit
- needed from
- needed until
- notes

On submit:
1. POST /requirements
2. POST /match

Show matching loading state.
```

## Prompt 20 — Recommended Match

```text
Implement Recommended Match UI based strictly on Document 04.

Show:
- material
- quantity
- location
- distance
- availability
- Match Score
- Match Breakdown
- Estimated Transaction Value
- Estimated Buyer Saving

Do not calculate Match Score on frontend.
```

## Prompt 21 — Confirm Dialog

```text
Implement Confirm Match dialog.

Show:
- selected resource
- agreed quantity
- agreed unit price
- estimated transaction value

On confirm:
POST /matches/:id/confirm

After success:
- close dialog
- invalidate affected server state
- refresh dashboard
- show success state
```

---

# 18. PHASE 11 — IMPACT UI

## Prompt 22 — Impact Dashboard

```text
Implement Impact Dashboard.

API:
GET /dashboard

Display:
- Resource Matched
- Transactions
- Transaction Value
- ReSource Revenue

If all values are zero, show an empty-success state.
Do not treat zero as an error.
Do not calculate aggregates on frontend.
```

---

# 19. PHASE 12 — INTEGRATION

## Prompt 23 — End-to-End Flow

```text
Test the complete ReSource MVP flow:

1. Create resource:
   Serbuk Kayu / 500 kg / Sukoharjo / Rp500/kg

2. Create requirement:
   Serbuk Kayu / 300 kg / Surakarta

3. Run match.

4. Verify:
   material score
   quantity score
   distance score
   availability score
   match score

5. Show recommended match.

6. Confirm match.

7. Verify transaction.

8. Verify listing quantity/status.

9. Verify request status.

10. Verify impact dashboard.

Do not modify business rules to make the test pass.
```

---

# 20. PHASE 13 — DEMO POLISH

## Prompt 24 — Visual Polish

```text
Polish the ReSource MVP UI without changing functionality.

Goals:
- clean
- professional
- easy to understand in seconds
- suitable for laptop and projector
- strong visual hierarchy

Do not:
- add new business features
- change API contracts
- change database
- change Match Score
- add unrelated animations
```

---

# 21. DEBUGGING PLAYBOOK

Ketika bug muncul, jangan langsung:

```text
"Fix everything."
```

Gunakan format:

```text
BUG
EXPECTED
ACTUAL
RELEVANT FILE
API/STATE
CONSTRAINT
```

Contoh:

```text
BUG:
After confirming a match, dashboard still shows 0 transactions.

EXPECTED:
Dashboard should show +1 transaction.

ACTUAL:
Transaction exists in database but dashboard remains stale.

RELEVANT:
Confirm Match UI + dashboard query/cache.

CONSTRAINT:
Do not change database schema.
```

---

# 22. PROMPT DEBUG BERTINGKAT

## Level 1 — Diagnose

```text
Diagnose this bug only.

Do not modify code yet.
Identify:
- root cause
- affected file
- state/API mismatch
- smallest safe fix
```

## Level 2 — Fix

```text
Apply only the smallest fix identified in the previous diagnosis.

Do not refactor unrelated code.
```

## Level 3 — Verify

```text
Verify the fix.

Run relevant test or explain exact verification steps.
Check that no existing contract changed.
```

---

# 23. ANTI-HALLUCINATION CHECK

Sebelum menerima hasil AI, cek:

```text
[ ] API endpoint sesuai dokumen
[ ] field database sesuai schema
[ ] Match Score sesuai formula
[ ] transaction flow menggunakan DB transaction
[ ] no random business data
[ ] no duplicate business logic
[ ] no frontend scoring
[ ] no SELECT *
[ ] no N+1
[ ] no unnecessary dependencies
```

---

# 24. CONTRACT CHECK PER FILE

Setiap file baru harus menjawab:

```text
1. File ini milik layer apa?
2. Siapa consumer-nya?
3. Apa input-nya?
4. Apa output-nya?
5. Apa source of truth-nya?
6. Apa business rule yang digunakan?
7. Apa dependency-nya?
8. Bagaimana cara mengujinya?
```

Jika AI tidak dapat menjawab, jangan lanjut ke file berikutnya.

---

# 25. CONTEXT BUDGET STRATEGY

Jangan selalu memberikan semua source document pada setiap prompt.

Gunakan context sesuai pekerjaan:

## Database

```text
PRD sections:
- core flow
- business model jika relevan

Database document:
- full relevant schema sections
```

## Backend matching

```text
PRD:
- matching formula

Database:
- matches
- resource_listings
- demand_requests

Data flow:
- matching contracts
```

## Frontend

```text
PRD:
- MVP features
- acceptance criteria

Data flow:
- state contracts
- API contracts

Frontend document:
- component specification
- wireframe
```

---

# 26. PROMPT TEMPLATE GENERIC

Gunakan template berikut untuk task baru:

```text
PROJECT:
ReSource — B2B Resource Matching & Circular Value Platform

TASK:
[one specific task]

SOURCE CONTRACT:
[document + section]

FILES ALLOWED TO CHANGE:
[file list]

REQUIREMENTS:
[bullet list]

DO NOT:
[explicit exclusions]

ACCEPTANCE CRITERIA:
[checklist]

IMPLEMENTATION:
Implement only this scope.

OUTPUT:
1. files changed
2. implementation summary
3. tests/verification
4. unresolved issues
```

---

# 27. RULE OF "NO SCOPE CREEP"

Jika AI menyarankan:

```text
authentication
payments
maps
AI
notifications
chat
logistics
advanced analytics
```

jawaban default:

```text
Not in MVP.
Keep it as a future roadmap item.
```

MVP hanya perlu membuktikan:

```text
List
→ Match
→ Value
→ Transaction
→ Impact
```

---

# 28. FINAL VALIDATION PROMPT

Gunakan sebelum demo:

```text
Audit the current ReSource implementation against the following source documents:

01_PRD_LENGKAP
02_DATABASE_SCHEMA_DAN_DATA
03_DATA_FLOW_STATE_MANAGEMENT_KONTRAK_FUNGSI
04_SPESIFIKASI_KOMPONEN_FRONTEND_UI_WIREFRAME

Check only:
- MVP scope
- API contracts
- database fields
- Match Score formula
- transaction flow
- frontend state ownership
- empty/loading/error states
- dashboard data
- double booking protection

Return:
PASS / FAIL for each category.
For every FAIL, identify the smallest fix.
Do not refactor unrelated code.
```

---

# 29. DEMO READINESS CHECKLIST

```text
[ ] App starts
[ ] Database connects
[ ] Seed data exists
[ ] Resource can be created
[ ] Resource appears in catalog
[ ] Requirement can be created
[ ] Match can be generated
[ ] Recommended Match appears
[ ] Score breakdown appears
[ ] Estimated value appears
[ ] Confirm Match works
[ ] Transaction is created
[ ] Listing updates
[ ] Request updates
[ ] Impact updates
[ ] Refresh does not duplicate transaction
[ ] Empty state works
[ ] Error state works
[ ] No critical console errors
```

---

# 30. PRIORITY WHEN TIME IS RUNNING OUT

Jika waktu tersisa < 60 menit:

```text
STOP adding features.
```

Prioritas:

```text
1. Fix critical flow
2. Fix demo data
3. Fix UI clarity
4. Fix loading/error states
5. Test complete flow
6. Prepare pitch
```

Jangan mengorbankan core flow untuk fitur tambahan.

---

# 31. KESIMPULAN

Vibecoding ReSource harus dilakukan seperti membangun sistem kontrak:

```text
PRODUCT INTENT
      ↓
DATA MODEL
      ↓
FUNCTION CONTRACT
      ↓
API
      ↓
UI
      ↓
INTEGRATION
      ↓
DEMO
```

Strategi file-by-file mengurangi risiko AI:

- mengarang schema;
- mengubah formula;
- mencampur business logic;
- membuat API yang tidak konsisten;
- membuat UI yang tidak sesuai data;
- overengineering;
- scope creep.

Target akhir:

> **Satu alur demo yang benar-benar bekerja lebih bernilai daripada banyak fitur yang belum stabil.**
