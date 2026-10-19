# DOKUMEN 06: STRATEGI PITCHING TOP 5 & MODEL BISNIS STARTUP

## Proyek: ReSource — B2B Resource Matching & Circular Value Platform

**Pilar SDG:** SDG 12 — Responsible Consumption & Production  
**Basis dokumen:** `01_PRD_LENGKAP` + `02_DATABASE_SCHEMA_DAN_DATA` + `03_DATA_FLOW_STATE_MANAGEMENT_KONTRAK_FUNGSI` + `04_SPESIFIKASI_KOMPONEN_FRONTEND_UI_WIREFRAME` + `05_PLAYBOOK_PROMPTING_BERTINGKAT`  
**Target:** Pitching kompetisi/hackathon dengan fokus Top 5.

---

# 1. TUJUAN DOKUMEN

Dokumen ini menyusun strategi untuk mengubah MVP ReSource menjadi pitch yang:

- mudah dipahami;
- memiliki problem nyata;
- menunjukkan product differentiation;
- memperlihatkan demo value;
- memiliki model bisnis;
- memiliki jalur scalability;
- relevan dengan SDG 12;
- realistis untuk tahap MVP.

Prinsip pitch:

> **Jangan menjual fitur. Jual perubahan nilai yang terjadi karena ReSource.**

---

# 2. ONE-LINE PITCH

Versi utama:

> **ReSource adalah B2B resource matching platform yang membantu bisnis menemukan dan memonetisasi material yang sulit dimanfaatkan sendiri.**

Tagline:

> **Turn Unused Resources Into Business Value.**

---

# 3. POSITIONING

## ReSource bukan

> "Marketplace limbah."

Positioning tersebut terlalu umum dan berisiko membuat ReSource terlihat hanya sebagai katalog.

## ReSource adalah

> **B2B resource matching platform yang mempertemukan supply dan demand resource lokal berdasarkan material, jumlah, jarak, dan ketersediaan, lalu mengubah match tersebut menjadi nilai ekonomi yang dapat ditransaksikan.**

Perbedaan utama:

```text
Marketplace:
List → Search → Buy

ReSource:
List → Match → Value → Transaction → Impact
```

---

# 4. PROBLEM STATEMENT

Banyak usaha kecil dan menengah menghasilkan by-product atau material sisa dalam jumlah kecil dan tersebar.

Masalahnya bukan selalu:

```text
material tidak bernilai
```

tetapi:

```text
resource sulit ditemukan
+
buyer sulit menemukan supplier yang sesuai
+
informasi quantity/location/availability tidak terstruktur
```

Akibatnya:

```text
Supplier
→ material tersimpan / tidak termonetisasi optimal

Buyer
→ mencari supplier satu per satu

Market
→ supply dan demand tidak bertemu secara efisien
```

---

# 5. SOLUTION

ReSource membuat alur:

```text
Supplier
  ↓
List unused resource
  ↓
Buyer creates requirement
  ↓
Matching Engine
  ↓
Recommended Match
  ↓
Estimated Value
  ↓
Transaction
  ↓
Impact Dashboard
```

Matching mempertimbangkan:

```text
40% Material Compatibility
30% Quantity Compatibility
20% Distance
10% Availability
```

Formula dibuat sederhana dan transparan untuk MVP.

---

# 6. WHY NOW / WHY THIS PRODUCT

Untuk pitch, jangan membuat klaim pasar eksternal yang belum diverifikasi.

Gunakan problem yang sudah didefinisikan produk:

```text
Resource supply tersebar.
Buyer membutuhkan material alternatif.
Informasi supply-demand tidak selalu terhubung.
```

ReSource hadir sebagai infrastructure layer ringan:

```text
Supply
   +
Demand
   ↓
Matching
   ↓
Business Value
```

---

# 7. DEMO STORY YANG WAJIB DIPAKAI

Gunakan satu cerita konkret.

## Supplier

```text
Workshop furnitur
Material: Serbuk Kayu
Quantity: 500 kg
Location: Sukoharjo
Indicative Value: Rp500/kg
```

## Buyer

```text
UMKM produk olahan kayu
Need: Serbuk Kayu
Quantity: 300 kg
Location: Surakarta
```

## ReSource

```text
Material Match: 100%
Quantity Match: 60%
Distance: 14 km
Availability: Suitable
Match Score: 88%
```

## Value

