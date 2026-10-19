# 🎨 Panduan Tugas Technical Spec: Role 2 — Frontend Developer
**Proyek:** ReSource — B2B Resource Matching Platform (SDG 12: Responsible Consumption & Production)  
**Role:** Anggota 2 (Frontend Developer)  
**Fokus Utama:** Design System, Component Hierarchy, State Management, API Integration, Dynamic Match Score Visualization, and Interactive Demo Flow.

---

## 📋 1. Header & Metadata Dokumen
* **Nama Peran:** Role 2 — Frontend Developer & UI/UX Integrator
* **Deskripsi Peran:** Bertanggung jawab membangun antarmuka web interaktif yang intuitif, cepat, responsif, dan menyajikan data statistik material sampingan industri (*side-stream materials*) serta kalkulasi *Smart Match Score* secara visual.
* **Pilar SDG 12 Alignment:** **Responsible Consumption and Production** — Menyajikan indikator visual pengalihan limbah manufaktur dari TPA (*Waste Diverted*) dan estimasi jejak karbon yang di-offset ($kg\ CO_2e$) secara transparan bagi pelaku usaha B2B.

---

## 🏗️ 2. Arsitektur Frontend & State Ownership

Untuk memastikan aplikasi modular dan efisien selama pengujian, arsitektur state dibagi menjadi dua kategori utama:

```
                  +-----------------------------------+
                  |        App Core Architecture      |
                  +-----------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
  [Server State Management]                      [Local UI State]
  (TanStack Query / SWR / Async API)             (React useState / useReducer)
  - Resources Listing                            - Form Inputs (Title, Qty, Price)
  - Active Matches Results                       - Modal Visibility (IsOpen/Closed)
  - Impact Dashboard Metrics                     - Filter/Search Inputs
  - Transaction History                          - Active Tab Selection
```

### Separation of Concerns (SoC) Rules:
1. **Presentation Components (Pure UI):** Komponen seperti `ResourceCard`, `MatchBreakdown`, dan `ValueSummary` bersifat pasif (*stateless* / receive props) dan fokus pada rendering visual.
2. **Container Components:** Komponen halaman (`ResourceCatalog`, `FindMatchPage`, `ImpactDashboard`) menangani pemanggilan API, pengelolaan server state, serta manipulasi *toast notification*.
3. **API Service Layer:** Seluruh pemanggilan `fetch` atau `axios` wajib ditempatkan di file `src/services/api.js` untuk menghindari duplikasi kode.

---

## 🎨 3. Design System & Style Guide (Tailwind CSS)

Tambahkan konfigurasi variabel warna dan font pada file `tailwind.config.js`:

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // Emerald Primary (Circular Economy & Sustainability)
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        ecoSlate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#334155',
          800: '#1e293b', // Primary Dark Body Text
          900: '#0f172a',
        },
        accentAmber: {
          500: '#f59e0b', // Rating & Highlight Badges
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
```

---

## 🧩 4. Spesifikasi Komponen & Layout UI

### 1. App Shell & Navigation Header (`AppShell.jsx`)
* **Struktur Layout:**
  * Top Navigation Bar (Logo ReSource + Tagline "Circular B2B Platform").
  * Tab Navigasi Utama: `Katalog Material`, `Cari Match (Demand)`, `Impact Dashboard`.
  * Status Koneksi API (Indicator Badge: `Live Database / Mock`).

```jsx
import React, { useState } from 'react';

export const AppShell = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen bg-ecoSlate-50 text-ecoSlate-800 font-sans">
      <header className="bg-white border-b border-ecoSlate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <div>
              <h1 className="font-bold text-lg text-ecoSlate-900 leading-none">ReSource</h1>
              <span className="text-xs text-ecoSlate-700">Circular Value Platform</span>
            </div>
          </div>
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'catalog' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ecoSlate-700 hover:text-ecoSlate-900'
              }`}
            >
              Katalog Material
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'match' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ecoSlate-700 hover:text-ecoSlate-900'
              }`}
            >
              Smart Match
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ecoSlate-700 hover:text-ecoSlate-900'
              }`}
            >
              Impact Dashboard
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
```

---

