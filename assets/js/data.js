/**
 * data.js — Mock database using localStorage
 *
 * All names, locations, prices, quantities, and metrics below are
 * DUMMY DATA for demo purposes only, not real market data.
 *
 * In production this would be replaced by PostgreSQL / Supabase.
 */

const STORAGE_KEY = 'resource-demo-data';

const initialData = {
  metrics: {
    totalResourcesMatchedKg: 0,
    totalTransactions: 0,
    estimatedBuyerSavingsIdr: 0,
    platformRevenueIdr: 0,
  },

  categories: [
    { id: 1, name: 'Serbuk Kayu',    slug: 'serbuk-kayu',    icon: 'layers'   },
    { id: 2, name: 'Ampas Kopi',     slug: 'ampas-kopi',     icon: 'coffee'   },
    { id: 3, name: 'Potongan Kain',  slug: 'potongan-kain',  icon: 'scissors' },
    { id: 4, name: 'Potongan Kayu',  slug: 'potongan-kayu',  icon: 'trees'    },
  ],

  businesses: [
    { id: 'biz-01', name: 'Karya Kayu Workshop',    businessType: 'Workshop Furnitur',           address: 'Area Sukoharjo', city: 'Sukoharjo', phone: '0812-0000-0001', rating: 4.7 },
    { id: 'biz-02', name: 'EcoForm Studio',         businessType: 'UMKM Produk Olahan Kayu',     address: 'Area Surakarta', city: 'Surakarta', phone: '0812-0000-0002', rating: 4.8 },
    { id: 'biz-03', name: 'Kopi Tengah Kota',       businessType: 'Coffee Roastery',             address: 'Area Surakarta', city: 'Surakarta', phone: '0812-0000-0003', rating: 4.6 },
    { id: 'biz-04', name: 'GreenCraft Collective',  businessType: 'UMKM Produk Ramah Lingkungan',address: 'Area Surakarta', city: 'Surakarta', phone: '0812-0000-0004', rating: 4.9 },
  ],

  resources: [
    {
      id: 'res-01', providerId: 'biz-01', categoryId: 1,
      title: 'Serbuk Kayu Produksi',
      description: 'Serbuk kayu kering dari produksi furnitur.',
      quantityKg: 500, indicativePricePerKg: 500, qualityGrade: 'A',
      availableDate: '2026-10-15', location: 'Sukoharjo', status: 'available',
    },
    {
      id: 'res-02', providerId: 'biz-03', categoryId: 2,
      title: 'Ampas Kopi Kering',
      description: 'Ampas kopi kering untuk pemanfaatan non-pangan.',
      quantityKg: 120, indicativePricePerKg: 2500, qualityGrade: 'A',
      availableDate: '2026-10-15', location: 'Surakarta', status: 'available',
    },
    {
      id: 'res-03', providerId: 'biz-01', categoryId: 3,
      title: 'Potongan Kain Katun',
      description: 'Potongan kain sisa produksi yang telah dipilah.',
      quantityKg: 180, indicativePricePerKg: 4500, qualityGrade: 'B',
      availableDate: '2026-10-16', location: 'Sukoharjo', status: 'available',
    },
    {
      id: 'res-04', providerId: 'biz-01', categoryId: 4,
      title: 'Potongan Kayu Kecil',
      description: 'Potongan kayu untuk kerajinan atau produk kecil.',
      quantityKg: 220, indicativePricePerKg: 700, qualityGrade: 'A',
      availableDate: '2026-10-15', location: 'Sukoharjo', status: 'available',
    },
  ],

  demands: [
    {
      id: 'dem-01', buyerId: 'biz-02', categoryId: 1,
      quantityNeededKg: 300, maxPricePerKg: 650, requiredQuality: 'A',
      location: 'Surakarta', neededDate: '2026-10-17', status: 'open',
    },
    {
      id: 'dem-02', buyerId: 'biz-04', categoryId: 2,
      quantityNeededKg: 50, maxPricePerKg: 3000, requiredQuality: 'A',
      location: 'Surakarta', neededDate: '2026-10-17', status: 'open',
    },
  ],

  matches: [],
  transactions: [],
};

/**
 * Load data from localStorage, seeding with initialData if not present.
 * @returns {object} The current application data object.
 */
function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return structuredClone(initialData);
}

/**
 * Persist the current data object back to localStorage.
 * @param {object} data
 */
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Reset storage to the initial seed data (useful for demos).
 */
function resetData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
}

/**
 * Calculate impact metrics from completed transactions.
 *
 * This is the authoritative source for dashboard numbers, replacing the
 * `system_impact_summary` table referenced in Dok 03 §23/42 (which is not
 * in the MVP DDL). For the localStorage mock, metrics are re-derived from
 * `transactions` on demand rather than maintained as a separate summary row.
 *
 * Dok 02 §6 canonical formula:
 *   totalResourcesMatchedKg  = Σ quantityKg   (status = 'completed')
 *   totalTransactions        = count           (status = 'completed')
 *   estimatedBuyerSavingsIdr = Σ buyerSaving   (status = 'completed')
 *   platformRevenueIdr       = Σ platformFee   (status = 'completed')
 *
 * @param {object[]} transactions - Array of transaction records from storage.
 * @returns {{ totalResourcesMatchedKg: number, totalTransactions: number,
 *             estimatedBuyerSavingsIdr: number, platformRevenueIdr: number }}
 */
