# 04 — API Migration: Express APIs → Supabase Client

## Hiện tại
Frontend gọi đến các endpoint Express thông qua `axios`. Backend Express query PostgreSQL bằng Prisma rồi trả kết quả JSON.

## Target: Supabase Client Direct Queries
Hầu hết các read/write operations sẽ được frontend gọi trực tiếp tới Supabase Client nhờ RLS (Row Level Security) bảo vệ.

### 1. Orders API

#### Lấy danh sách Orders (All / Unpaid / Paid)
- **Trước (Express):** `GET /order`, `GET /order/unpaid`, `GET /order/paid`
- **Sau (Supabase):**
```javascript
// Lấy tất cả orders cùng với cart items và thông tin file
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    cart (
      id,
      size,
      files (*)
    )
  `);
```

#### Tạo Order mới
- **Trước (Express):** `POST /order/place-order/create`
- **Sau (Supabase):** Do cần insert vào 2 bảng (`orders` và `cart`) cùng lúc, ta có thể dùng client-side transaction (insert order trước, lấy ID, insert cart sau) hoặc PostgreSQL RPC function nếu muốn atomic.
```javascript
// Step 1: Tạo Order
const { data: order, error: orderError } = await supabase
  .from('orders')
  .insert({ name, phone, address, total, date: new Date(`${year}-${month}-${date}`) })
  .select()
  .single();

if (orderError) throw orderError;

// Step 2: Tạo Cart items
const cartItems = cart.map(item => ({
  order_id: order.id,
  file_id: item.id,
  size: item.size
}));

const { error: cartError } = await supabase
  .from('cart')
  .insert(cartItems);
```

---

### 2. Inventory / Items API

#### Lấy danh sách Inventory (Folders + Files)
- **Trước (Express):** `GET /inventory`
- **Sau (Supabase):**
```javascript
const { data, error } = await supabase
  .from('folders')
  .select(`
    *,
    files (*)
  `);
```

#### Reorder Items (Sắp xếp lại displayID)
- **Trước (Express):** `POST /item/reorder` (dùng Prisma `$transaction`)
- **Sau (Supabase):** Có thể chạy loop `upsert` hoặc viết database function (RPC) để thực hiện transaction trên DB:
```javascript
// RPC Function: update_item_positions(positions jsonb)
const { error } = await supabase.rpc('update_item_positions', { 
  positions: newOrder.map((id, index) => ({ id, display_id: index + 1 })) 
});
```

---

### 3. Favorites API

#### Lấy Favorite ngẫu nhiên
- **Trước (Express):** `GET /favorite/random` (tải tất cả lên và random ở Node.js)
- **Sau (Supabase):** Query ngẫu nhiên trực tiếp từ database bằng SQL `random()`:
```javascript
const { data, error } = await supabase
  .rpc('get_random_favorite'); // Gọi database function trả về 1 record random
```

---

### 4. Expense API
- Các operation GET, POST, PATCH, DELETE trên bảng `expenses` chuyển đổi trực tiếp sang `.select()`, `.insert()`, `.update()`, `.delete()`.

---

## Khi nào cần Supabase Edge Functions?
Với các logic nhạy cảm hoặc cần tích hợp bên thứ ba (như xử lý webhook thanh toán từ **SePay**), ta sẽ deploy một Edge Function thay vì gọi trực tiếp từ client.

- Tạo Edge Function `sepay-webhook`:
  - Nhận webhook từ SePay.
  - Parse `code` (ví dụ `YS123` -> ID order `123`).
  - Update `paid_status = true` cho order đó bằng Service Role Key (bypass RLS).
  - Gửi realtime signal.