### 2. Resource Card Component (`ResourceCard.jsx`)
* **Properti UI:** Menampilkan unit limbah industri dengan badge status, lokasi kota, harga, dan indikator offset emisi karbon ($kg\ CO_2e$).

```jsx
import React from 'react';

export const ResourceCard = ({ resource, onSelectForMatch }) => {
  const isAvailable = resource.status === 'AVAILABLE';

  return (
    <div className="bg-white rounded-xl border border-ecoSlate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ecoSlate-100 text-ecoSlate-700 uppercase tracking-wider">
            {resource.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {resource.status}
          </span>
        </div>

        <h3 className="font-bold text-ecoSlate-900 text-lg mb-1">{resource.title}</h3>
        <p className="text-xs text-ecoSlate-700 mb-4">
          Oleh: <span className="font-semibold text-ecoSlate-800">{resource.provider_name || 'Industri Partner'}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 bg-ecoSlate-50 p-3 rounded-lg text-sm mb-4">
          <div>
            <span className="text-xs text-ecoSlate-700 block">Tersedia:</span>
            <span className="font-bold text-ecoSlate-900">{resource.quantity} {resource.unit}</span>
          </div>
          <div>
            <span className="text-xs text-ecoSlate-700 block">Lokasi:</span>
            <span className="font-bold text-ecoSlate-900">{resource.city}</span>
          </div>
          <div>
            <span className="text-xs text-ecoSlate-700 block">Harga/Unit:</span>
            <span className="font-bold text-brand-700">Rp {Number(resource.price_per_unit).toLocaleString('id-ID')}</span>
          </div>
          <div>
            <span className="text-xs text-ecoSlate-700 block">Carbon Factor:</span>
            <span className="font-bold text-emerald-600">{resource.carbon_offset_factor} kg CO₂e</span>
          </div>
        </div>
      </div>

      {onSelectForMatch && isAvailable && (
        <button
          onClick={() => onSelectForMatch(resource)}
          className="w-full mt-2 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm rounded-lg transition"
        >
          Gunakan untuk Match
        </button>
      )}
    </div>
  );
};
```

---

### 3. Create Resource Modal (`CreateResourceModal.jsx`)
Form input untuk menyuplai data limbah baru (*Provider Side*).

```jsx
import React, { useState } from 'react';

export const CreateResourceModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    provider_id: '11111111-1111-1111-1111-111111111111', // Default ID Provider
    title: '',
    category: 'Limbah Kayu & Briket',
    quantity: '',
    unit: 'Kg',
    city: 'Sukoharjo',
    price_per_unit: '',
    waste_code: 'B104-A',
    carbon_offset_factor: '1.250',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitSuccess(formData);
      onClose();
    } catch (err) {
      alert('Gagal menambahkan resource. Periksa server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-ecoSlate-200">
        <h2 className="text-xl font-bold text-ecoSlate-900 mb-4">Tambah Listing Limbah Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-ecoSlate-700">Judul Material</label>
            <input
              type="text"
              required
              placeholder="Contoh: Limbah Serbuk Kayu Jati"
              className="w-full border border-ecoSlate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-ecoSlate-700">Kategori</label>
              <select
                className="w-full border border-ecoSlate-200 rounded-lg p-2 text-sm outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Limbah Kayu & Briket</option>
                <option>Tekstil & Kain</option>
                <option>Plastik Industri</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ecoSlate-700">Kota Lokasi</label>
              <input
                type="text"
                required
                className="w-full border border-ecoSlate-200 rounded-lg p-2 text-sm outline-none"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-ecoSlate-700">Kuantitas</label>
              <input
                type="number"
                required
                placeholder="500"
                className="w-full border border-ecoSlate-200 rounded-lg p-2 text-sm outline-none"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ecoSlate-700">Harga / Unit (Rp)</label>
              <input
                type="number"
                required
                placeholder="500"
                className="w-full border border-ecoSlate-200 rounded-lg p-2 text-sm outline-none"
                value={formData.price_per_unit}
                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm text-ecoSlate-600 hover:bg-ecoSlate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
            >
              {submitting ? 'Satu Momen...' : 'Simpan Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

---

### 4. Smart Match Result & Breakdown Component (`MatchResultCard.jsx`)
Komponen visualisasi hasil kalkulasi rekomendasi match, persentase skor, rincian nilai transaksi, dan tombol konfirmasi.

```jsx
import React from 'react';