```text
Potential Transaction: Rp150.000
Supplier Revenue: Rp150.000
Estimated Buyer Saving: Rp30.000
```

## Impact

```text
Resource Matched: 300 kg
Successful Matches: +1
```

> Semua angka di atas adalah dummy data demo sesuai PRD, bukan klaim harga pasar nyata.

---

# 8. PITCH NARRATIVE — 5 MENIT

Struktur:

```text
0:00–0:40 Problem
0:40–1:20 Insight
1:20–2:00 Solution
2:00–3:15 Demo
3:15–4:00 Business Model
4:00–4:35 Scalability
4:35–5:00 Closing
```

---

# 9. SLIDE 1 — HOOK

Headline:

> **What if unused resources were not waste — but missed business value?**

Subheadline:

> ReSource turns scattered unused resources into discoverable B2B supply.

Visual:

```text
UNUSED RESOURCE
       ↓
     ????
       ↓
BUSINESS VALUE
```

Jangan langsung memulai dengan database atau teknologi.

---

# 10. SLIDE 2 — PROBLEM

Headline:

> **The problem is not always supply. It's discoverability.**

Tampilkan dua sisi:

```text
SUPPLIER
" Saya punya 500 kg serbuk kayu,
  tapi siapa yang membutuhkan? "

                VS

BUYER
" Saya butuh 300 kg,
  tapi supplier yang cocok di mana? "
```

Kesimpulan:

> Supply exists. Demand exists. The connection is broken.

---

# 11. SLIDE 3 — SOLUTION

Headline:

> **ReSource connects unused supply with real business demand.**

Diagram:

```text
SUPPLIER
500 kg
   ↓
LIST
   ↓
MATCH
   ↓
VALUE
   ↓
TRANSACTION
   ↓
IMPACT
```

Tekankan:

> ReSource bukan sekadar tempat listing resource. Sistem membantu menentukan resource mana yang paling cocok.

---

# 12. SLIDE 4 — HOW MATCHING WORKS

Headline:

> **The match is explainable, not a black box.**

Tampilkan:

```text
40% Material
30% Quantity
20% Distance
10% Availability
```

Kemudian:

```text
Candidate Filtering
       ↓
Score Calculation
       ↓
Recommended Match
```

Pesan utama:

> Untuk MVP, kami memilih scoring yang sederhana, transparan, dan dapat dijelaskan kepada buyer.

---

# 13. SLIDE 5 — LIVE DEMO

Urutan demo:

```text
1. Open Resources
2. Show 500 kg Serbuk Kayu
3. Create buyer requirement: 300 kg
4. Click Find Match
5. Show 88% recommendation
6. Show score breakdown
7. Show Rp150.000 estimated transaction
8. Confirm Match
9. Open Impact Dashboard
10. Show +300 kg and +1 transaction
```

Jangan membuka:

```text
database console
code editor
terminal
```

kecuali juri meminta technical explanation.

---

# 14. DEMO GOLDEN PATH

Golden path harus selalu berhasil.

```text
Seed Data
  ↓
Create Requirement
  ↓
Match
  ↓
Recommended Match
  ↓
Confirm
  ↓
Impact
```

Siapkan fallback:

```text
Demo Mode / deterministic seed
```

Tetapi jangan membuat angka hasil matching palsu di frontend. Backend tetap harus menghasilkan result.

---

# 15. SLIDE 6 — BUSINESS MODEL

## Primary revenue

### Transaction Fee

ReSource mengambil biaya layanan dari transaksi yang berhasil.

Contoh demo:

```text
Transaction Value = Rp150.000
Fee = 5%
ReSource Revenue = Rp7.500
```

Formula:

```text
Platform Revenue
=
Transaction Value × Platform Fee Rate
```

Contoh 5% digunakan sebagai model demo yang sudah ditentukan PRD.

---

# 16. WHY TRANSACTION FEE?

Transaction fee selaras dengan value creation:

```text
No successful match
→ No transaction
→ No transaction fee

Successful match
→ Transaction
→ ReSource earns fee
```

Ini membuat monetization model berbasis outcome.

Pesan pitch:

> **We monetize when we create value, not simply when businesses sign up.**

---

# 17. SECONDARY REVENUE — FUTURE B2B SUBSCRIPTION

Setelah pola transaksi terbentuk, ReSource dapat menawarkan subscription untuk business yang memiliki recurring procurement.

Fitur:

