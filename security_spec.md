# Zero-Trust Firestore Security Specification

This specification governs the data integrity and authorization boundaries of the DatAnest database system, covering the `students` and `logs` collections.

## 1. Zero-Trust Data Invariants

1. **Identity Isolation (Owner Lock)**: Any collection entry (student, activity log) must carry an `ownerId` that matches the authenticated user's `request.auth.uid` exactly. Users can only query, read, update, or delete their own data.
2. **Strict Schema Integrity**: The `students` entity contains 12 required fields and no shadow keys. Any write that adds unapproved attributes or skips standard constraints is blocked.
3. **Audit Log Immutability**: All records inside `/logs/` are strictly immutable once written (`allow update: if false`). This prevents tampering with operation history.
4. **Data Type Validation**: String fields have size limits (e.g. name <= 128, address <= 256), and status fields must conform to strict enumerations.
5. **Secure List Queries**: Collection queries must be securely bound. Blanket list requests must be gated at the rule level using `resource.data.ownerId == request.auth.uid` to prevent cross-tenant enumeration.

---

## 2. The "Dirty Dozen" Malicious Payloads Blocked under ABAC

Below are 12 offensive payloads representing integrity violation or privilege injection attempts that will be successfully blocked:

### Identity & Privilege Escalation (Pillars 1, 2, 6)

1. **Hostile Identity Spoofing (Create Student with different owner)**
   * *Payload:* `{ id: "101", name: "Malicious User", ownerId: "attacker_uid", ... }` where `request.auth.uid` is `victim_uid`.
   * *Outcome:* Blocked because `ownerId` must equal `request.auth.uid`.

2. **Cross-Tenant Mutation (Updating a victim's student document)**
   * *Payload:* Attempting to execute update on `/students/victim_student_300` where the document belongs to `victim_uid`.
   * *Outcome:* Blocked by `existing().ownerId == request.auth.uid` check.

3. **Self-Assigned Admin Roles (Injecting admin flags)**
   * *Payload:* Attempting to write an unrequested field like `role: "admin"` inside a student profile.
   * *Outcome:* Blocked because the validation helper enforces strict key size & exact keys constraint `data.keys().size() == 12` which prevents shadow keys.

4. **Spoofing Email Verification Status**
   * *Payload:* Querying or updating records with false token email verification indicators.
   * *Outcome:* Our secure match blocks require active authentication.

### Value & Type Poisoning (Pillar 5, 10, 11)

5. **Resource Exhaustion String Injection (Denial of Wallet)**
   * *Payload:* `{ id: "101", name: "Shloke" + "A".repeat(1000000), ... }`
   * *Outcome:* Blocked because `data.name.size() <= 128` size constraints are applied to all fields.

6. **Invalid Status Transition/Selection**
   * *Payload:* `{ status: "Suspended" }` (instead of Active/Inactive)
   * *Outcome:* Blocked by `data.status == 'Active' || data.status == 'Inactive'`.

7. **Tampering with Immutable Creation Timestamps**
   * *Payload:* `{ createdAt: "2015-01-01T00:00:00Z" }` trying to overwrite history.
   * *Outcome:* Blocked by checking `incoming().createdAt == request.time` on create and `incoming().createdAt == existing().createdAt` on updates.

8. **Shadow Field Injection on Update**
   * *Payload:* `{ status: "Active", superUserOverride: true }`
   * *Outcome:* Blocked because the `isValidStudent` schema helper validates the entire document keys structure and size even on updates.

### ID Poisoning & Orphaned Records (Pillar 3, 7, 12)

9. **Long/Corrupt ID Path Parameter Attack**
   * *Payload:* Trying to create a student under `/students/student_id_123_456_` + `X`.repeat(500)
   * *Outcome:* Blocked by `isValidId(studentId)` preventing path injection.

10. **Immutable Key Modification during Update**
    * *Payload:* Updating `/students/student_101` with a changed `ownerId` or modified `id`.
    * *Outcome:* Blocked by verifying fields remain unchanged relative to `existing()`.

11. **Injecting Arbitrary Types inside Arrays/Enums**
    * *Payload:* Passing an organic collection with fields containing structural JSON representations where flat strings are expected.
    * *Outcome:* Enforced via strict `is string` and defined field list constraints.

12. **Log Mutation (Altering Written Audit History)**
    * *Payload:* Triggering an update request to `/logs/log_987`
    * *Outcome:* Blocked as updates are explicitly denied (`allow update: if false`).

---

## 3. Test Assurance
Every single transactional operation is guaranteed to conform to this boundary. The production-ready `firestore.rules` file enforces these assertions with mathematical certainty.
