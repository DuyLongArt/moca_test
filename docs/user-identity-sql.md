# User identity SQL — phone (required) + email (optional)

Identity model for MoCA Platform:

| Field | Rule | Purpose |
|-------|------|---------|
| `phone` | `NOT NULL`, `UNIQUE` | Primary identity + login |
| `email` | optional, `UNIQUE` when set | Contact; Postgres allows many `NULL`s |
| `id` (UUID) | PK | Internal FK (`test_sessions.patient_id`, etc.) |

**Current state:** V1 schema has `email NOT NULL UNIQUE` only. Apply **§1** (V2 migration) to add `phone`.

Store phones **normalized** (e.g. E.164-style `84901234567`: strip spaces, convert leading `0` → `84`).

---

## 1. Migration (existing DB → phone identity)

Save as `backend/src/main/resources/db/migration/V2__user_phone_identity.sql` (Flyway) or run manually:

```sql
-- ── Add phone column (nullable first for backfill) ─────────────────────────
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- ── Backfill phones for existing seed/dev users ─────────────────────────────
UPDATE users SET phone = '84900000001', updated_at = now()
WHERE email = 'admin@moca.local' AND phone IS NULL;

UPDATE users SET phone = '84900000201', updated_at = now()
WHERE email = 'doctor.tran@moca.local' AND phone IS NULL;

UPDATE users SET phone = '84900000202', updated_at = now()
WHERE email = 'doctor.le@moca.local' AND phone IS NULL;

UPDATE users SET phone = '84901234567', updated_at = now()
WHERE email = 'patient.nguyen@moca.local' AND phone IS NULL;

-- Any row still missing phone — block NOT NULL until fixed:
-- SELECT id, email FROM users WHERE phone IS NULL;

ALTER TABLE users
    ALTER COLUMN phone SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

-- ── Email becomes optional (unique when present) ───────────────────────────
ALTER TABLE users
    ALTER COLUMN email DROP NOT NULL;
```

One-off phone cleanup (optional):

```sql
UPDATE users SET phone = regexp_replace(phone, '[^0-9]', '', 'g')
WHERE phone IS NOT NULL;
```

---

## 2. Fresh schema (greenfield `users` table)

Use when creating `users` from scratch with phone identity:

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) NOT NULL UNIQUE,
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    education_years INT,
    gender          VARCHAR(20),
    date_of_birth   DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users (role);
CREATE UNIQUE INDEX idx_users_phone ON users (phone);
```

---

## 3. Seed users

Password hash is bcrypt for `password` (same as `docs/data-object/data.sql`):

```sql
INSERT INTO users (
    id, phone, email, password_hash, role, full_name,
    education_years, gender, date_of_birth, created_at, updated_at
)
VALUES
    (
        '11111111-1111-4111-8111-111111111001',
        '84900000001',
        'admin@moca.local',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'ADMIN',
        'Quản trị viên',
        NULL, NULL, NULL,
        now(), now()
    ),
    (
        '11111111-1111-4111-8111-111111111201',
        '84900000201',
        'doctor.tran@moca.local',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'DOCTOR',
        'BS. Trần Minh',
        NULL, 'Nam', '1975-03-12',
        now(), now()
    ),
    (
        '11111111-1111-4111-8111-111111111202',
        '84900000202',
        'doctor.le@moca.local',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'DOCTOR',
        'BS. Lê Hương',
        NULL, 'Nữ', '1980-07-22',
        now(), now()
    ),
    (
        '11111111-1111-4111-8111-111111111101',
        '84901234567',
        'patient.nguyen@moca.local',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'PATIENT',
        'Nguyễn Văn Bệnh',
        12, 'Nam', '1955-08-15',
        now(), now()
    ),
    (
        gen_random_uuid(),
        '84909876543',
        NULL,
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'PATIENT',
        'Trần Thị Lan',
        11, 'Nữ', '1960-04-20',
        now(), now()
    )
ON CONFLICT (id) DO NOTHING;
```

---

## 4. Login / lookup

**Login by phone (primary):**

```sql
SELECT id, phone, email, password_hash, role, full_name, education_years
FROM users
WHERE phone = $1;
```

**Login by email (optional fallback):**

```sql
SELECT id, phone, email, password_hash, role, full_name, education_years
FROM users
WHERE email IS NOT NULL
  AND lower(email) = lower($1);
```

**Check phone taken (register):**

```sql
SELECT EXISTS (
    SELECT 1 FROM users WHERE phone = $1
) AS phone_taken;
```

**Check email taken (when email provided):**

```sql
SELECT EXISTS (
    SELECT 1 FROM users
    WHERE email IS NOT NULL AND lower(email) = lower($1)
) AS email_taken;
```

---

## 5. Register / update profile

Maps to MoCA test UI:

- **Screen 1:** `phone` (required), `email` (optional)
- **Screen 2:** `full_name`, `education_years`

**Create patient:**

```sql
INSERT INTO users (
    id, phone, email, password_hash, role, full_name,
    education_years, created_at, updated_at
)
VALUES (
    gen_random_uuid(),
    $1,
    NULLIF(trim($2), ''),
    $3,
    'PATIENT',
    $4,
    $5,
    now(),
    now()
)
RETURNING id, phone, email, full_name, role;
```

**Update profile when user already exists (lookup by phone):**

```sql
UPDATE users
SET
    full_name       = $2,
    education_years = $3,
    email           = COALESCE(NULLIF(trim($4), ''), email),
    updated_at      = now()
WHERE phone = $1
RETURNING id, phone, email, full_name, education_years, role;
```

---

## 6. Read / admin

**By UUID (internal):**

```sql
SELECT id, phone, email, role, full_name, education_years, created_at
FROM users
WHERE id = $1;
```

**Patient by phone:**

```sql
SELECT id, phone, email, full_name, education_years, role, created_at
FROM users
WHERE phone = $1 AND role = 'PATIENT';
```

**Partial phone search:**

```sql
SELECT id, phone, email, full_name, role
FROM users
WHERE phone LIKE '%' || $1 || '%'
ORDER BY created_at DESC
LIMIT 20;
```

**Patients without email:**

```sql
SELECT id, phone, full_name, education_years
FROM users
WHERE role = 'PATIENT' AND email IS NULL;
```

---

## 7. Identity → test sessions

Tests link via `patient_id` (UUID), not phone:

```sql
SELECT ts.id, ts.set_id, ts.status, ts.auto_score, ts.final_score, ts.submitted_at
FROM test_sessions ts
JOIN users u ON u.id = ts.patient_id
WHERE u.phone = '84901234567'
ORDER BY ts.created_at DESC;
```

Resolve user before submit:

```sql
SELECT id FROM users WHERE phone = $1;
-- INSERT INTO test_sessions (patient_id, set_id, raw_answers, ...) VALUES (...);
```

---

## 8. Rollback

```sql
DROP INDEX IF EXISTS idx_users_phone;
ALTER TABLE users DROP COLUMN IF EXISTS phone;
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
```

---

## Related

- Entity overview: `docs/entity-design.md` §5.1 `users`
- Seed data: `docs/data-object/data.sql`
- Frontend identity screen: `frontend/src/features/patient/MocaTestContainer.jsx` (`IdentityScreen`)
- Backend (to wire): `UserEntity`, `UserRepository.findByPhone`, `AuthService.login`