```text
Recurring Procurement
Supplier Analytics
Demand Tracking
Historical Matching
Impact Reporting
```

Model:

```text
Transaction Fee
      +
B2B Subscription
```

Subscription adalah post-MVP, bukan dependency untuk membuktikan MVP.

---

# 18. UNIT ECONOMICS LOGIC

Jangan memberikan angka CAC/LTV yang tidak berasal dari data aktual.

Untuk tahap MVP, gunakan framework:

```text
GMV
↓
Transaction Fee
↓
Platform Revenue
```

Contoh:

```text
100 successful transactions
×
average transaction value
×
5%
=
gross platform transaction revenue
```

Angka average transaction value harus berasal dari data transaksi nyata setelah platform berjalan.

---

# 19. GROWTH MODEL

PRD menentukan fokus bertahap:

```text
One Region
   ↓
One Resource Category
   ↓
Initial Network
   ↓
More Suppliers
   ↓
More Buyers
   ↓
More Transactions
```

Jangan pitch:

> "Kami akan menjadi marketplace semua limbah di Indonesia."

Lebih kuat:

> "Kami mulai dari satu resource category dan satu regional network untuk membuktikan liquidity terlebih dahulu."

---

# 20. NETWORK EFFECT LOGIC

ReSource memiliki flywheel potensial:

```text
More Suppliers
      ↓
More Resource Availability
      ↓
Better Buyer Choice
      ↓
More Buyers
      ↓
More Demand
      ↓
More Transactions
      ↓
More Data
      ↓
Better Matching
      ↓
More Suppliers
```

Namun untuk MVP, jangan mengklaim network effect sudah terjadi.

Gunakan:

> **Potential future flywheel**

---

# 21. SCALABILITY ROADMAP

## Phase 1 — MVP

```text
1 region
1–few resource categories
basic matching
transaction fee
```

## Phase 2

```text
Geolocation
Verified Business Profiles
Transaction & Payment
Smart Logistics
```

## Phase 3

```text
AI Matching
Recurring Procurement
Impact Reporting
B2B Analytics
```

Roadmap berasal dari future roadmap PRD.

---

# 22. SDG 12 CONNECTION

ReSource harus menghubungkan product action dengan SDG 12.

```text
Unused Resource
       ↓
Rediscovered
       ↓
Matched to Business Need
       ↓
Re-enters Economic Value Chain
```

Pesan:

> ReSource membantu resource yang sebelumnya sulit dimanfaatkan masuk kembali ke rantai nilai ekonomi.

Jangan menyatakan impact lingkungan spesifik yang belum diukur.

---

# 23. COMPETITIVE DIFFERENTIATION

Jangan membuat competitor matrix dengan nama perusahaan jika belum ada riset kompetitor yang tervalidasi.

Gunakan category-level differentiation:

| Model | Discover Supply | Matching | Value Estimation | Transaction | Impact |
|---|---:|---:|---:|---:|---:|
| Informal supplier search | rendah | rendah | rendah | manual | rendah |
| Generic marketplace | tinggi | rendah | rendah | ada | rendah |
| ReSource | tinggi | tinggi | tinggi | ya | ya |

Pesan:

> **The differentiation is not listing. It is the matching-to-value workflow.**

---

# 24. TOP 5 JUDGE CRITERIA

PRD menekankan:

## 1. SDG Relevance

Jelaskan:

```text
unused resource
→ productive reuse
→ SDG 12
```

## 2. Creativity & Logic

Tekankan:

```text
List → Match → Value
```

## 3. Functionality

Demo harus berjalan:

```text
Create resource
→ Search need
→ Match
→ Recommendation
→ Value
→ Impact
```

## 4. UI/UX

Pastikan:

```text
clean
professional
understandable in seconds
projector-friendly
```

## 5. Business Model

Tekankan:

```text
successful transaction
→ transaction fee
```

---

# 25. JAWABAN UNTUK "WHY NOT JUST A MARKETPLACE?"

Jawaban:

> Marketplace membantu orang menemukan listing. ReSource fokus pada masalah setelah listing: resource mana yang benar-benar cocok untuk kebutuhan buyer? Kami menggabungkan material, quantity, distance, dan availability menjadi Recommended Match, lalu menghubungkannya dengan transaction value dan impact.

---

# 26. JAWABAN UNTUK "WHY WOULD SUPPLIERS JOIN?"

