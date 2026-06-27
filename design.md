# MoCA Platform — UI design

## Brand
**Stitch — Functional Clarity** (project: React Question Form). Primary `#4f46e5`, Geist, clinical minimal.

Tokens: `frontend/src/styles/stitch-tokens.css`  
Stitch map: `frontend/src/stitch/screens.json`  
Integration: [`docs/stitch-integration.md`](docs/stitch-integration.md)

## Screens

| Screen | Route | Role | Primary task |
|--------|-------|------|--------------|
| Đăng nhập | `/login` | all | Chọn vai trò (dev) / JWT sau |
| Trang chủ BN | `/patient` | patient | Menu: làm test, kết quả, lịch, đổi BS |
| Làm test MoCA | `/patient/test` | patient | Wizard 9 phần |
| Kết quả | `/patient/results` | patient | Điểm tạm + chính thức |
| Lịch khám | `/patient/appointments` | patient | Danh sách hẹn |
| Đổi bác sĩ | `/patient/doctors` | patient | Chọn BS mới |
| BS Dashboard | `/doctor` | doctor | Hàng chờ duyệt + BN |
| Chấm điểm | `/doctor/reviews/:id` | doctor | Vẽ/ghi âm + AI gợi ý |
| Admin Dashboard | `/admin` | admin | Tổng quan |
| Quản lý BS | `/admin/doctors` | admin | Thêm bác sĩ |

## Patient home — Layout
- Header: tên BN, đăng xuất
- Grid 2×2 cards: Làm test · Kết quả · Lịch khám · Đổi bác sĩ

## States
- **Empty:** "Chưa có bài kiểm tra" / "Chưa có lịch hẹn"
- **Loading:** skeleton card
- **Pending review:** badge amber "Chờ bác sĩ duyệt"

## Copy (VI)
- CTA test: "Bắt đầu bài kiểm tra"
- Kết quả: "Kết quả tạm tính" / "Kết quả chính thức"

## Data model
Full entity design: [`docs/entity-design.md`](docs/entity-design.md) — User · MocaSet · TestSession · SectionScore.

## Frontend data layer
React Query + Zustand: [`docs/frontend-architecture.md`](docs/frontend-architecture.md).
