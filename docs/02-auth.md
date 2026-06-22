# 02 — Auth Migration: Passport + JWT → Supabase Auth

## Hiện tại

```
Frontend                         Backend (Express)
─────────                        ─────────────────
POST /log-in                     passport.authenticate('local')
  { username, password }   →     bcrypt.compare → JWT sign
  ← { token }                   
                                 
GET / (with Bearer token)        jwt.verify → return authData
```

**Files liên quan:**
- Backend: `controllers/loginController.js`, `index.js` (passport setup)
- Frontend: `src/admin/login.jsx`

## Target: Supabase Auth

```
Frontend                         Supabase
─────────                        ────────
supabase.auth.signInWithPassword  → Supabase Auth service
  { email, password }             → returns session + user
                                  
supabase.auth.getUser()           → check auth state
supabase.auth.onAuthStateChange() → listen auth changes
```

## Thay đổi cần làm

### 1. Tạo Supabase client (`src/lib/supabase.js`)

```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 2. Refactor `src/admin/login.jsx`

**Trước:**
```javascript
const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/log-in`, {
  username, password
});
localStorage.setItem('token', response.data.token);
```

**Sau:**
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email,     // đổi từ username → email
  password
});
// Session tự động quản lý bởi Supabase, không cần localStorage
```

### 3. Auth Context (`src/public/authContext.jsx`)

```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 4. Protected Routes

**Trước:** Check JWT token trong localStorage
**Sau:** Check `user` từ AuthContext

```javascript
// Trong admin pages
const { user, loading } = useAuth();
if (loading) return <Spinner />;
if (!user) return <Navigate to="/login" />;
```

### 5. Tạo admin user trên Supabase

```
Supabase Dashboard → Authentication → Users → Invite User
Email: admin@yingyingshop.com
```

## Bỏ hoàn toàn

- `passport`, `passport-local`, `bcryptjs`, `jsonwebtoken`, `express-session`, `@quixo3/prisma-session-store`
- Table `Session` và `User` trong database
- `verifyToken` middleware

## Lưu ý

> [!IMPORTANT]
> Hiện tại login bằng `username`. Supabase Auth mặc định dùng `email`. Nếu muốn giữ username-based login, cần custom — nhưng **khuyến nghị chuyển sang email** cho đơn giản.

> [!NOTE]
> Supabase Auth tự handle session, refresh token, PKCE flow. Không cần quản lý token thủ công.