> Karena ReSource membantu mereka menemukan buyer untuk material yang sebelumnya sulit dimonetisasi atau sulit ditemukan demand-nya. Nilainya bukan hanya exposure, tetapi akses ke demand yang lebih relevan.

---

# 27. JAWABAN UNTUK "WHY WOULD BUYERS USE IT?"

> Buyer tidak perlu mencari supplier satu per satu. Mereka memasukkan kebutuhan, lalu ReSource menyaring kandidat dan menunjukkan resource yang paling cocok beserta alasan rekomendasinya.

---

# 28. JAWABAN UNTUK "HOW DO YOU MAKE MONEY?"

> Model utama kami adalah transaction fee dari transaksi yang berhasil dimatch. Jadi revenue platform mengikuti value creation. Setelah recurring demand terbentuk, kami dapat menambahkan B2B subscription untuk procurement dan analytics.

---

# 29. JAWABAN UNTUK "WHAT IF THERE ARE NOT ENOUGH SUPPLIERS?"

> Kami tidak memulai secara horizontal. Strategi awal kami adalah satu region dan satu resource category untuk membentuk initial network terlebih dahulu. Setelah supply-demand liquidity terbukti, kami memperluas kategori dan wilayah.

---

# 30. JAWABAN UNTUK "IS THE MATCHING REALLY AI?"

Untuk MVP:

> MVP kami sengaja menggunakan deterministic scoring yang transparan, bukan AI black box. Ini membuat hasil mudah dijelaskan dan divalidasi. Setelah data transaksi terkumpul, semantic dan AI matching dapat menjadi pengembangan berikutnya.

Ini lebih kredibel daripada mengklaim AI yang belum dibangun.

---

# 31. JAWABAN UNTUK "HOW DO YOU PREVENT DOUBLE BOOKING?"

> Confirm Match diproses melalui database transaction dan row locking. Sistem mengecek ulang quantity dan status resource sebelum transaction dibuat. Database juga menjaga satu match tidak menghasilkan transaction ganda.

---

# 32. JAWABAN UNTUK "WHAT IS YOUR MOAT?"

Untuk tahap awal:

```text
Structured supply-demand data
+
matching history
+
business network
+
transaction history
```

Potential moat:

> Semakin banyak transaksi terjadi, semakin banyak data matching dan supply-demand yang dapat digunakan untuk meningkatkan kualitas recommendation.

Jangan mengklaim moat sudah terbentuk pada MVP.

---

# 33. JAWABAN UNTUK "WHAT IS THE BIGGEST RISK?"

Risiko utama:

```text
liquidity
```

Yaitu:

```text
tidak cukup supply
atau
tidak cukup demand
```

Mitigasi:

```text
focus one region
+
focus one resource category
+
seed initial network
+
validate repeat transactions
```

---

# 34. METRIC YANG HARUS DILACAK

Untuk early-stage:

## Supply

```text
active listings
total resource quantity
supplier count
```

## Demand

```text
open requirements
buyer count
quantity requested
```

## Matching

```text
matches generated
recommended match acceptance rate
match success rate
```

## Transaction

```text
completed transactions
GMV / transaction value
platform fee revenue
```

## Impact

```text
resource matched
```

Jangan menambahkan metrik lingkungan yang belum memiliki metode pengukuran.

---

# 35. NORTH STAR METRIC

Rekomendasi North Star Metric untuk tahap awal:

> **Successfully Matched Resource Volume**

Representasi:

```text
Total quantity of resources successfully matched
```

Contoh:

```text
300 kg
→ 300 kg successfully matched
```

Alasan:

Metric ini menghubungkan:

```text
supply
+
demand
+
matching
+
transaction
+
impact
```

---

# 36. PITCH DECK STRUCTURE

Deck 8 slide:

```text
1. Hook
2. Problem
3. Solution
4. How Matching Works
5. Demo / Product
6. Business Model
7. Growth + Roadmap
8. Closing / Ask
```

---

# 37. CLOSING SLIDE

Headline:

> **Turn Unused Resources Into Business Value.**

Visual:

```text
UNUSED
  ↓
MATCHED
  ↓
TRANSACTED
  ↓
IMPACT
```

Closing statement:

> "ReSource starts with one simple idea: a resource becomes valuable when the right business can find it."

---

# 38. THE ASK

Untuk kompetisi, jika diminta "What do you need?", jangan meminta hal yang terlalu luas.

