# 03 — Storage Migration: Multer/Imgix → Supabase Storage

## Hiện tại

```
Upload: multer (memoryStorage) → fs.writeFile → VPS disk (assets/)
Serving: https://yingyingshop2504.imgix.net/inventory/{type}/{filename}
```

## Target: Supabase Storage

### 1. Tạo Buckets (Supabase Dashboard → Storage)
- `inventory` (public) — ảnh sản phẩm
- `demo` (public) — ảnh demo/phối đồ

### 2. Upload từ Frontend

```javascript
// Upload
const { data, error } = await supabase.storage
  .from('inventory')
  .upload(`${type}/${file.name}`, file, { upsert: true });

// Get URL
const { data: { publicUrl } } = supabase.storage
  .from('inventory')
  .getPublicUrl(`${type}/${file.name}`);
```

### 3. Data Migration
1. Download images từ VPS (`assets/`)
2. Upload lên Supabase Storage
3. Update URLs trong database

### 4. Bỏ hoàn toàn
- `multer`, `prisma/upload.js`
- `handleFileUpload()` trong itemController
- `IMGIX_URL` env variable
- `assets/` folder trên VPS

> [!WARNING]
> Supabase Storage free tier: **1GB**. Kiểm tra tổng dung lượng images trước khi migrate.