export const MatchResultCard = ({ matchResult, onConfirmMatch, confirming }) => {
  const { match_id, resource, scores, financial_and_impact } = matchResult;

  return (
    <div className="bg-white rounded-xl border-2 border-brand-500 shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-brand-500 text-white px-4 py-1 rounded-bl-xl font-bold text-sm">
        {scores.total_match_score}% MATCH
      </div>

      <h3 className="text-xl font-bold text-ecoSlate-900 mb-1">{resource.title}</h3>
      <p className="text-sm text-ecoSlate-700 mb-4">Penyedia: {resource.provider_name} ({resource.city})</p>

      {/* Score Breakdown Bars */}
      <div className="space-y-2 mb-6 bg-ecoSlate-50 p-4 rounded-lg">
        <h4 className="text-xs font-bold text-ecoSlate-700 uppercase tracking-wide mb-2">Scoring Breakdown Analysis</h4>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Kesesuaian Material (40%)</span>
            <span className="font-semibold">{scores.material_score}%</span>
          </div>
          <div className="w-full bg-ecoSlate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full" style={{ width: `${scores.material_score}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Pemenuhan Kuantitas (30%)</span>
            <span className="font-semibold">{scores.quantity_score}%</span>
          </div>
          <div className="w-full bg-ecoSlate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-500 h-full" style={{ width: `${scores.quantity_score}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Kedekatan Lokasi (20%)</span>
            <span className="font-semibold">{scores.distance_score}%</span>
          </div>
          <div className="w-full bg-ecoSlate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: `${scores.distance_score}%` }}></div>
          </div>
        </div>
      </div>

      {/* Value Summary */}
      <div className="grid grid-cols-2 gap-4 border-t border-ecoSlate-200 pt-4 mb-6">
        <div>
          <span className="text-xs text-ecoSlate-700 block">Total Nilai Transaksi:</span>
          <span className="text-lg font-extrabold text-brand-700">
            Rp {Number(financial_and_impact.total_price).toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-ecoSlate-700 block">
            ({financial_and_impact.allocated_quantity} {financial_and_impact.unit} × Rp {financial_and_impact.price_per_unit})
          </span>
        </div>
        <div>
          <span className="text-xs text-ecoSlate-700 block">Dampak Pengurangan Emisi:</span>
          <span className="text-lg font-extrabold text-emerald-600">
            {financial_and_impact.carbon_saved_kg} kg CO₂e
          </span>
          <span className="text-xs text-ecoSlate-700 block">Limbah Terhindar Dari TPA</span>
        </div>
      </div>

      <button
        onClick={() => onConfirmMatch(match_id)}
        disabled={confirming}
        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2"
      >
        {confirming ? 'Memproses Transaksi Locking...' : '⚡ Konfirmasi & Transaksikan Match'}
      </button>
    </div>
  );
};
```

---

### 5. Impact Dashboard View (`ImpactDashboard.jsx`)
Visualisasi metrik kumulatif keberlanjutan.

```jsx
import React from 'react';

export const ImpactDashboard = ({ metrics, loading }) => {
  if (loading) return <div className="text-center py-10">Memuat data agregasi dampak...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-brand-900 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Impact & Circular Analytics</h2>
        <p className="text-brand-100 text-sm">
          Pantau kontribusi pengalihan limbah manufaktur dan potensi offset emisi karbon secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-ecoSlate-200 shadow-sm">
          <span className="text-xs text-ecoSlate-700 font-semibold uppercase">Total Limbah Dialihkan</span>
          <p className="text-3xl font-extrabold text-ecoSlate-900 mt-2">
            {metrics?.total_waste_diverted_kg || 0} <span className="text-base font-normal text-ecoSlate-700">Kg</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-ecoSlate-200 shadow-sm">
          <span className="text-xs text-ecoSlate-700 font-semibold uppercase">Total Carbon Offset</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {metrics?.total_carbon_offset_kg || 0} <span className="text-base font-normal text-ecoSlate-700">kg CO₂e</span>
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-ecoSlate-200 shadow-sm">
          <span className="text-xs text-ecoSlate-700 font-semibold uppercase">Nilai Transaksi Sirkular</span>
          <p className="text-3xl font-extrabold text-brand-700 mt-2">
            Rp {Number(metrics?.total_economic_value_idr || 0).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-ecoSlate-200 shadow-sm">
          <span className="text-xs text-ecoSlate-700 font-semibold uppercase">Match Berhasil</span>
          <p className="text-3xl font-extrabold text-ecoSlate-900 mt-2">
            {metrics?.completed_matches_count || 0} <span className="text-base font-normal text-ecoSlate-700">Sinergi</span>
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

## 🔗 5. REST API Client Layer (`src/services/api.js`)

Simpan fungsi penanganan request HTTP berikut di file terpisah:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export const fetchResources = async () => {
  const res = await fetch(`${API_BASE_URL}/resources`);
  if (!res.ok) throw new Error('Gagal mengambil data resource');
  return res.json();
};

export const createResourceAPI = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gagal menambahkan resource');
  return res.json();
};

export const createRequirementAPI = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gagal mendaftarkan kebutuhan requirement');
  return res.json();
};

export const executeMatchAPI = async (requirementId) => {
  const res = await fetch(`${API_BASE_URL}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requirement_id: requirementId }),
  });
  if (!res.ok) throw new Error('Gagal menjalankan engine matching');
  return res.json();
};

export const confirmMatchAPI = async (matchId) => {
  const res = await fetch(`${API_BASE_URL}/matches/${matchId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal mengonfirmasi match transaksi');
  return res.json();
};

export const fetchImpactMetrics = async () => {
  const res = await fetch(`${API_BASE_URL}/dashboard/impact`);
  if (!res.ok) throw new Error('Gagal mengambil metrics dashboard');
  return res.json();
};
```

---

## ⚡ 6. State Lifecycle, UX Handling & Golden Path Demo Flow

### Skenario Demo Utama (Golden Path Walkthrough):
1. **Katalog Utama:** Tampilkan listing awal (Serbuk Kayu Jati 500 Kg di Sukoharjo).
2. **Pencarian Match (Seeker Side):**
   * Pindah ke Tab **Smart Match**.
   * Pilih Kategori `Limbah Kayu & Briket`, Min Quantity `300 Kg`, Max Price `Rp 600`, Kota `Surakarta`.
   * Klik **"Jalankan Engine Match"**.
3. **Penyajian Hasil:** Komponen `MatchResultCard` menampilkan **96% Match**, Nilai Rp 150.000, Carbon Offset 375 kg CO₂e.
4. **Konfirmasi & Concurrency Locking:** Klik **"⚡ Konfirmasi & Transaksikan Match"**. Tampilkan toast notifikasi "Transaksi Sukses!".
5. **Dampak Real-time:** Pindah ke Tab **Impact Dashboard**, tunjukkan metrik berubah secara langsung (+300 Kg Limbah Dialihkan, +375 kg CO₂e Offset).

---

## ⏱️ 7. Roadmap Pelaksanaan & Definition of Done (Frontend)

* [ ] **Langkah 1 (Jam 0.00 - 0.45):** Setup Project (React/Next.js), Konfigurasi Tailwind CSS (Color Tokens), & Shell Component.
* [ ] **Langkah 2 (Jam 0.45 - 1.30):** Pembuatan Komponen Catalog, Card Item, & Modal Form Input Resource.
* [ ] **Langkah 3 (Jam 1.30 - 2.30):** Pembuatan Komponen Search Requirement & Scoring Result View.
* [ ] **Langkah 4 (Jam 2.30 - 3.15):** Integrasi API Layer ke `src/services/api.js` & Penanganan Loading/Error Toast State.
* [ ] **Langkah 5 (Jam 3.15 - 3.45):** Dry-run pengujian alur demo *Golden Path* bersama Role 1 & Role 3.

### Definition of Done (DoD):
* Antarmuka bersih, bebas dari *horizontal scrollbar* pada layar desktop dan tablet.
* Alur pencarian match hingga transaksi sukses dapat didemokan secara mulus dalam waktu < 2 menit.
```

***

The complete Markdown file for **Role 2 (Frontend Developer)** has been generated above. It follows all specifications, code structures, and design tokens required for the ReSource platform.