Pilihan:

```text
Pilot partners
Supplier network
Buyer network
Regional resource data
Mentorship
```

Jika konteks kompetisi menyediakan prize/funding, framing:

> We want to use the next phase to validate our first regional resource network and prove repeat transaction behavior.

---

# 39. BUSINESS MODEL CANVAS — RINGKAS

## Customer Segments

```text
Resource Providers
Resource Buyers
```

## Value Proposition

```text
Provider:
Monetize hard-to-place resources.

Buyer:
Find relevant alternative material faster.
```

## Channels

```text
Direct B2B outreach
Local business communities
Partnerships
Regional networks
```

## Customer Relationship

```text
Self-service platform
B2B onboarding
Future account management
```

## Revenue

```text
Transaction fee
Future B2B subscription
```

## Key Activities

```text
Resource discovery
Matching
Transaction enablement
Network building
```

## Key Resources

```text
Matching engine
Resource data
Business network
Transaction history
```

## Key Partners

```text
Business communities
Local ecosystem partners
Future logistics/payment partners
```

## Cost Structure

```text
Platform infrastructure
Development
Sales/onboarding
Operations
Future logistics/payment integrations
```

---

# 40. FINANCIAL MODEL SEDERHANA

Untuk MVP, gunakan:

```text
Revenue
=
Completed Transaction Value
×
Platform Fee Rate
```

Contoh:

```text
Rp150.000 × 5%
= Rp7.500
```

Jika ada:

```text
100 transactions
× Rp150.000
= Rp15.000.000 transaction value
```

Maka:

```text
Rp15.000.000 × 5%
= Rp750.000 platform revenue
```

Ini adalah ilustrasi model, bukan forecast pasar.

---

# 41. PITCHING RULES

## Do

```text
Show one concrete story
Show the product early
Explain matching simply
Show value in Rupiah
Connect transaction to revenue
Connect resource matching to SDG 12
Be honest about MVP vs roadmap
```

## Don't

```text
Don't overclaim AI
Don't claim market size without source
Don't claim environmental savings without methodology
Don't demo every feature
Don't start with architecture
Don't say "we are Uber for waste"
Don't promise all industries immediately
```

---

# 42. 30-SECOND ELEVATOR PITCH

> ReSource is a B2B resource matching platform for businesses that have unused materials and businesses that need them. Instead of making buyers search supplier by supplier, ReSource matches resources based on material, quantity, distance, and availability, then turns the best match into measurable business value and transaction. We start locally, monetize through transaction fees, and expand as supply-demand liquidity grows.

---

# 43. 60-SECOND VERSION

> Many businesses have by-products or unused materials that are difficult to monetize because the right buyer does not know they exist. At the same time, other businesses need alternative materials but have to search for suppliers one by one. ReSource connects those two sides. A supplier lists a resource, a buyer enters a requirement, and our matching engine recommends the best resource using material compatibility, quantity, distance, and availability. We then show the estimated transaction value and update the impact dashboard after confirmation. Our MVP monetizes successful transactions through a 5% demo transaction fee, while future B2B subscriptions can support recurring procurement and analytics. We start with one region and one resource category to prove the network before scaling.

---

# 44. FINAL TOP 5 CHECKLIST

Sebelum naik panggung:

```text
PRODUCT
[ ] Core flow works
[ ] Demo seed ready
[ ] No critical bug

PROBLEM
[ ] Problem explainable in <30 seconds

SOLUTION
[ ] List → Match → Value clear

TECH
[ ] Match Score explainable
[ ] Double booking protection explainable

BUSINESS
[ ] Transaction fee explained
[ ] Future subscription explained
[ ] Growth model explained

SDG
[ ] SDG 12 connection clear

DEMO
[ ] 500 kg → 300 kg story ready
[ ] 88% recommendation visible
[ ] Rp150.000 value visible
[ ] +300 kg impact visible

PITCH
[ ] No unsupported market claims
[ ] No exaggerated AI claims
[ ] Clear closing
```

---

# 45. FINAL STRATEGIC MESSAGE

Jika hanya ada tiga hal yang diingat juri:

```text
1. ReSource connects fragmented resource supply with real B2B demand.

2. The differentiator is:
   LIST → MATCH → VALUE.

3. The business model earns when successful matching creates a transaction.
```

Kalimat penutup:

> **ReSource doesn't just help businesses list what they have. It helps the right business find value in it.**
