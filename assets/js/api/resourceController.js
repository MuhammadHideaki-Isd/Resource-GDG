/**
 * resourceController.js — HTTP-layer adapter for resource endpoints.
 *
 * In a real server (Node/Express) this would be a route handler.
 * For the localStorage MVP the "HTTP layer" is simulated: functions accept
 * a plain `request` object and return a plain `response` object that the
 * UI can treat exactly like a fetch() result.
 *
 * Controller responsibilities (ONLY):
 *   1. Read and parse input from the request object.
 *   2. Call the appropriate use-case in ResourceService.
 *   3. Map the result to an HTTP-style response object.
 *   4. Return the response — no business logic here.
 *
 * Controller does NOT:
 *   - Calculate Match Scores
 *   - Validate business rules
 *   - Access repositories directly
 *   - Compute transaction values
 *
 * Response shape:
 *   Success  → { ok: true,  status: 201|200, data: { ... } }
 *   Error    → { ok: false, status: 400|404|500, error: { code, message, field? } }
 *
 * Dependencies (must be loaded before this file):
 *   - assets/js/services/resourceService.js
 */

const ResourceController = (() => {

  // ---------------------------------------------------------------------------
  // POST /resources
  // ---------------------------------------------------------------------------

  /**
   * Handle POST /resources
   *
   * Creates a new resource listing.
   *
   * Expected request body:
   * {
   *   businessId:        string    — provider business ID
   *   categoryId:        number    — category FK
   *   quantityAvailable: number    — quantity in kg
   *   unit:              string?   — unit label (default: "kg")
   *   pricePerUnit:      number    — indicative price per kg
   *   availableFrom:     string    — ISO date / datetime
   *   availableUntil:    string?   — optional end of availability window
   *   notes:             string?   — optional description
   * }
   *
   * Success response  (201 Created):
   * {
   *   ok: true,
   *   status: 201,
   *   data: { id: string, status: string }
   * }
   *
   * @param {{ body: object }} request
   * @returns {{ ok: boolean, status: number, data?: object, error?: object }}
   */
  function createResource(request) {
    const body = request && request.body ? request.body : {};

    try {
      const result = ResourceService.createResource(body);

      return {
        ok:     true,
        status: 201,
        data:   result,   // { id, status }  — never the full DB row
      };

    } catch (err) {
      return _mapError(err);
    }
  }

  // ---------------------------------------------------------------------------
  // GET /resources
  // ---------------------------------------------------------------------------

  /**
   * Handle GET /resources
   *
   * Returns a filtered list of resource listings.
   *
   * Supported query params (all optional):
   *   categoryId  — filter by category
   *   status      — filter by status string (e.g. "available")
   *   limit       — max records to return (default 50)
   *
   * @param {{ query: object }} request
   * @returns {{ ok: boolean, status: number, data?: object[], error?: object }}
   */
  function getResources(request) {
    const query = request && request.query ? request.query : {};

    try {
      const filters = {};
      if (query.categoryId !== undefined) filters.categoryId = Number(query.categoryId);
      if (query.status     !== undefined) filters.status     = String(query.status);
      if (query.limit      !== undefined) filters.limit      = Number(query.limit);

      const resources = ResourceService.getResources(filters);

      return {
        ok:     true,
        status: 200,
        data:   resources,
      };

    } catch (err) {
      return _mapError(err);
    }
  }

  // ---------------------------------------------------------------------------
  // ERROR MAPPING
  // ---------------------------------------------------------------------------

  /**
   * Map a service-layer error to an HTTP-style error response.
   *
   * Error codes and HTTP statuses follow the contract in doc 03, section 44-45:
   *
   *   VALIDATION_ERROR → 400
   *   NOT_FOUND        → 404
   *   CONFLICT         → 409
   *   INTERNAL_ERROR   → 500
   *
   * @param {Error} err
   * @returns {{ ok: false, status: number, error: { code, message, field? } }}
   */
  function _mapError(err) {
    const code    = err.code    || 'INTERNAL_ERROR';
    const message = err.message || 'An unexpected error occurred.';
    const field   = err.field   || undefined;

    const statusMap = {
      VALIDATION_ERROR:     400,
      NOT_FOUND:            404,
      CONFLICT:             409,
      BUSINESS_RULE_ERROR:  422,
      INTERNAL_ERROR:       500,
    };

    const status = statusMap[code] || 500;

    return {
      ok:     false,
      status,
      error: {
        code,
        message,
        ...(field !== undefined && { field }),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    createResource,
    getResources,
  };
})();