function calculateImpact(transactions) {
  const completed = transactions.filter((tx) => tx.status === 'completed');
  return {
    totalResourcesMatchedKg:  completed.reduce((sum, tx) => sum + tx.quantityKg, 0),
    totalTransactions:         completed.length,
    estimatedBuyerSavingsIdr: completed.reduce((sum, tx) => sum + tx.buyerSaving, 0),
    platformRevenueIdr:        completed.reduce((sum, tx) => sum + tx.platformFee, 0),
  };
}

/**
 * Persist updated impact metrics back to the `metrics` field in storage.
 *
 * Call this after every confirmed transaction so that `loadData().metrics`
 * always reflects the latest aggregate state (mirrors what a real
 * `system_impact_summary` table would do in PostgreSQL).
 *
 * @returns {void}
 */
function updateMetrics() {
  const data = loadData();
  data.metrics = calculateImpact(data.transactions);
  saveData(data);
}

// =============================================================================
// MATCHING ENGINE — PURE CALCULATION FUNCTIONS
// (Dok 02 §5A + Dok 03 §12–16; no side effects, no DB access)
// =============================================================================

/**
 * Calculate the weighted match score from four component scores.
 *
 * Formula (Dok 02 §5A = Dok 03 §12):
 *   matchScore = material×0.40 + quantity×0.30 + distance×0.20 + availability×0.10
 *
 * @param {{ material: number, quantity: number, distance: number, availability: number }} scores
 * @returns {number} 0–100
 */
function calculateMatchScore(scores) {
  return (
    scores.material     * 0.40 +
    scores.quantity     * 0.30 +
    scores.distance     * 0.20 +
    scores.availability * 0.10
  );
}

/**
 * Calculate material compatibility score.
 *
 * MVP rule (Dok 03 §13): same category = 100, different = 0.
 *
 * @param {number} listingCategoryId
 * @param {number} requestCategoryId
 * @returns {number} 0 or 100
 */
function calculateMaterialScore(listingCategoryId, requestCategoryId) {
  return Number(listingCategoryId) === Number(requestCategoryId) ? 100 : 0;
}

/**
 * Calculate quantity compatibility score.
 *
 * Canonical formula (Dok 02 §5A, confirmed by Dok 03 §14):
 *   score = min((resourceKg / demandKg) × 100, 100)
 *
 * Interpretation: "how well does the available stock cover the buyer's need?"
 *   - resourceKg >= demandKg → score = 100  (fully covered)
 *   - resourceKg < demandKg  → score proportional (partial coverage)
 *
 * Note: Dok 03 §14 example (300/500 = 60) was written from the buyer's
 * perspective but the formula above from Dok 02 §5A is authoritative.
 * When stock (500) >= demand (300): min(500/300×100, 100) = 100.
 * When stock (200) < demand (300): min(200/300×100, 100) ≈ 67.
 *
 * @param {number} resourceKg  - Available quantity from supplier.
 * @param {number} demandKg    - Quantity needed by buyer.
 * @returns {number} 0–100
 */
function calculateQuantityScore(resourceKg, demandKg) {
  if (demandKg <= 0) return 0;
  return Math.min((resourceKg / demandKg) * 100, 100);
}

/**
 * Calculate distance score from estimated distance in kilometres.
 *
 * Tier table (Dok 02 §5A):
 *   0–5 km  → 100
 *   6–10 km → 90
 *   11–20 km→ 75
 *   21–30 km→ 60
 *   >30 km  → 40
 *
 * Fallback: if distanceKm is null/undefined (coordinates unavailable),
 * returns 60 (neutral mid-tier) so matching does not produce NaN.
 * (Dok 03 §15 requires a non-NaN fallback.)
 *
 * @param {number|null} distanceKm
 * @returns {number} 0–100
 */
function calculateDistanceScore(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return 60; // neutral fallback — Dok 03 §15
  }
  if (distanceKm <=  5) return 100;
  if (distanceKm <= 10) return  90;
  if (distanceKm <= 20) return  75;
  if (distanceKm <= 30) return  60;
  return 40;
}

/**
 * Calculate availability score.
 *
 * MVP rule (Dok 02 §5A + Dok 03 §16):
 *   resource available on/before neededDate → 100
 *   resource available after neededDate     →   0
 *
 * @param {string} availableDate - Resource available_date (YYYY-MM-DD).
 * @param {string} neededDate    - Demand needed_date (YYYY-MM-DD).
 * @returns {number} 0 or 100
 */
function calculateAvailabilityScore(availableDate, neededDate) {
  const avail  = new Date(availableDate);
  const needed = new Date(neededDate);
  if (isNaN(avail.getTime()) || isNaN(needed.getTime())) return 0;
  return avail <= needed ? 100 : 0;
}
