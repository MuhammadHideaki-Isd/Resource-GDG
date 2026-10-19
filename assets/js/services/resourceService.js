/**
 * resourceService.js — Business rules for resource listings.
 *
 * This is the use-case / service layer.  It owns:
 *   - Input validation (business rules, not HTTP concerns)
 *   - Data transformation from API payload → storage record
 *   - Delegation to ResourceRepository for all persistence
 *
 * It does NOT:
 *   - Read from `request` objects
 *   - Write HTTP responses
 *   - Calculate Match Scores
 *   - Touch demand / match / transaction data
 *
 * Dependencies (must be loaded before this file):
 *   - assets/js/repositories/resourceRepository.js
 */

const ResourceService = (() => {
  // ---------------------------------------------------------------------------
  // VALIDATION HELPERS  (pure — no side effects)
  // ---------------------------------------------------------------------------

  /**
   * Validate the fields required to create a resource.
   *
   * @param {object} input
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function _validateCreateInput(input) {
    const errors = [];

    if (!input.businessId || typeof input.businessId !== 'string' || input.businessId.trim() === '') {
      errors.push('businessId is required.');
    }

    if (input.categoryId === undefined || input.categoryId === null) {
      errors.push('categoryId is required.');
    } else if (!Number.isInteger(Number(input.categoryId)) || Number(input.categoryId) <= 0) {
      errors.push('categoryId must be a positive integer.');
    }

    // quantity > 0  (doc 02: CHECK quantity_kg >= 0, but business rule is > 0 for a new listing)
    const qty = Number(input.quantityAvailable);
    if (isNaN(qty) || qty <= 0) {
      errors.push('quantityAvailable must be a number greater than 0.');
    }

    // price >= 0  (Dok 02 DDL: CHECK indicative_price_per_kg >= 0)
    // A price of 0 is valid — it represents a free/donated resource.
    const price = Number(input.pricePerUnit);
    if (input.pricePerUnit === undefined || input.pricePerUnit === null || isNaN(price) || price < 0) {
      errors.push('pricePerUnit must be a number greater than or equal to 0.');
    }

    // availableFrom is required  (maps to available_date)
    if (!input.availableFrom || String(input.availableFrom).trim() === '') {
      errors.push('availableFrom is required.');
    } else if (isNaN(Date.parse(input.availableFrom))) {
      errors.push('availableFrom must be a valid date string.');
    }

    // availableUntil, when provided, must not be before availableFrom
    if (
      input.availableUntil &&
      String(input.availableUntil).trim() !== '' &&
      !isNaN(Date.parse(input.availableFrom))
    ) {
      if (isNaN(Date.parse(input.availableUntil))) {
        errors.push('availableUntil must be a valid date string.');
      } else if (new Date(input.availableUntil) < new Date(input.availableFrom)) {
        errors.push('availableUntil must be on or after availableFrom.');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Map an ISO datetime string to a DATE-only string (YYYY-MM-DD).
   * Ensures the storage layer always receives a plain date, matching the
   * schema column `available_date DATE NOT NULL`.
   *
   * @param {string} dateString
   * @returns {string}
   */
  function _toDateOnly(dateString) {
    return dateString.split('T')[0];
  }

  // ---------------------------------------------------------------------------
  // USE CASES
  // ---------------------------------------------------------------------------

  /**
   * Create a new resource listing.
   *
   * Flow:
   *   1. Validate input fields (business rules)
   *   2. Verify that category exists (FK check)
   *   3. Verify that business exists (FK check)
   *   4. Transform API payload → storage record shape
   *   5. Delegate persistence to ResourceRepository
   *   6. Return minimal creation result { id, status }
   *
   * @param {object} input - Raw payload from the API layer.
   * @param {string} input.businessId      - Provider business ID.
   * @param {number} input.categoryId      - Category ID (FK).
   * @param {number} input.quantityAvailable - Quantity in kg.
   * @param {string} [input.unit]          - Unit label (informational, stored in title).
   * @param {number} input.pricePerUnit    - Indicative price per kg.
   * @param {string} input.availableFrom   - ISO date or datetime string.
   * @param {string} [input.availableUntil] - Optional end of availability window.
   * @param {string} [input.notes]         - Optional description / notes.
   *
   * @returns {{ id: string, status: string }} Creation result DTO.
   *
   * @throws {ValidationError} When input fails business-rule checks.
   * @throws {NotFoundError}   When category or business does not exist.
   */
  function createResource(input) {
    // --- 1. Validate fields ---
    const { valid, errors } = _validateCreateInput(input);
    if (!valid) {
      throw _buildError('VALIDATION_ERROR', errors.join(' '), null);
    }

    // --- 2. Verify category FK ---
    if (!ResourceRepository.categoryExists(Number(input.categoryId))) {
      throw _buildError('NOT_FOUND', `Category with id ${input.categoryId} does not exist.`, 'categoryId');
    }

    // --- 3. Verify business FK ---
    if (!ResourceRepository.businessExists(input.businessId)) {
      throw _buildError('NOT_FOUND', `Business with id '${input.businessId}' does not exist.`, 'businessId');
    }

    // --- 4. Transform to storage shape ---
    //
    // The API payload uses 'unit' as a display-only label.
    // The schema stores a descriptive `title`; we compose it from quantity + unit.
    const unitLabel = (input.unit || 'kg').trim();
    const title = `${Number(input.quantityAvailable)} ${unitLabel} — ${_getCategoryName(Number(input.categoryId))}`;

    const resourceData = {
      providerId:           input.businessId,
      categoryId:           Number(input.categoryId),
      title,
      description:          input.notes ? String(input.notes).trim() : null,
      quantityKg:           Number(input.quantityAvailable),
      indicativePricePerKg: Number(input.pricePerUnit),
      qualityGrade:         null,                              // not in create form for MVP
      availableDate:        _toDateOnly(input.availableFrom),
      location:             _getBusinessCity(input.businessId), // derive from business record
    };

    // --- 5. Persist ---
    const result = ResourceRepository.create(resourceData);

    // --- 6. Return minimal DTO ---
    return result; // { id, status }
  }

  /**
   * Retrieve resource listings with optional filters.
   *
   * @param {object} [filters]
   * @param {number}  [filters.categoryId]
   * @param {string}  [filters.status]
   * @param {number}  [filters.limit]
   * @returns {object[]} Array of resource DTOs for the UI.
   */
  function getResources(filters = {}) {
    return ResourceRepository.findMany(filters);
  }

  /**
   * Retrieve a single resource by ID.
   *
   * @param {string} id
   * @returns {object} Resource DTO.
   * @throws {NotFoundError} When the resource does not exist.
   */
  function getResourceById(id) {
    const resource = ResourceRepository.findById(id);
    if (!resource) {
      throw _buildError('NOT_FOUND', `Resource with id '${id}' does not exist.`, null);
    }
    return resource;
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  /**
   * Look up the display name of a category (used for auto-generating titles).
   *
   * @param {number} categoryId
   * @returns {string}
   */
  function _getCategoryName(categoryId) {
    const data = loadData();
    const cat = data.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Material';
  }

  /**
   * Look up the city of a business (used as the resource location).
   *
   * @param {string} businessId
   * @returns {string}
   */
  function _getBusinessCity(businessId) {
    const data = loadData();
    const biz = data.businesses.find((b) => b.id === businessId);
    return biz ? biz.city : '';
  }

  /**
   * Build a structured error object that the controller layer can inspect.
   *
   * @param {string} code
   * @param {string} message
   * @param {string|null} field
   * @returns {Error}
   */
  function _buildError(code, message, field) {
    const err = new Error(message);
    err.code = code;
    err.field = field;
    return err;
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    createResource,
    getResources,
    getResourceById,
  };
})();
