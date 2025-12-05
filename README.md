# Tegstop Frontend

Tegstop.uz platformasining frontend qismi - O'zbekistonda firibgarlar va qarzdorlar haqida ma'lumot platformasi.

## Texnologiyalar

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **i18next** - Internationalization
- **Vite PWA** - Progressive Web App

## O'rnatish

### 1. Loyihani klonlash

```bash
git clone <repository-url>
cd tegstop-frontend
```

### 2. Dependencies o'rnatish

```bash
npm install
```

### 3. Environment variables sozlash

`.env` faylini yarating va quyidagi o'zgaruvchilarni qo'shing:

```env
# Backend API URL
VITE_API_URL=http://localhost:3000/api
```

### 4. Development server ishga tushirish

```bash
npm run dev
```

Frontend `http://localhost:5173` da ochiladi.

## Backend Integration

Frontend backend bilan quyidagi endpoint'lar orqali aloqa qiladi:

### Auth Endpoints
- `POST /api/user/login` - Login
- `GET /api/user/me` - Get current user

### Fraudster Endpoints
- `GET /api/fraudster/search?passportSeriya=AD&passportCode=1234567` - Search fraudster
- `GET /api/fraudster/my-count` - Get user's fraudster records
- `POST /api/fraudster` - Create fraudster record
- `DELETE /api/fraudster/:id` - Delete fraudster record

## Loyiha Strukturasi

```
src/
├── components/          # Reusable components
│   ├── ui/             # Shadcn UI components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx
├── hooks/              # Custom hooks
│   ├── api.ts          # Axios instance & config
│   └── useFraudster.ts # Fraudster API hooks
├── lib/                # Utilities
│   ├── api.ts          # API utilities (deprecated)
│   ├── i18n.ts         # i18next config
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── Home.tsx        # Search page
│   ├── Login.tsx       # Login page
│   ├── AddRecord.tsx   # Add fraudster record
│   ├── MyRecords.tsx   # User's records
│   ├── Profil.tsx      # User profile
│   └── BulkUpload.tsx  # Bulk upload
├── store/              # Zustand stores
│   ├── useAuthStore.ts # Auth state
│   └── useThemeStore.ts # Theme state
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── analytics.ts    # Google Analytics
│   └── clearCache.ts
├── App.tsx             # Main app component
└── main.tsx           # Entry point
```

## Build

Production build yaratish:

```bash
npm run build
```

Build natijasi `dist/` papkasida bo'ladi.

## Deployment

### Vercel (tavsiya etiladi)

1. Vercel hisobiga kiring
2. Repositoryni import qiling
3. Environment variables qo'shing:
   - `VITE_API_URL=https://your-backend-url.com/api`
4. Deploy qiling

### O'z serveringizda

```bash
# Build
npm run build

# Serve static files
# dist/ papkasini nginx yoki apache orqali serve qiling
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Features

- ✅ Passport bo'yicha qidiruv
- ✅ Firibgar/qarzdor qo'shish
- ✅ O'z yozuvlaringizni ko'rish
- ✅ Yozuvni o'chirish
- ✅ Authentication & Authorization
- ✅ PWA support (offline ishlash)
- ✅ Dark/Light theme
- ✅ Responsive design
- ✅ Google Analytics integration
- ✅ Multi-language support (uz/ru)

## API Configuration

Backend bilan ishlash uchun ikkita asosiy fayl mavjud:

1. **src/hooks/api.ts** - Asosiy Axios instance va interceptorlar
2. **src/hooks/useFraudster.ts** - React Query hooks

### API Instance

```typescript
import { api } from '@/hooks/api';

// Automatic token injection
// Automatic 401 handling
// Error tracking
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint

## Muhim Eslatmalar

1. **Backend ishlab turishi kerak** - Frontend backend API'ga bog'liq
2. **CORS** - Backend CORS ni yoqilgan bo'lishi kerak
3. **Token** - JWT token localStorage da saqlanadi
4. **Port** - Frontend: 5173, Backend: 3000

## Muammolarni Hal Qilish

### Backend bilan bog'lanish muammolari

1. Backend ishlab turganini tekshiring:
   ```bash
   curl http://localhost:3000/api/user/login
   ```

2. `.env` faylida `VITE_API_URL` to'g'ri sozlanganini tekshiring

3. CORS sozlamalarini tekshiring backend'da

### Login qila olmayapman

1. Backend `/api/user/login` endpoint'i ishlayotganini tekshiring
2. Username va password to'g'ri ekanligini tekshiring
3. Browser console'da xatoliklarni tekshiring

## License

Private
