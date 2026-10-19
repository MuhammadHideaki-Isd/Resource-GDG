/**
 * resourceRepository.js — Persistence layer for resource listings.
 *
 * This module is the ONLY place that reads and writes resource records to
 * the localStorage mock database.  No business logic lives here.
 *
 * Contract (mirrors the SQL `resources` table from doc 02):
 *   id               VARCHAR(36) PK
 *   providerId       FK → businesses.id
 *   categoryId       INT FK → categories.id
 *   title            VARCHAR(200) NOT NULL
 *   description      TEXT nullable
 *   quantityKg       DECIMAL >= 0
 *   indicativePricePerKg  DECIMAL >= 0
 *   qualityGrade     VARCHAR(30) nullable
 *   availableDate    DATE NOT NULL
 *   location         VARCHAR(150) NOT NULL
 *   status           'available' | 'reserved' | 'matched' | 'inactive'
 *
 * Dependencies (must be loaded before this file):
 *   - assets/js/data.js  (loadData, saveData)
 *   - assets/js/utils/generateId.js  (generateId)
 */

const ResourceRepository = (() => {
  // ---------------------------------------------------------------------------
  // READ
  // ---------------------------------------------------------------------------

  /**
   * Retrieve resources, optionally filtered.
   *
   * @param {object} [filters]
   * @param {number}  [filters.categoryId]   - Filter by category ID.
   * @param {string}  [filters.status]       - Filter by status string.
   * @param {number}  [filters.limit=50]     - Maximum records to return.
   * @returns {object[]} Array of resource records (minimal fields).
   */
  function findMany(filters = {}) {
    const data = loadData();
    const { categoryId, status, limit = 50 } = filters;

    let results = data.resources;

    if (categoryId !== undefined) {
      results = results.filter((r) => r.categoryId === Number(categoryId));
    }

    if (status !== undefined) {
      results = results.filter((r) => r.status === status);
    }

    // Return a shallow copy of each record shaped as the minimal list DTO
    // (Dok 03 §8.3) — never expose the full internal record to the UI layer.
    return results.slice(0, limit).map(_toListDTO);
  }

  /**
   * Retrieve a single resource by its primary key.
   *
   * @param {string} id
   * @returns {object|null} Resource DTO or null when not found.
   */
  function findById(id) {
    const data = loadData();
    const record = data.resources.find((r) => r.id === id);
    return record ? _toFullDTO(record) : null;
  }

  // ---------------------------------------------------------------------------
  // WRITE
  // ---------------------------------------------------------------------------

  /**
   * Persist a new resource record.
   *
   * The repository assigns the `id` and enforces the default `status`.
   * All other fields must already be validated by the service layer.
   *
   * @param {object} resourceData - Validated resource fields (no id / status).
   * @returns {{ id: string, status: string }} Minimal creation result DTO.
   */
  function create(resourceData) {
    const data = loadData();

    const newRecord = {
      id: generateId(),
      providerId:          resourceData.providerId,
      categoryId:          resourceData.categoryId,
      title:               resourceData.title,
      description:         resourceData.description ?? null,
      quantityKg:          resourceData.quantityKg,
      indicativePricePerKg: resourceData.indicativePricePerKg,
      qualityGrade:        resourceData.qualityGrade ?? null,
      availableDate:       resourceData.availableDate,
      location:            resourceData.location,
      status:              'available', // default per schema
    };

    data.resources.push(newRecord);
    saveData(data);

    // Return the minimal creation DTO — never the full row.
    return { id: newRecord.id, status: newRecord.status };
  }

  /**
   * Update specific fields on an existing resource record.
   *
   * @param {string} id
   * @param {object} updates - Only the fields that should change.
   * @returns {object|null} Updated DTO, or null if not found.
   */
  function update(id, updates) {
    const data = loadData();
    const index = data.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;

    data.resources[index] = { ...data.resources[index], ...updates };
    saveData(data);
    return _toFullDTO(data.resources[index]);
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Checks whether a given category ID exists in the seed data.
   *
   * @param {number} categoryId
   * @returns {boolean}
   */
  function categoryExists(categoryId) {
    const data = loadData();
    return data.categories.some((c) => c.id === Number(categoryId));
  }

  /**
   * Checks whether a given business ID exists in the seed data.
   *
   * @param {string} businessId
   * @returns {boolean}
   */
  function businessExists(businessId) {
    const data = loadData();
    return data.businesses.some((b) => b.id === businessId);
  }

  // ---------------------------------------------------------------------------
  // INTERNAL — shape the outbound DTOs
  // ---------------------------------------------------------------------------

  /**
   * Map an internal storage record to the list DTO used by GET /resources.
   *
   * Returns only the fields defined in Dok 03 §8.3 (minimal UI contract).
   * Never include fields that the catalog UI does not consume.
   *
   * Dok 03 §8.3 minimal fields:
   *   id, material (= title), quantityAvailable (= quantityKg), unit (default 'kg'),
   *   pricePerUnit (= indicativePricePerKg), availableFrom (= availableDate),
   *   businessName (resolved from businesses), city (= location), status
   *
   * @param {object} record - Raw storage record.
   * @returns {object} Minimal list DTO for the UI.
   */
  function _toListDTO(record) {
    // Resolve businessName from storage so the UI does not need a second call.
    const data   = loadData();
    const biz    = data.businesses.find((b) => b.id === record.providerId);
    const bizName = biz ? biz.name : '';
    const bizCity = biz ? biz.city : record.location;

    return {
      id:                record.id,
      material:          record.title,             // human-readable material name
      quantityAvailable: record.quantityKg,
      unit:              'kg',                     // unit is always kg in DDL
      pricePerUnit:      record.indicativePricePerKg,
      availableFrom:     record.availableDate,
      businessName:      bizName,
      city:              bizCity,
      status:            record.status,
    };
  }

  /**
   * Map an internal storage record to the full internal DTO.
   * Used by getResourceById and internal service lookups — not sent to the UI directly.
   *
   * @param {object} record - Raw storage record.
   * @returns {object} Full resource DTO (matches DDL column set).
   */
  function _toFullDTO(record) {
    return {
      id:                   record.id,
      providerId:           record.providerId,
      categoryId:           record.categoryId,
      title:                record.title,
      description:          record.description,
      quantityKg:           record.quantityKg,
      indicativePricePerKg: record.indicativePricePerKg,
      qualityGrade:         record.qualityGrade,
      availableDate:        record.availableDate,
      location:             record.location,
      status:               record.status,
    };
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    findMany,
    findById,
    create,
    update,
    categoryExists,
    businessExists,
  };
})();
