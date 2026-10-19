# Requirements Document

## Introduction

This feature implements the `POST /resources` endpoint for the ReSource B2B Resource Matching & Circular Value Platform MVP. The endpoint allows a supplier business to publish an underutilised material listing so that it becomes discoverable by buyer businesses through the Smart Matching Engine.

The implementation uses a JavaScript localStorage mock database (no PostgreSQL yet) and follows a strict layered architecture: Controller → Service → Repository → Storage. All business rules are enforced in the service layer; the controller only parses input and maps responses.

## Glossary

- **Resource**: A material listing created by a supplier business (maps to the `resources` table).
- **Provider**: A `Business` acting as the supplier that owns a Resource.
- **Category**: A predefined material type (e.g. Serbuk Kayu, Ampas Kopi) stored in the `categories` table.
- **Controller**: The HTTP-layer adapter that reads requests and writes responses.
- **Service**: The use-case / business-rule layer that validates and orchestrates operations.
- **Repository**: The persistence layer that reads from and writes to localStorage.
- **Storage**: The localStorage mock database seeded by `initialData` in `data.js`.
- **DTO**: Data Transfer Object — a minimal, shaped subset of a storage record returned to callers.
- **Validation_Error**: A structured error with `code = "VALIDATION_ERROR"` raised when input violates business rules.
- **Not_Found_Error**: A structured error with `code = "NOT_FOUND"` raised when a referenced FK record does not exist.

---

## Requirements

### Requirement 1: Create Resource via POST /resources

**User Story:** As a supplier business, I want to submit a new material listing through the POST /resources endpoint, so that the resource becomes available in the catalog for buyer matching.

#### Acceptance Criteria

1. WHEN a POST /resources request is received with a request body containing all required fields (`businessId`, `categoryId`, `quantityAvailable`, `unit`, `pricePerUnit`, `availableFrom`), THE Controller SHALL delegate the input to the Service and return HTTP 201 with a JSON body `{ "data": { "id": "<uuid>", "status": "available" } }`.
2. IF the POST /resources request body is missing one or more required fields or any field fails type validation, THEN THE Controller SHALL return HTTP 400 with a JSON body containing an error object indicating which field is invalid or missing.
3. WHEN the Service creates a new resource, THE Service SHALL generate a UUID v4 string as the unique identifier and set the initial status to `"available"`.
4. WHEN the Repository is called to create a resource, THE Repository SHALL append the new resource record to the `resources` array in localStorage and call `saveData` before returning; IF `saveData` throws an error, THEN THE Repository SHALL propagate the error and THE Controller SHALL return HTTP 500 with a JSON body containing an error message indicating a storage failure.
5. THE Controller SHALL return only the minimal creation DTO `{ id, status }` and SHALL NOT return the full storage record in the response body.

---

### Requirement 2: Input Validation — Required Fields

**User Story:** As a system, I want every incoming resource creation request to be validated before touching storage, so that corrupt or incomplete records are never persisted.

#### Acceptance Criteria

1. WHEN the request body is missing `businessId`, or `businessId` is null, undefined, or a whitespace-only string, THE Service SHALL throw a Validation_Error with `field = "businessId"` before accessing the Repository.
2. WHEN the request body is missing `categoryId`, or `categoryId` is not an integer in the range 1–2,147,483,647, THE Service SHALL throw a Validation_Error with `field = "categoryId"`.
3. WHEN `quantityAvailable` is absent, zero, negative, or greater than 999,999, THE Service SHALL throw a Validation_Error with `field = "quantityAvailable"` because a listing with no material has no value.
4. WHEN `pricePerUnit` is absent, less than 0.01, or greater than 999,999,999.99, THE Service SHALL throw a Validation_Error with `field = "pricePerUnit"`; a value of exactly `0` SHALL be rejected as it is not a valid indicative price.
5. WHEN `availableFrom` is absent or is not a string matching the ISO 8601 date format `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS`, THE Service SHALL throw a Validation_Error with `field = "availableFrom"`.
6. WHEN `availableUntil` is provided and its date value is less than or equal to the date value of `availableFrom`, THE Service SHALL throw a Validation_Error with `field = "availableUntil"`.
7. IF the Service throws a Validation_Error, THEN THE Controller SHALL return HTTP 400 with `{ "error": { "code": "VALIDATION_ERROR", "message": "<description>", "field": "<fieldName>" } }`.

---

### Requirement 3: Foreign Key Existence Checks

**User Story:** As a system, I want to verify that `categoryId` and `businessId` reference existing records, so that orphaned resources are never created.

#### Acceptance Criteria

1. WHEN `categoryId` passes format validation but does not match any record in `data.categories` by exact case-sensitive string equality, THE Service SHALL throw a Not_Found_Error with `field = "categoryId"` and SHALL NOT call `Repository.create`.
2. WHEN `businessId` passes format validation but does not match any record in `data.businesses` by exact case-sensitive string equality, THE Service SHALL throw a Not_Found_Error with `field = "businessId"` and SHALL NOT call `Repository.create`.
3. IF the Service throws a Not_Found_Error, THEN THE Controller SHALL return HTTP 404 with `{ "error": { "code": "NOT_FOUND", "message": "<description identifying the missing field by name>", "field": "<fieldName>" } }`.
4. IF both `categoryId` and `businessId` fail existence checks, THEN THE Service SHALL throw a Not_Found_Error for `categoryId` before checking `businessId`, and SHALL NOT call `Repository.create`.

---

### Requirement 4: Data Transformation — API Payload to Storage Record

