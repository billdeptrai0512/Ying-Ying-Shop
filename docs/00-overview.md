# Refactor Overview: Express → Supabase

## Mục tiêu
Gộp frontend (ying-shop) và backend (ying-shop-backend) thành **1 project duy nhất**, deploy trên Vercel — giống kiến trúc smart-pos.

## Kiến trúc hiện tại

```
┌─────────────────┐       ┌──────────────────────┐       ┌─────────────┐
│   Vercel/Local  │──────▶│  VPS (Express:2504)  │──────▶│ PostgreSQL  │
│   React + Vite  │       │  Passport + JWT      │       │ (VPS local) │
│                 │◀─ws──▶│  WebSocket (ws)       │       │             │
│                 │       │  Multer → Imgix       │       │             │
└─────────────────┘       └──────────────────────┘       └─────────────┘
```

## Kiến trúc mới (target)

```
┌─────────────────┐       ┌──────────────────────┐
│   Vercel        │──────▶│  Supabase (Cloud)    │
│   React + Vite  │       │  ├── PostgreSQL      │
│                 │       │  ├── Auth             │
│                 │◀─rt──▶│  ├── Realtime         │
│                 │       │  ├── Storage          │
│                 │       │  └── Edge Functions   │
└─────────────────┘       └──────────────────────┘
```

## Các module cần refactor

| # | Module | Hiện tại | Target | Docs |
|---|--------|----------|--------|------|
| 1 | Database | Prisma + PostgreSQL (VPS) | Supabase PostgreSQL | [01-database.md](./01-database.md) |
| 2 | Auth | Passport + JWT + bcrypt | Supabase Auth | [02-auth.md](./02-auth.md) |
| 3 | Storage | Multer → local fs → Imgix | Supabase Storage | [03-storage.md](./03-storage.md) |
| 4 | API | Express controllers | Supabase client + Edge Functions | [04-api-migration.md](./04-api-migration.md) |
| 5 | Realtime | WebSocket (ws) | Supabase Realtime | [05-realtime.md](./05-realtime.md) |
| 6 | Deployment | VPS + Cloudflare Tunnel | Vercel + Supabase | [06-deployment.md](./06-deployment.md) |

## Thứ tự thực hiện (đề xuất)

```
1. Database (01)  ─────▶  Tạo tables trên Supabase, migrate data
2. Auth (02)      ─────▶  Chuyển sang Supabase Auth, RLS policies
3. Storage (03)   ─────▶  Upload images sang Supabase Storage
4. API (04)       ─────▶  Replace axios calls → supabase client
5. Realtime (05)  ─────▶  Replace WebSocket → Supabase Realtime
6. Deploy (06)    ─────▶  Vercel config, env variables, go live
```

## Ước lượng effort

| Module | Effort | Rủi ro |
|--------|--------|--------|
| Database | Thấp | Data migration cần cẩn thận |
| Auth | Trung bình | Thay đổi flow login toàn bộ |
| Storage | Trung bình | Cần re-upload ~tất cả images |
| API | Cao | Nhiều file frontend cần sửa |
| Realtime | Thấp | Chỉ 1 use-case (paid_status) |
| Deploy | Thấp | Config Vercel + env |

## Lưu ý quan trọng

> [!WARNING]
> Refactor này thay đổi toàn bộ backend stack. Nên làm trên branch riêng và test kỹ trước khi merge.

> [!IMPORTANT]  
> Supabase free tier: 500MB database, 1GB storage, 50K monthly active users. Đủ cho shop nhỏ.
