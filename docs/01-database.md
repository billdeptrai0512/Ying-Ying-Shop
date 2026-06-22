# 01 — Database Migration: Prisma → Supabase

## Hiện tại (Prisma Schema)

```
Session  ──  sessions (express-session, sẽ bỏ)
User     ──  admin accounts (passport auth)
Folder   ──  inventory categories (áo, váy, blazer...)
File     ──  inventory items (ảnh, size, giá...)
Order    ──  đơn hàng
Cart     ──  items trong 1 order (pivot table Order ↔ File)
Favorite ──  outfit combinations đã lưu
Combination ── pivot table Favorite ↔ File
Expense  ──  chi phí
```

## Target: Supabase Tables

### Bỏ hoàn toàn
- `Session` → Supabase Auth tự quản lý session

### Thay đổi
- `User` → Dùng `auth.users` của Supabase (không cần table riêng)

### Giữ nguyên cấu trúc, tạo lại trên Supabase

```sql
-- Folders (inventory categories)
CREATE TABLE folders (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  section TEXT NOT NULL,
  measurements JSONB DEFAULT '{}'
);

-- Files (inventory items)
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name TEXT,
  type TEXT NOT NULL,
  image TEXT NOT NULL,
  demo_image TEXT[] DEFAULT '{}',
  display_id INT UNIQUE,
  amount INT NOT NULL,
  total INT NOT NULL,
  z_index INT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  folder_id INT REFERENCES folders(id)
);

-- Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,  -- đổi từ INT sang TEXT (số điện thoại 0xxx)
  address TEXT NOT NULL,
  total INT,
  paid_status BOOLEAN DEFAULT false,
  order_status TEXT DEFAULT 'not-ready'
);

-- Cart (Order ↔ File pivot)
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  file_id INT REFERENCES files(id),
  size TEXT
);

-- Favorites
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  outfit JSONB DEFAULT '{}'
);

-- Combinations (Favorite ↔ File pivot)
CREATE TABLE combinations (
  id SERIAL PRIMARY KEY,
  favorite_id INT REFERENCES favorites(id) ON DELETE CASCADE,
  file_id INT REFERENCES files(id)
);

-- Expenses
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  total INT
);
```

## RLS (Row Level Security) Policies

```sql
-- Public: ai cũng đọc được inventory
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read folders" ON folders FOR SELECT USING (true);
CREATE POLICY "Admin manage folders" ON folders FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read files" ON files FOR SELECT USING (true);
CREATE POLICY "Admin manage files" ON files FOR ALL USING (auth.role() = 'authenticated');

-- Orders: public có thể tạo, admin đọc/sửa/xóa
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own order" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public create cart" ON cart FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read cart" ON cart FOR SELECT USING (true);
CREATE POLICY "Admin manage cart" ON cart FOR ALL USING (auth.role() = 'authenticated');

-- Favorites: public đọc, admin quản lý
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read favorites" ON favorites FOR SELECT USING (true);
CREATE POLICY "Public create favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage favorites" ON favorites FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE combinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read combinations" ON combinations FOR SELECT USING (true);
CREATE POLICY "Public create combinations" ON combinations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage combinations" ON combinations FOR ALL USING (auth.role() = 'authenticated');

-- Expenses: chỉ admin
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only expenses" ON expenses FOR ALL USING (auth.role() = 'authenticated');
```

## Data Migration

### Bước 1: Export từ PostgreSQL VPS
```bash
# Trên VPS
pg_dump -U postgres -d ying_shop --data-only --inserts > ying_shop_data.sql
```

### Bước 2: Import vào Supabase
- Dùng Supabase SQL Editor paste SQL
- Hoặc dùng `psql` connect thẳng vào Supabase PostgreSQL connection string

### Bước 3: Fix sequences
```sql
-- Reset auto-increment sau khi import data
SELECT setval('folders_id_seq', (SELECT MAX(id) FROM folders));
SELECT setval('files_id_seq', (SELECT MAX(id) FROM files));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('cart_id_seq', (SELECT MAX(id) FROM cart));
SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));
SELECT setval('combinations_id_seq', (SELECT MAX(id) FROM combinations));
SELECT setval('expenses_id_seq', (SELECT MAX(id) FROM expenses));
```

## Lưu ý

> [!IMPORTANT]
> Column `phone` trong Order nên đổi từ `INT` sang `TEXT`. Số điện thoại VN bắt đầu bằng `0` sẽ bị mất nếu lưu dạng INT.

> [!NOTE]
> Prisma dùng `camelCase` (`displayID`, `folderId`), Supabase convention là `snake_case` (`display_id`, `folder_id`). Frontend code sẽ cần update tên field.