**User Story:** As a system, I want the API payload fields to be correctly mapped to the storage schema before persisting, so that the repository always receives well-shaped data.

#### Acceptance Criteria

1. WHEN a valid request is processed, THE Service SHALL map `businessId` → `providerId`, `categoryId` → `categoryId`, `quantityAvailable` → `quantityKg`, `pricePerUnit` → `indicativePricePerKg`, `availableFrom` → `availableDate`, and `unit` → `unit`.
2. WHEN `availableFrom` contains a time component (i.e. includes a `T` character), THE Service SHALL truncate it to a date-only string in `YYYY-MM-DD` format before storing; IF `availableFrom` is already in `YYYY-MM-DD` format, THE Service SHALL store it unchanged.
3. WHEN a valid request is processed, THE Service SHALL set `location` by reading the `city` field of the `Business` record whose `id` matches `businessId` from Storage; IF no matching `Business` record exists or its `city` field is absent, THEN THE Service SHALL reject the request with an error indicating the business location could not be resolved.
4. WHEN `notes` is provided in the request, THE Service SHALL store it as `description`; IF `notes` is absent from the request, THEN THE Service SHALL store `null` for `description`.
5. WHEN a valid request is processed, THE Service SHALL compose `title` from the `quantityAvailable` value, the `unit` value, and the name of the `Category` record whose `id` matches `categoryId`; IF no matching `Category` record exists, THEN THE Service SHALL reject the request with an error indicating the category name could not be resolved.

---

### Requirement 5: Repository Write Isolation

**User Story:** As a system, I want the Repository to be the only module that writes to localStorage, so that no other layer can bypass data integrity checks.

#### Acceptance Criteria

1. THE Repository.create function SHALL be the only function in the codebase that calls `saveData` or `localStorage.setItem`.
2. THE Service layer SHALL NOT contain any direct call to `saveData` or `localStorage.setItem` in its source code.
3. THE Controller layer SHALL NOT contain any direct call to `saveData`, `localStorage.setItem`, or any Repository function in its source code.
4. WHEN `Repository.create` is called with a valid resource object (an object containing all required fields with non-empty string values and `quantityKg` greater than 0), THE Repository SHALL persist the record by calling `saveData` exactly once and return an `id` string that uniquely identifies the new record.
5. WHEN `Repository.create` has returned successfully, THE Repository SHALL ensure that a subsequent call to `loadData` returns a `resources` array containing exactly one entry whose `id` matches the `id` returned by `Repository.create`.
6. IF `Repository.create` is called with an object missing one or more required fields or containing a `quantityKg` value less than or equal to 0, THEN THE Repository SHALL NOT call `saveData` and SHALL return an error indicating the input is invalid.

---

### Requirement 6: Response Shape Contract

**User Story:** As a frontend developer, I want every API response to follow a predictable envelope shape, so that the UI can handle success and error cases uniformly.

#### Acceptance Criteria

1. THE Controller SHALL return a JavaScript object with exactly the keys `ok` (boolean), `status` (integer), and either `data` (object or array) or `error` (object), with no additional top-level keys, for every call.
2. WHEN a request succeeds, THE Controller SHALL set `ok` to `true`, set `status` to the corresponding HTTP success code, and populate `data` with the response payload; the `error` key SHALL be absent from the returned object.
3. WHEN a request fails, THE Controller SHALL set `ok` to `false`, set `status` to the corresponding HTTP error code, and populate `error` with an object containing a non-empty `code` string (maximum 64 characters) and a non-empty `message` string (maximum 280 characters); the `data` key SHALL be absent from the returned object.
4. IF the request fails due to a field-level validation error, THEN THE Controller SHALL include a `field` string in the `error` object identifying the invalid field name (maximum 128 characters).
5. THE Controller SHALL map `Validation_Error` to status 400, `Not_Found_Error` to status 404, and any other thrown value to status 500.
6. IF the Controller catches an unexpected thrown value (mapped to status 500), THEN THE Controller SHALL set `error.code` to a value indicating an internal server error and SHALL NOT include internal stack trace or system details in the `error.message`.

---

### Requirement 7: Layered Architecture Enforcement

**User Story:** As a developer, I want business logic isolated in the Service layer and persistence isolated in the Repository layer, so that each layer can be tested and replaced independently.

#### Acceptance Criteria

1. THE Controller SHALL parse the HTTP request body, call `ResourceService.createResource` with the parsed payload, and map the returned value to a response object; THE Controller SHALL NOT execute validation logic, FK existence checks, or direct localStorage access.
2. WHEN `ResourceService.createResource` returns successfully, THE Controller SHALL map the result to a success response; IF `ResourceService.createResource` throws or returns an error, THEN THE Controller SHALL map the error to a failure response without rethrowing or swallowing it silently.
3. THE Service SHALL validate input fields, check FK existence by calling Repository query methods, apply field transformations defined in the data contract, and call `Repository.create` exactly once per successful request; THE Service SHALL NOT access localStorage directly or return a success result when any validation check or FK existence check fails.
4. IF the Service detects a missing FK during an existence check, THEN THE Service SHALL return a `{ valid: false, errors }` result containing at least one entry identifying the missing FK field, without calling `Repository.create`.
5. THE Repository SHALL read from and write to the localStorage data structure only; it SHALL NOT evaluate validation conditions, enforce business rules, or branch on domain-specific field values.
6. THE Service validation functions SHALL be pure: given identical input arguments, they SHALL always return the same `{ valid, errors }` object, and they SHALL NOT access localStorage, perform network I/O, modify external variables, or produce any other externally observable effect.
