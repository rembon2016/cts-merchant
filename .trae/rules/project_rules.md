# CTS Merchant - Project Rules & Guidelines

## 📋 Overview

Dokumen ini berisi aturan dan panduan pengembangan untuk proyek CTS Merchant React PWA. Aplikasi ini adalah Progressive Web App yang dibangun dengan React, Vite, dan Tailwind CSS untuk merchant CTS Soundbox.

## 🏗️ Architecture Guidelines

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── alert/          # Alert components
│   └── form/           # Form components
├── layouts/             # Layout components
├── pages/               # Page components (routes)
├── services/            # API services & external integrations
├── store/               # State management (Zustand)
├── hooks/               # Custom React hooks (useDebounce, etc.)
└── index.css           # Global styles & Tailwind imports
```

### Component Architecture
- **Atomic Design**: Gunakan prinsip atomic design (atoms, molecules, organisms)
- **Single Responsibility**: Setiap komponen hanya memiliki satu tanggung jawab
- **Composition over Inheritance**: Gunakan composition pattern
- **Component Organization**: Pisahkan komponen berdasarkan fungsi (alert/, form/, dll)
- **Route Protection**: Gunakan ProtectedRoute dan PublicRoute untuk auth guards
- **Modal Components**: Gunakan IframeModal, PromoDetailModal, PopupBox untuk UI overlay

### State Management
- **Zustand**: Gunakan Zustand untuk global state management
- **Store Separation**: Pisahkan store berdasarkan domain:
  - `authStore.js` - Authentication & session management
  - `themeStore.js` - Dark/light theme dengan persist
  - `userDataStore.js` - User profile data
  - `fetchDataStore.js` - API data fetching states
  - `faqStore.js` - FAQ data management
  - `tokenStore.js` - Token management
- **Local State**: Gunakan useState untuk state lokal komponen
- **Immutability**: Selalu update state secara immutable
- **Persistence**: Gunakan zustand/middleware persist untuk data yang perlu disimpan

## 🎨 Design System

### Color Palette
```css
:root {
  --c-primary: #002F6C;     /* CTS Primary Blue */
  --c-accent: #FFD93D;      /* CTS Accent Yellow */
  --c-success: #22c55e;     /* Green 500 */
  --c-warning: #f59e0b;     /* Amber 500 */
  --c-error: #ef4444;       /* Red 500 */
  --c-gray-50: #f9fafb;
  --c-gray-100: #f3f4f6;
  --c-gray-900: #111827;
}
```

### Typography
- **Font Family**: Inter (primary), system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif
- **Font Sizes**: Gunakan Tailwind typography scale (text-xs hingga text-6xl)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Height**: 1.5 untuk body text, 1.2 untuk headings

### Spacing & Layout
- **Grid System**: Gunakan CSS Grid dan Flexbox
- **Spacing Scale**: Gunakan Tailwind spacing (4px increments)
- **Container**: Max-width untuk mobile-first design
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

### Components Design Rules
- **Border Radius**: 8px (rounded-lg), 16px (rounded-2xl), 24px (rounded-3xl), 1.6rem (rounded-3xl custom)
- **Shadows**: Gunakan custom shadow `shadow-soft: '0 8px 28px rgba(2,22,47,.08)'`
- **Transitions**: 150ms ease-in-out untuk hover states
- **Focus States**: Selalu sediakan focus indicators yang jelas
- **Dark Mode**: Gunakan class-based dark mode dengan `darkMode: 'class'`

## 💻 Coding Standards

### JavaScript/React
```javascript
// ✅ Good - Component dengan hooks dan auth store
const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()
  const [loading, setLoading] = useState(false)
  
  const handleAction = useCallback((data) => {
    setLoading(true)
    // Handle action
    setLoading(false)
  }, [])
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return (
    <div className={`dashboard ${theme === 'dark' ? 'dark' : ''}`}>
      {loading && <CustomLoading />}
      {/* Component content */}
    </div>
  )
}

// ❌ Bad - Tidak menggunakan store pattern
function dashboard(props) {
  var user = localStorage.getItem('user')
  
  return <div>{/* content */}</div>
}
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `IncomeCard`, `ProtectedRoute`)
- **Files**: PascalCase untuk components (`UserProfile.jsx`, `BottomNav.jsx`)
- **Stores**: camelCase dengan suffix Store (`authStore.js`, `themeStore.js`)
- **Variables**: camelCase (`userName`, `isLoading`, `fetchData`)
- **Constants**: UPPER_SNAKE_CASE (`VITE_API_ROUTES`, `VITE_APP_SALT`)
- **CSS Classes**: kebab-case atau Tailwind classes

### Import/Export Rules
```javascript
// ✅ Good - Import order dan pattern
import React, { useState, useEffect, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import CustomLoading from '../components/CustomLoading'
import BottomNav from '../components/BottomNav'

// ✅ Good - Default export untuk components
const Dashboard = () => { /* */ }
export default Dashboard

// ✅ Good - Named exports untuk utilities dan stores
export const useDebounce = (value, delay) => { /* */ }
```

### Error Handling
```javascript
// ✅ Good
const fetchUserData = async () => {
  try {
    setLoading(true)
    const response = await userService.getProfile()
    
    if (response.success) {
      setUser(response.data)
    } else {
      setError(response.error || 'Failed to fetch user data')
    }
  } catch (error) {
    setError('Network error occurred')
    console.error('User fetch error:', error)
  } finally {
    setLoading(false)
  }
}
```

