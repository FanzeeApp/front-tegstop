# Tegstop Frontend - Quick Setup Guide

## 1. Prerequisites

- Node.js 18+ o'rnatilgan bo'lishi kerak
- npm yoki yarn package manager
- Backend server ishlab turishi kerak (port 3000)

## 2. Quick Start

```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## 3. Environment Setup

`.env` faylini tekshiring:

```env
VITE_API_URL=http://localhost:3000/api
```

## 4. Test Login

Agar backend ishlab turgan bo'lsa, quyidagi ma'lumotlar bilan login qiling:

- **Username**: backend'da yaratilgan user
- **Password**: backend'da yaratilgan password

## 5. Asosiy Sahifalar

| Route | Description |
|-------|-------------|
| `/login` | Login sahifasi |
| `/` | Asosiy qidiruv sahifasi |
| `/add-record` | Yozuv qo'shish |
| `/my-records` | Mening yozuvlarim |
| `/profile` | Profil |
| `/bulk-upload` | Bulk upload |

## 6. API Endpoints (Backend)

Frontend quyidagi endpoint'lardan foydalanadi:

### Auth
- `POST /api/user/login` - Login
- `GET /api/user/me` - Get user info

### Fraudster
- `GET /api/fraudster/search?passportSeriya=AD&passportCode=1234567` - Search
- `GET /api/fraudster/my-count` - My records
- `POST /api/fraudster` - Create record
- `DELETE /api/fraudster/:id` - Delete record

## 7. Muammolarni Tuzatish

### Backend bilan bog'lanmayapti

```bash
# Backend ishlab turganini tekshirish
curl http://localhost:3000/api/user/login
```

Agar javob kelmasa:
1. Backend server'ni ishga tushiring
2. Backend portini tekshiring (3000 bo'lishi kerak)
3. CORS sozlamalarini tekshiring

### CORS xatosi

Backend'da CORS yoqilgan bo'lishi kerak:

```javascript
// Backend code
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### Login ishlamayapti

1. Browser Developer Tools > Console'ni oching
2. Network tab'da request'larni ko'ring
3. Response status va xatoliklarni tekshiring
4. Token localStorage'ga saqlanganini tekshiring

```javascript
// Browser console'da tekshirish
localStorage.getItem('token')
```

## 8. Build va Deploy

### Development build
```bash
npm run build:dev
```

### Production build
```bash
npm run build
```

Build files: `dist/` papkasida

### Preview
```bash
npm run preview
```

## 9. Folder Structure

```
src/
├── components/     # UI components
├── hooks/          # API hooks (api.ts, useFraudster.ts)
├── lib/            # Utilities
├── pages/          # Page components
├── store/          # State management
├── types/          # TypeScript types
└── utils/          # Helper functions
```

## 10. Key Files

- `src/hooks/api.ts` - Axios config, interceptors
- `src/hooks/useFraudster.ts` - Fraudster API hooks
- `src/store/useAuthStore.ts` - Auth state
- `.env` - Environment variables

## Yordam

Muammo bo'lsa:
1. README.md faylini o'qing
2. Browser console'da xatoliklarni tekshiring
3. Backend logs'ni tekshiring
