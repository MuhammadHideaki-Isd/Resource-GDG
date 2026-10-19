/**
 * resourceEndpoint.test.js
 *
 * Unit tests for the POST /resources layered stack:
 *   ResourceController → ResourceService → ResourceRepository → localStorage
 *
 * Run in a browser console or with a test harness that provides the globals
 * loaded by index.html (data.js, generateId.js, resourceRepository.js,
 * resourceService.js, resourceController.js).
 *
 * For Node.js usage add a minimal localStorage polyfill (see bottom of file).
 */

/* -------------------------------------------------------------------------- */
/* Minimal test runner                                                         */
/* -------------------------------------------------------------------------- */

const _tests   = [];
const _results = { passed: 0, failed: 0, errors: [] };

function describe(suiteName, fn) {
  console.groupCollapsed(`Suite: ${suiteName}`);
  fn();
  console.groupEnd();
}

function it(label, fn) {
  _tests.push({ label, fn });
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const e = JSON.stringify(expected);
      if (a !== e) {
        throw new Error(`Expected ${e}, got ${a}`);
      }
    },
    toBeDefined() {
      if (actual === undefined || actual === null) {
        throw new Error(`Expected value to be defined, got ${actual}`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTrue() {
      if (actual !== true) {
        throw new Error(`Expected true, got ${actual}`);
      }
    },
    toBeFalse() {
      if (actual !== false) {
        throw new Error(`Expected false, got ${actual}`);
      }
    },
    toContain(substring) {
      if (typeof actual !== 'string' || !actual.includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) {
        throw new Error(`Expected ${actual} > ${n}`);
      }
    },
  };
}

function runAll() {
  for (const test of _tests) {
    try {
      test.fn();
      console.log(`  ✓ ${test.label}`);
      _results.passed++;
    } catch (err) {
      console.error(`  ✗ ${test.label}\n    ${err.message}`);
      _results.failed++;
      _results.errors.push({ label: test.label, message: err.message });
    }
  }
  console.log(`\nResults: ${_results.passed} passed, ${_results.failed} failed`);
  return _results;
}

/* -------------------------------------------------------------------------- */
/* Test helpers                                                                */
/* -------------------------------------------------------------------------- */

/** Reset storage to seed data before each test suite. */
function resetStorage() {
  resetData(); // defined in data.js
}

/** Build a valid POST /resources request body. */
function validBody(overrides = {}) {
  return Object.assign({
    businessId:        'biz-01',
    categoryId:        1,
    quantityAvailable: 200,
    unit:              'kg',
    pricePerUnit:      600,
    availableFrom:     '2026-10-20',
    availableUntil:    null,
    notes:             'Test notes',
  }, overrides);
}

/* -------------------------------------------------------------------------- */
/* Suite 1 — POST /resources: happy path                                      */
/* -------------------------------------------------------------------------- */

describe('POST /resources — happy path', () => {
  resetStorage();

  it('returns ok=true and status 201 on valid input', () => {
    const res = ResourceController.createResource({ body: validBody() });
    expect(res.ok).toBeTrue();
    expect(res.status).toBe(201);
  });

  it('response data contains id and status', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody() });
    expect(res.data.id).toBeDefined();
    expect(res.data.status).toBe('available');
  });

  it('response data does NOT contain raw storage fields like quantityKg', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody() });
    // The creation DTO must only have id and status
    const keys = Object.keys(res.data);
    expect(keys.length).toBe(2);
  });

  it('persists the new resource in localStorage (round-trip)', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody() });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored).toBeDefined();
    expect(stored.status).toBe('available');
  });

  it('quantityKg in storage matches quantityAvailable in request', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ quantityAvailable: 350 }) });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored.quantityKg).toBe(350);
  });

  it('indicativePricePerKg in storage matches pricePerUnit in request', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ pricePerUnit: 750 }) });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored.indicativePricePerKg).toBe(750);
  });

  it('availableDate in storage is date-only (no time component)', () => {
    resetStorage();
    const res = ResourceController.createResource({
      body: validBody({ availableFrom: '2026-10-20T08:00:00' }),
    });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored.availableDate).toBe('2026-10-20');
  });

  it('description in storage equals notes from request', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ notes: 'Kayu kering' }) });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored.description).toBe('Kayu kering');
  });

  it('description is null when notes is absent', () => {
    resetStorage();
    const body = validBody();
    delete body.notes;
    const res = ResourceController.createResource({ body });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    expect(stored.description).toBeNull();
  });

  it('location in storage is derived from the business city', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ businessId: 'biz-01' }) });
    const stored = loadData().resources.find((r) => r.id === res.data.id);
    // biz-01 is in Sukoharjo
    expect(stored.location).toBe('Sukoharjo');
  });

  it('each new resource receives a unique ID (idempotence check)', () => {
    resetStorage();
    const res1 = ResourceController.createResource({ body: validBody() });
    const res2 = ResourceController.createResource({ body: validBody() });
    const differentIds = res1.data.id !== res2.data.id;
    expect(differentIds).toBeTrue();
  });
});

