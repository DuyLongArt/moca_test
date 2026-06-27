-- MoCA Platform — reference seed data
-- Run AFTER: backend/src/main/resources/db/migration/V1__initial_schema.sql
-- Optional V2 table (moca_sets) included here for dev/docs; move to Flyway V2 when ready.
--
-- HOW TO RUN
--   Remote pgAdmin: http://192.168.22.24/browser/ → database moca-test-db
--   1. Run V1 schema first: backend/src/main/resources/db/migration/V1__initial_schema.sql
--   2. Execute THIS ENTIRE FILE (Query → Execute, or F5). Do not run a highlighted fragment.
--
--   Local docker:
--   docker exec -i moca-postgres psql -U moca -d moca < docs/data-object/data.sql
--   (Postgres in docker-compose is on host port 5433)
--
-- Fixed UUIDs match docs/data-object/data.json

-- ── V2 supplement: question bank table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS moca_sets (
    id          VARCHAR(50) PRIMARY KEY,
    label       VARCHAR(255) NOT NULL,
    source      VARCHAR(255),
    content     JSONB NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- bcrypt placeholder for password "password" (dev only)
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- ── Users ────────────────────────────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, role, full_name, education_years, gender, date_of_birth, created_at, updated_at)
VALUES
    ('11111111-1111-4111-8111-111111111001', 'admin@moca.local',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'ADMIN', 'Quản trị viên', NULL, NULL, NULL, '2026-01-01T00:00:00Z'::timestamptz, '2026-01-01T00:00:00Z'::timestamptz),
    ('11111111-1111-4111-8111-111111111201', 'doctor.tran@moca.local',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'DOCTOR', 'BS. Trần Minh', NULL, 'Nam', '1975-03-12', '2026-01-01T00:00:00Z'::timestamptz, '2026-01-01T00:00:00Z'::timestamptz),
    ('11111111-1111-4111-8111-111111111202', 'doctor.le@moca.local',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'DOCTOR', 'BS. Lê Hương', NULL, 'Nữ', '1980-07-22', '2026-01-01T00:00:00Z'::timestamptz, '2026-01-01T00:00:00Z'::timestamptz),
    ('11111111-1111-4111-8111-111111111101', 'patient.nguyen@moca.local',
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'PATIENT', 'Nguyễn Văn Bệnh', 12, 'Nam', '1955-08-15', '2026-01-01T00:00:00Z'::timestamptz, '2026-01-01T00:00:00Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ── Doctor profiles ──────────────────────────────────────────────────────────
INSERT INTO doctor_profiles (user_id, specialty, license_number, is_active)
VALUES
    ('11111111-1111-4111-8111-111111111201', 'Thần kinh', 'BS-2015-001', true),
    ('11111111-1111-4111-8111-111111111202', 'Lão khoa', 'BS-2018-042', true)
ON CONFLICT (user_id) DO NOTHING;

-- ── Patient assignment (current doctor) ──────────────────────────────────────
INSERT INTO patient_assignments (id, patient_id, doctor_id, is_current, assigned_at)
VALUES
    ('33333333-3333-4333-8333-333333333301',
     '11111111-1111-4111-8111-111111111101',
     '11111111-1111-4111-8111-111111111201',
     true, '2026-03-01T08:00:00Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ── Appointments ─────────────────────────────────────────────────────────────
INSERT INTO appointments (id, patient_id, doctor_id, scheduled_at, status, notes, created_at)
VALUES
    ('44444444-4444-4444-8444-444444444401',
     '11111111-1111-4111-8111-111111111101',
     '11111111-1111-4111-8111-111111111201',
     '2026-06-28T09:00:00Z'::timestamptz, 'SCHEDULED', 'Tái khám MoCA', '2026-06-01T00:00:00Z'::timestamptz),
    ('44444444-4444-4444-8444-444444444402',
     '11111111-1111-4111-8111-111111111101',
     '11111111-1111-4111-8111-111111111201',
     '2026-05-15T14:30:00Z'::timestamptz, 'COMPLETED', NULL, '2026-05-01T00:00:00Z'::timestamptz)
ON CONFLICT (id) DO NOTHING;

-- ── MoCA set (question bank) ─────────────────────────────────────────────────
INSERT INTO moca_sets (id, label, source, content, is_active, created_at)
VALUES (
    'MOCA_SET_1',
    'Đề MoCA 1',
    'vietnamesemoca_1.pdf',
    '{
      "naming": [
        {"id": "n1", "emoji": "🦁", "answer": "Sư tử", "accept": ["su tu", "lion"]},
        {"id": "n2", "emoji": "🦏", "answer": "Tê giác", "accept": ["te giac", "rhino", "rhinoceros"]},
        {"id": "n3", "emoji": "🐫", "answer": "Lạc đà", "accept": ["lac da", "camel"]}
      ],
      "memory_words": [
        {"word": "Vẻ mặt", "cue": "Đây là một bộ phận trên cơ thể"},
        {"word": "Vải nhung", "cue": "Đây là một loại vải"},
        {"word": "Nhà thờ", "cue": "Đây là một loại công trình kiến trúc"},
        {"word": "Hoa cúc", "cue": "Đây là một loại hoa"},
        {"word": "Màu đỏ", "cue": "Đây là một màu sắc"}
      ],
      "sentences": [
        "Tôi chỉ biết rằng Nam là người cần được giúp đỡ hôm nay",
        "Con mèo hay trốn dưới đi văng khi con chó ở trong phòng"
      ],
      "fluency": {"letter": "L", "threshold": 11},
      "abstraction": {
        "example": {"pair": "Quả chuối – Quả cam", "answer": "Hoa quả (trái cây)"},
        "pairs": [
          {"pair": "Tàu – Xe đạp", "accept": ["phuong tien", "giao thong", "di chuyen", "di lai", "vehicle", "transport"]},
          {"pair": "Đồng hồ – Thước kẻ", "accept": ["dung cu do", "do luong", "cong cu do", "measuring", "instrument"]}
        ]
      }
    }'::jsonb,
    true,
    '2026-01-01T00:00:00Z'::timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- FK (safe if already exists — run manually if needed)
-- ALTER TABLE test_sessions ADD CONSTRAINT fk_test_sessions_set
--     FOREIGN KEY (set_id) REFERENCES moca_sets (id);

-- ── Test sessions ────────────────────────────────────────────────────────────
-- Session 1: pending review (drawings offloaded to MinIO in raw_answers)
INSERT INTO test_sessions (
    id, patient_id, doctor_id, set_id, raw_answers, status,
    auto_score, review_score, final_score, education_bonus, classification,
    submitted_at, reviewed_at, reviewed_by, created_at
)
VALUES (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    '11111111-1111-4111-8111-111111111201',
    'MOCA_SET_1',
    '{
      "section_1a_trail_canvas": {
        "storage": "minio",
        "bucket": "moca-drawings",
        "objectKey": "sessions/22222222-2222-4222-8222-222222222201/section_1a_trail_canvas.png",
        "contentType": "image/png"
      },
      "section_1b_cube_canvas": {
        "storage": "minio",
        "bucket": "moca-drawings",
        "objectKey": "sessions/22222222-2222-4222-8222-222222222201/section_1b_cube_canvas.png",
        "contentType": "image/png"
      },
      "section_1c_clock_canvas": {
        "storage": "minio",
        "bucket": "moca-drawings",
        "objectKey": "sessions/22222222-2222-4222-8222-222222222201/section_1c_clock_canvas.png",
        "contentType": "image/png"
      },
      "section_2_naming": {
        "n1": {"text": "Sư tử", "mode": "text"},
        "n2": {"text": "Tê giác", "mode": "text"},
        "n3": {"text": "Lạc đà", "mode": "text"}
      },
      "section_3_audio_v1": "blob:http://localhost/audio-v1",
      "section_3_audio_v2": "blob:http://localhost/audio-v2",
      "section_4a_forward": "21854",
      "section_4a_backward": "247",
      "section_4b": {"errors": 0, "omissions": 0, "falseAlarms": 0, "score": 1},
      "section_4c": ["93", "86", "79", "72", "65"],
      "section_5": {"0": "blob:http://localhost/s5-0", "1": "blob:http://localhost/s5-1"},
      "section_6": {"letter": "L", "count": 12, "score": 1},
      "section_6_text": "lá lửa lê lốc lưu ly lợn làng",
      "section_7": {
        "0": {"pair": "Tàu – Xe đạp", "text": "phương tiện giao thông"},
        "1": {"pair": "Đồng hồ – Thước kẻ", "text": "dụng cụ đo"}
      },
      "section_8_inputs": {
        "word_1": {"text": "Vẻ mặt", "used_cue": false},
        "word_2": {"text": "Vải nhung", "used_cue": false},
        "word_3": {"text": "Nhà thờ", "used_cue": true},
        "word_4": {"text": "Hoa cúc", "used_cue": false},
        "word_5": {"text": "Đỏ", "used_cue": true}
      },
      "section_9": {
        "date": "24", "month": "6", "year": "2026",
        "day": "Thứ Ba", "place": "Phòng khám", "city": "Hà Nội"
      }
    }'::jsonb,
    'PENDING_REVIEW',
    22, NULL, NULL, 1, 'Chờ bác sĩ duyệt',
    '2026-06-24T09:30:00Z'::timestamptz, NULL, NULL,
    '2026-06-24T09:30:00Z'::timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- Session 2: finalized — keep INSERT … ON CONFLICT as one block (do not split)
INSERT INTO test_sessions (
    id, patient_id, doctor_id, set_id, raw_answers, status,
    auto_score, review_score, final_score, education_bonus, classification,
    submitted_at, reviewed_at, reviewed_by, created_at
)
VALUES (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    '11111111-1111-4111-8111-111111111201',
    'MOCA_SET_1',
    '{}'::jsonb,
    'FINALIZED',
    24, 2, 27, 1, 'Nhận thức bình thường',
    '2026-05-10T14:00:00Z'::timestamptz,
    '2026-05-11T10:00:00Z'::timestamptz,
    '11111111-1111-4111-8111-111111111201',
    '2026-05-10T14:00:00Z'::timestamptz
)
ON CONFLICT (id) DO NOTHING;

-- ── Section scores (session 2 — finalized example) ─────────────────────────────
INSERT INTO test_section_scores (id, session_id, section_key, label, max_points, points, scoring_mode, ai_suggestion, doctor_override)
VALUES
    ('55555555-5555-4555-8555-555555555501', '22222222-2222-4222-8222-222222222202', 'section_1', 'Thị giác – không gian', 5, 4, 'REVIEW', '{"points": 4, "reason": "Đồng hồ thiếu kim phút"}'::jsonb, NULL),
    ('55555555-5555-4555-8555-555555555502', '22222222-2222-4222-8222-222222222202', 'section_2', 'Gọi tên con vật', 3, 3, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555503', '22222222-2222-4222-8222-222222222202', 'section_3', 'Trí nhớ (ghi nhận)', 0, 0, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555504', '22222222-2222-4222-8222-222222222202', 'section_4', 'Sự chú ý', 6, 6, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555505', '22222222-2222-4222-8222-222222222202', 'section_5', 'Nhắc lại câu', 2, 2, 'REVIEW', '{"points": 2, "reason": "Đủ cả 2 câu"}'::jsonb, NULL),
    ('55555555-5555-4555-8555-555555555506', '22222222-2222-4222-8222-222222222202', 'section_6', 'Sự lưu loát', 1, 1, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555507', '22222222-2222-4222-8222-222222222202', 'section_7', 'Tư duy trừu tượng', 2, 2, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555508', '22222222-2222-4222-8222-222222222202', 'section_8', 'Nhớ lại có trì hoãn', 5, 4, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555509', '22222222-2222-4222-8222-222222222202', 'section_9', 'Định hướng', 6, 6, 'AUTO', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ── Section scores (session 1 — auto only, pending doctor on REVIEW sections) ─
INSERT INTO test_section_scores (id, session_id, section_key, label, max_points, points, scoring_mode, ai_suggestion, doctor_override)
VALUES
    ('55555555-5555-4555-8555-555555555511', '22222222-2222-4222-8222-222222222201', 'section_1', 'Thị giác – không gian', 5, 0, 'REVIEW', '{"points": 3, "reason": "Trail đúng; cube đúng; đồng hồ thiếu kim phút"}'::jsonb, NULL),
    ('55555555-5555-4555-8555-555555555512', '22222222-2222-4222-8222-222222222201', 'section_2', 'Gọi tên con vật', 3, 3, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555513', '22222222-2222-4222-8222-222222222201', 'section_3', 'Trí nhớ (ghi nhận)', 0, 0, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555514', '22222222-2222-4222-8222-222222222201', 'section_4', 'Sự chú ý', 6, 6, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555515', '22222222-2222-4222-8222-222222222201', 'section_5', 'Nhắc lại câu', 2, 0, 'REVIEW', '{"points": 1, "reason": "Câu 1 đủ; câu 2 thiếu chi tiết"}'::jsonb, NULL),
    ('55555555-5555-4555-8555-555555555516', '22222222-2222-4222-8222-222222222201', 'section_6', 'Sự lưu loát', 1, 1, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555517', '22222222-2222-4222-8222-222222222201', 'section_7', 'Tư duy trừu tượng', 2, 2, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555518', '22222222-2222-4222-8222-222222222201', 'section_8', 'Nhớ lại có trì hoãn', 5, 3, 'AUTO', NULL, NULL),
    ('55555555-5555-4555-8555-555555555519', '22222222-2222-4222-8222-222222222201', 'section_9', 'Định hướng', 6, 6, 'AUTO', NULL, NULL)
ON CONFLICT (id) DO NOTHING;
