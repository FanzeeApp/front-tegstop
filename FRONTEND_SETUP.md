# Frontend Setup Guide

## Overview
This is a modern React frontend application for passport search and records management system.

## Features
- ✅ Login authentication (username + password)
- ✅ Search records by passport series and code
- ✅ View search results with detailed information
- ✅ Manage user's own records
- ✅ Add new records
- ✅ Multilingual support (Uzbek, Russian, English)
- ✅ Dark/Light theme toggle
- ✅ Smooth animations with Framer Motion
- ✅ Responsive mobile-first design

## Tech Stack
- **React** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Zustand** - State management
- **i18next** - Internationalization
- **Axios** - HTTP client
- **shadcn/ui** - UI components

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Replace with your actual backend API URL.

## Backend API Requirements

The frontend expects the following API endpoints:

### Authentication
- `POST /api/auth/login` - Login with username and password
  - Request: `{ username: string, password: string }`
  - Response: `{ token: string, user: User }`

- `GET /api/auth/me` - Get current user info
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user: User }`

### Records
- `GET /api/records/search?passportSeriya={series}&passportCode={code}` - Search record
  - Headers: `Authorization: Bearer <token>`
  - Response: `Record | null`

- `GET /api/records/my` - Get user's records
  - Headers: `Authorization: Bearer <token>`
  - Response: `Record[]`

- `POST /api/records` - Create new record
  - Headers: `Authorization: Bearer <token>`
  - Request: `CreateRecordData`
  - Response: `Record`

## Type Definitions

### User
```typescript
{
  id: string
  name: string
  username: string
  phone: string
  role?: string
}
```

### Record
```typescript
{
  id: string
  name?: string
  surname?: string
  passportSeriya: "AD" | "AB" | "KA"
  passportCode: string
  type: "NasiyaMijoz" | "PulTolamagan"
  userId: string
  user?: User
  createdAt: string
}
```

## Usage

### Default Language
The app starts with Uzbek language by default. Users can switch between:
- Uzbek (uz)
- Russian (ru)
- English (en)

### Theme
Users can toggle between light and dark themes using the theme button in the navbar.

### Authentication Flow
1. User lands on login page
2. Enters username and password
3. On successful login, JWT token is stored in localStorage
4. User is redirected to home (search) page
5. Token is automatically attached to all API requests

### Protected Routes
All routes except `/login` are protected and require authentication:
- `/` - Home/Search page
- `/my-records` - User's records list
- `/add-record` - Add new record form

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── Login.tsx       # Login page
│   ├── Home.tsx        # Search page
│   ├── MyRecords.tsx   # Records list
│   ├── AddRecord.tsx   # Add record form
│   └── NotFound.tsx    # 404 page
├── lib/                # Utilities
│   ├── api.ts          # API client
│   └── i18n.ts         # i18next config
├── locales/            # Translation files
│   ├── uz.json
│   ├── ru.json
│   └── en.json
├── store/              # Zustand stores
│   ├── useAuthStore.ts
│   └── useThemeStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Design System

The app uses a professional blue/teal color scheme with:
- Clean card-based layouts
- Smooth transitions and animations
- Proper spacing and typography
- Responsive breakpoints
- Dark mode optimized colors

All colors are defined using HSL values in `src/index.css` and follow the design system patterns.

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Important Notes

1. **No "Fraudster" word in UI**: The word "fraudster" is never shown. Instead:
   - Type "NasiyaMijoz" → "Nasiya mijoz" / "Nasiya orqali foydalanmoqda"
   - Type "PulTolamagan" → "Pul to'lamagan mijoz"

2. **Passport Code**: Always 6 digits, validated on frontend

3. **Token Storage**: JWT token stored in localStorage with auto-attach to requests

4. **Error Handling**: All API errors show user-friendly toast notifications

5. **Mobile Responsive**: Fully responsive with mobile menu for navigation

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure your backend allows requests from the frontend origin.

### API Connection
Check that `VITE_API_URL` in `.env` matches your backend URL.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
