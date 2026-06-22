# 06 — Deployment & Config Migration

## Hiện tại
- **Frontend:** Deploy trên Vercel (`yingyingshop.vercel.app`).
- **Backend:** Chạy bằng `pm2` trên VPS, expose port 2504 qua Cloudflare Tunnel.

---

## Target: Serverless Deployment (1 Project Duy Nhất trên Vercel)
Sau khi refactor, toàn bộ codebase sẽ được gộp vào project `ying-shop`. Chúng ta sẽ deploy toàn bộ (gồm cả Webhook xử lý SePay) lên Vercel.

### 1. Cấu trúc thư mục mới của `ying-shop`
```
ying-shop/
├── api/                  <-- Thư mục chứa Vercel Serverless Functions
│   └── sepay-webhook.js  <-- Xử lý Webhook từ SePay (Node.js)
├── docs/                 <-- Tài liệu refactor
├── public/
├── src/                  <-- React app (Vite)
├── index.html
├── vercel.json           <-- Cập nhật config route
└── package.json
```

### 2. Cập nhật `vercel.json`
Vercel cần biết route `/api/sepay-webhook` sẽ trỏ tới Serverless Function chứ không bị React Router chặn.

```json
{
  "rewrites": [
    { "source": "/api/sepay-webhook", "destination": "/api/sepay-webhook.js" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3. Setup Vercel Serverless Function (`api/sepay-webhook.js`)
File này đóng vai trò thay thế API route `/sepay` cũ trên Express để cập nhật `paid_status` khi nhận được callback tiền về từ SePay.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Cần bypass RLS để update orders
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, transferAmount } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const orderId = code.replace("YS", "");

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ paid_status: true })
      .eq('id', parseInt(orderId))
      .select();

    if (error) throw error;

    return res.status(200).json({ message: 'Success', data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

### 4. Thiết lập Environment Variables trên Vercel Dashboard

Tru cập *Vercel → Project Settings → Environment Variables* và điền:

| Key | Value | Phạm vi |
|-----|-------|---------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Frontend & Serverless Function |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (Anon key) | Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (Service Role) | Chỉ Serverless Function (Bảo mật cao) |
| `VITE_BANK` | `MB` | Frontend |
| `VITE_BANK_ACCOUNT` | `0902822192` | Frontend |

---

## Các bước dọn dẹp sau khi hoàn thành
1. Tắt dịch vụ Express và `pm2` trên VPS.
2. Gỡ cài đặt Cloudflare Tunnel nếu không còn dịch vụ nào khác cần dùng.
3. Thay đổi URL webhook trong dashboard của **SePay** trỏ về domain mới: `https://yingyingshop.vercel.app/api/sepay-webhook`.
