# 05 — Realtime Migration: WebSocket → Supabase Realtime

## Hiện tại
Hệ thống sử dụng WebSocket server chạy trên Node.js (`ws` package) để cập nhật trạng thái thanh toán đơn hàng (paid_status) ngay lập tức cho client khi nhận được webhook từ SePay.

- **Backend (Express):** Khi webhook SePay kích hoạt, Express update database và loop qua tất cả clients đang connection để broadcast tin nhắn `{ id: orderId, paid_status: true }`.
- **Frontend (`src/public/webSocket.jsx`):** Kết nối tới `VITE_WEBSOCKET_URL`, lắng nghe event `onmessage` và cập nhật state `messages`.

---

## Target: Supabase Realtime (PostgreSQL Changes)
Supabase hỗ trợ sẵn tính năng Realtime bằng cách lắng nghe các thay đổi trực tiếp từ transaction log của PostgreSQL (WAL). Không cần chạy server WebSocket riêng.

### 1. Kích hoạt Realtime trên bảng `orders`
Chạy lệnh SQL này trong Supabase SQL Editor:
```sql
alter publication supabase_realtime add table orders;
```

### 2. Refactor Frontend `src/public/webSocket.jsx`
Ta có thể đổi tên/cấu trúc file này thành `realtimeContext.jsx` hoặc giữ nguyên interface cũ nhưng chuyển ruột sang dùng Supabase.

```javascript
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const RealtimeContext = createContext();

export function RealtimeProvider({ children }) {
    const [lastPaidOrder, setLastPaidOrder] = useState(null);

    useEffect(() => {
        // Lắng nghe sự kiện UPDATE trên bảng orders
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const updatedOrder = payload.new;
                    // Nếu trạng thái đổi sang paid = true
                    if (updatedOrder.paid_status === true) {
                        setLastPaidOrder({
                            id: updatedOrder.id,
                            paid_status: true
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <RealtimeContext.Provider value={{ lastPaidOrder }}>
            {children}
        </RealtimeContext.Provider>
    );
}

export const useRealtime = () => useContext(RealtimeContext);
```

---

## Cách hoạt động của flow thanh toán mới:
1. User mở trang checkout chờ quét QR thanh toán.
2. Webhook SePay gọi tới Edge Function `sepay-webhook` (hoặc REST API route cập nhật).
3. Trạng thái `paid_status` của hàng trong DB chuyển thành `true`.
4. Supabase tự động đẩy event UPDATE này xuống frontend.
5. React component lắng nghe thay đổi thông qua `useRealtime()` và hiển thị màn hình "Thanh toán thành công".