## 🚀 PWA & Performance Guidelines

### Progressive Web App
- **Service Worker**: Gunakan VitePWA plugin untuk auto-generate service worker
- **Manifest**: Konfigurasi PWA manifest untuk installable app
- **Offline Support**: Implementasikan offline-first strategy
- **Cache Strategy**: Gunakan workbox untuk caching assets dan API responses
- **App Shell**: Implementasikan app shell architecture

### React Optimization
- **Lazy Loading**: Gunakan `React.lazy()` untuk code splitting routes
- **Memoization**: Gunakan `useMemo` dan `useCallback` untuk expensive operations
- **Custom Hooks**: Buat custom hooks seperti `useDebounce` untuk reusable logic
- **State Optimization**: Gunakan Zustand dengan persist untuk optimal state management
- **Component Splitting**: Pisahkan komponen besar menjadi komponen kecil yang reusable

### Bundle Optimization
- **Vite Configuration**: Gunakan Vite untuk fast development dan optimized builds
- **Tree Shaking**: Import hanya yang diperlukan dari libraries
- **Code Splitting**: Split berdasarkan routes dan features
- **Asset Optimization**: Compress images dan optimize fonts
- **Environment Variables**: Gunakan `VITE_` prefix untuk environment variables

## 🧪 Testing Standards

### Unit Testing
```javascript
// ✅ Good
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Button from './Button'

describe('Button Component', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Rules
- **Coverage**: Minimum 80% code coverage
- **Test Files**: Co-locate dengan component (`Button.test.jsx`)
- **Naming**: Descriptive test names
- **Mocking**: Mock external dependencies

## 🔒 Security Guidelines

### Data Handling
- **Input Validation**: Validasi semua user input
- **XSS Prevention**: Gunakan dangerouslySetInnerHTML dengan hati-hati
- **CSRF Protection**: Implementasikan CSRF tokens untuk forms
- **Sensitive Data**: Jangan log sensitive information

### Authentication
- **Token Storage**: Gunakan httpOnly cookies untuk auth tokens
- **Session Management**: Implementasikan proper session timeout
- **Route Protection**: Protect private routes dengan auth guards

## 📱 Responsive Design

### Mobile-First Approach
```css
/* ✅ Good - Mobile first */
.component {
  @apply text-sm p-4;
}

@media (min-width: 768px) {
  .component {
    @apply text-base p-6;
  }
}

/* ❌ Bad - Desktop first */
.component {
  @apply text-base p-6;
}

@media (max-width: 767px) {
  .component {
    @apply text-sm p-4;
  }
}
```

### Breakpoint Strategy
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+
- **Touch Targets**: Minimum 44px untuk touch elements

## 🚀 Deployment Guidelines

### Build Process
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (jika tersedia)
npm run lint

# Run tests (jika tersedia)
npm run test
```

### Environment Variables
```bash
# .env
VITE_API_ROUTES=https://api.example.com
VITE_APP_SALT=your_app_salt_here
VITE_APP_SECRET=your_app_secret_here
```

### Pre-deployment Checklist
- [ ] All tests passing (jika ada)
- [ ] No console errors
- [ ] PWA manifest configured
- [ ] Service worker working
- [ ] Offline functionality tested
- [ ] Performance audit passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Dark mode functionality working

## 📚 Documentation Standards

### Component Documentation
```javascript
/**
 * ProtectedRoute component untuk melindungi route yang memerlukan autentikasi
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components yang akan di-render jika authenticated
 * 
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * CustomLoading component untuk menampilkan loading state
 * 
 * @example
 * {loading && <CustomLoading />}
 */
const CustomLoading = () => {
  return (
    <div className="loading-container">
      {/* Loading animation */}
    </div>
  )
}
```

### Store Documentation
```javascript
/**
 * Auth Store - Mengelola state autentikasi user
 * 
 * @property {Object|null} user - Data user yang sedang login
 * @property {boolean} isAuthenticated - Status autentikasi
 * @property {string|null} token - JWT token
 * 
 * @method login - Login user dengan credentials
 * @method logout - Logout user dan clear state
 * @method setUser - Set data user
 */
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  // methods...
}))
```

### README Requirements
- **Installation**: Clear setup instructions
- **Usage**: Basic usage examples
- **API**: Component props and methods
- **Contributing**: Contribution guidelines

## 🔄 Git Workflow

### Branch Naming
- **Feature**: `feature/user-authentication`
- **Bugfix**: `bugfix/login-validation`
- **Hotfix**: `hotfix/security-patch`
- **Release**: `release/v1.2.0`

### Commit Messages
```bash
# ✅ Good
feat: add user authentication system
fix: resolve login validation issue
docs: update API documentation
style: format code with prettier
refactor: optimize user store performance
test: add unit tests for Button component

# ❌ Bad
update stuff
fix bug
changes
```

### Pull Request Rules
- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Screenshots**: Include for UI changes
- **Testing**: Describe testing performed
- **Review**: Minimum 1 reviewer required

## 🎯 Best Practices Summary

1. **Consistency**: Follow established patterns
2. **Performance**: Optimize for speed and efficiency
3. **Accessibility**: Ensure inclusive design
4. **Security**: Implement security best practices
5. **Testing**: Write comprehensive tests
6. **Documentation**: Document code and decisions
7. **Collaboration**: Use clear communication
8. **Continuous Learning**: Stay updated with best practices

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: CTS Development Team