/* -------------------------------------------------------------------------- */
/* Suite 2 — POST /resources: validation errors                               */
/* -------------------------------------------------------------------------- */

describe('POST /resources — validation errors (400)', () => {
  it('returns 400 when businessId is missing', () => {
    const body = validBody();
    delete body.businessId;
    const res = ResourceController.createResource({ body });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
    expect(res.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when categoryId is missing', () => {
    const body = validBody();
    delete body.categoryId;
    const res = ResourceController.createResource({ body });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('returns 400 when quantityAvailable is 0', () => {
    const res = ResourceController.createResource({ body: validBody({ quantityAvailable: 0 }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
    expect(res.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when quantityAvailable is negative', () => {
    const res = ResourceController.createResource({ body: validBody({ quantityAvailable: -10 }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('returns 400 when pricePerUnit is negative', () => {
    const res = ResourceController.createResource({ body: validBody({ pricePerUnit: -1 }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('accepts pricePerUnit = 0 (free resource is valid)', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ pricePerUnit: 0 }) });
    expect(res.ok).toBeTrue();
    expect(res.status).toBe(201);
  });

  it('returns 400 when availableFrom is missing', () => {
    const body = validBody();
    delete body.availableFrom;
    const res = ResourceController.createResource({ body });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('returns 400 when availableFrom is not a valid date', () => {
    const res = ResourceController.createResource({ body: validBody({ availableFrom: 'not-a-date' }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('returns 400 when availableUntil is before availableFrom', () => {
    const res = ResourceController.createResource({
      body: validBody({ availableFrom: '2026-10-20', availableUntil: '2026-10-19' }),
    });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(400);
  });

  it('accepts availableUntil equal to availableFrom', () => {
    resetStorage();
    const res = ResourceController.createResource({
      body: validBody({ availableFrom: '2026-10-20', availableUntil: '2026-10-20' }),
    });
    expect(res.ok).toBeTrue();
  });

  it('error response does NOT contain a data key', () => {
    const body = validBody({ quantityAvailable: 0 });
    const res = ResourceController.createResource({ body });
    expect(res.data === undefined).toBeTrue();
  });

  it('does NOT persist anything on validation failure', () => {
    resetStorage();
    const before = loadData().resources.length;
    ResourceController.createResource({ body: validBody({ quantityAvailable: -5 }) });
    const after = loadData().resources.length;
    expect(after).toBe(before);
  });
});

/* -------------------------------------------------------------------------- */
/* Suite 3 — POST /resources: FK not-found errors                             */
/* -------------------------------------------------------------------------- */

describe('POST /resources — FK not-found errors (404)', () => {
  it('returns 404 when categoryId does not exist', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ categoryId: 9999 }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(404);
    expect(res.error.code).toBe('NOT_FOUND');
  });

  it('returns 404 when businessId does not exist', () => {
    resetStorage();
    const res = ResourceController.createResource({ body: validBody({ businessId: 'biz-unknown' }) });
    expect(res.ok).toBeFalse();
    expect(res.status).toBe(404);
    expect(res.error.code).toBe('NOT_FOUND');
  });

  it('does NOT persist anything on FK error', () => {
    resetStorage();
    const before = loadData().resources.length;
    ResourceController.createResource({ body: validBody({ categoryId: 9999 }) });
    const after = loadData().resources.length;
    expect(after).toBe(before);
  });
});

/* -------------------------------------------------------------------------- */
/* Suite 4 — GET /resources                                                   */
/* -------------------------------------------------------------------------- */

describe('GET /resources', () => {
  it('returns ok=true and status 200', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: {} });
    expect(res.ok).toBeTrue();
    expect(res.status).toBe(200);
  });

  it('returns the seeded resources array', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: {} });
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('filters by categoryId', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: { categoryId: 1 } });
    // List DTO uses 'material' (title) not categoryId — verify all returned
    // items are serbuk-kayu listings (categoryId 1 in seed data).
    // We confirm filtering worked by checking count against seed data.
    const seed = loadData().resources.filter((r) => r.categoryId === 1);
    expect(res.data.length).toBe(seed.length);
  });

  it('filters by status', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: { status: 'available' } });
    const allMatch = res.data.every((r) => r.status === 'available');
    expect(allMatch).toBeTrue();
  });

  it('respects limit param', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: { limit: 2 } });
    expect(res.data.length).toBe(2);
  });
});

/* -------------------------------------------------------------------------- */
/* Suite 5 — Pure function: _validateCreateInput (via service boundary)       */
/* -------------------------------------------------------------------------- */

describe('Service — validation is pure (same input, same output)', () => {
  it('identical invalid input always returns the same error set', () => {
    const body = validBody({ quantityAvailable: 0 });
    const res1 = ResourceController.createResource({ body });
    const res2 = ResourceController.createResource({ body });
    expect(res1.error.message).toBe(res2.error.message);
  });
});

/* -------------------------------------------------------------------------- */
/* Suite 6 — Pure calculation functions (data.js)                             */
/* -------------------------------------------------------------------------- */

describe('calculateMatchScore — weighted formula (Dok 02 §5A)', () => {
  it('returns 84 for the canonical Dok 03 §12 example', () => {
    const score = calculateMatchScore({ material: 100, quantity: 60, distance: 90, availability: 100 });
    expect(score).toBe(84);
  });

  it('returns 100 when all components are 100', () => {
    expect(calculateMatchScore({ material: 100, quantity: 100, distance: 100, availability: 100 })).toBe(100);
  });

  it('returns 0 when all components are 0', () => {
    expect(calculateMatchScore({ material: 0, quantity: 0, distance: 0, availability: 0 })).toBe(0);
  });
});

describe('calculateMaterialScore — category match (Dok 03 §13)', () => {
  it('returns 100 when category IDs match', () => {
    expect(calculateMaterialScore(1, 1)).toBe(100);
  });

  it('returns 0 when category IDs differ', () => {
    expect(calculateMaterialScore(1, 2)).toBe(0);
  });
});

describe('calculateQuantityScore — Dok 02 §5A formula', () => {
  it('returns 100 when stock equals demand', () => {
    expect(calculateQuantityScore(300, 300)).toBe(100);
  });

  it('returns 100 when stock exceeds demand', () => {
    expect(calculateQuantityScore(500, 300)).toBe(100);
  });

  it('returns proportional score when stock is less than demand', () => {
    // 200 / 300 × 100 = 66.66…
    const score = calculateQuantityScore(200, 300);
    expect(score > 66 && score < 67).toBeTrue();
  });

  it('returns 0 when demandKg is 0 (guard against division by zero)', () => {
    expect(calculateQuantityScore(500, 0)).toBe(0);
  });
});

describe('calculateDistanceScore — tier table (Dok 02 §5A)', () => {
  it('returns 100 for 0 km', ()  => { expect(calculateDistanceScore(0)).toBe(100); });
  it('returns 100 for 5 km', ()  => { expect(calculateDistanceScore(5)).toBe(100); });
  it('returns 90 for 6 km',  ()  => { expect(calculateDistanceScore(6)).toBe(90); });
  it('returns 90 for 10 km', ()  => { expect(calculateDistanceScore(10)).toBe(90); });
  it('returns 75 for 11 km', ()  => { expect(calculateDistanceScore(11)).toBe(75); });
  it('returns 60 for 21 km', ()  => { expect(calculateDistanceScore(21)).toBe(60); });
  it('returns 40 for 31 km', ()  => { expect(calculateDistanceScore(31)).toBe(40); });
  it('returns 60 (neutral fallback) for null', () => {
    expect(calculateDistanceScore(null)).toBe(60);
  });
});

describe('calculateAvailabilityScore — date compatibility (Dok 02 §5A)', () => {
  it('returns 100 when resource is available before needed date', () => {
    expect(calculateAvailabilityScore('2026-10-15', '2026-10-17')).toBe(100);
  });

  it('returns 100 when available date equals needed date', () => {
    expect(calculateAvailabilityScore('2026-10-17', '2026-10-17')).toBe(100);
  });

  it('returns 0 when resource available after needed date', () => {
    expect(calculateAvailabilityScore('2026-10-20', '2026-10-17')).toBe(0);
  });
});

describe('calculateImpact — dashboard metrics from transactions (Dok 02 §6)', () => {
  it('returns all zeros when transactions array is empty', () => {
    const result = calculateImpact([]);
    expect(result.totalResourcesMatchedKg).toBe(0);
    expect(result.totalTransactions).toBe(0);
    expect(result.estimatedBuyerSavingsIdr).toBe(0);
    expect(result.platformRevenueIdr).toBe(0);
  });

  it('only counts completed transactions', () => {
    const txs = [
      { status: 'completed', quantityKg: 300, buyerSaving: 45000, platformFee: 7500 },
      { status: 'pending',   quantityKg: 100, buyerSaving: 10000, platformFee: 2500 },
      { status: 'cancelled', quantityKg: 200, buyerSaving: 20000, platformFee: 5000 },
    ];
    const result = calculateImpact(txs);
    expect(result.totalTransactions).toBe(1);
    expect(result.totalResourcesMatchedKg).toBe(300);
    expect(result.estimatedBuyerSavingsIdr).toBe(45000);
    expect(result.platformRevenueIdr).toBe(7500);
  });

  it('sums multiple completed transactions correctly', () => {
    const txs = [
      { status: 'completed', quantityKg: 300, buyerSaving: 45000, platformFee: 7500 },
      { status: 'completed', quantityKg: 100, buyerSaving: 15000, platformFee: 3000 },
    ];
    const result = calculateImpact(txs);
    expect(result.totalTransactions).toBe(2);
    expect(result.totalResourcesMatchedKg).toBe(400);
    expect(result.estimatedBuyerSavingsIdr).toBe(60000);
    expect(result.platformRevenueIdr).toBe(10500);
  });
});

describe('GET /resources list DTO — Dok 03 §8.3 fields', () => {
  it('list DTO has the Dok 03 §8.3 minimal fields', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: {} });
    const item = res.data[0];
    const keys = Object.keys(item).sort();
    const expected = ['availableFrom', 'businessName', 'city', 'id', 'material',
                      'pricePerUnit', 'quantityAvailable', 'status', 'unit'].sort();
    expect(JSON.stringify(keys)).toBe(JSON.stringify(expected));
  });

  it('list DTO material field equals the resource title', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: {} });
    const stored = loadData().resources[0];
    expect(res.data[0].material).toBe(stored.title);
  });

  it('list DTO businessName is resolved from businesses', () => {
    resetStorage();
    const res = ResourceController.getResources({ query: {} });
    // res-01 belongs to biz-01 = "Karya Kayu Workshop"
    const item = res.data.find((r) => r.id === 'res-01');
    expect(item.businessName).toBe('Karya Kayu Workshop');
  });
});

/* -------------------------------------------------------------------------- */
/* Run                                                                         */
/* -------------------------------------------------------------------------- */

runAll();

/* -------------------------------------------------------------------------- */
/* Node.js polyfill (optional — paste above runAll() when running under Node) */
/* -------------------------------------------------------------------------- */
/*
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem:    (k)    => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v); },
    removeItem: (k)    => { delete store[k]; },
  };
}
*/
