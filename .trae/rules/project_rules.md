# CTS Merchant - Project Rules & Guidelines

## 📋 Overview

Dokumen ini berisi aturan dan panduan pengembangan untuk proyek CTS Merchant React PWA. Aplikasi ini adalah Progressive Web App yang dibangun dengan React, Vite, dan Tailwind CSS untuk merchant CTS Soundbox dengan fitur POS, PPOB, Invoice, dan Customer Support.

## 🏗️ Architecture Guidelines

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── alert/          # Alert components (SimpleAlert)
│   ├── card/           # Card components (ProductCard)
│   ├── cs/             # Customer Support components (ChatBubble, LiveChat, etc.)
│   ├── form/           # Form components (SimpleInput, CustomCheckbox, etc.)
│   ├── modal/          # Modal components (SimpleModal)
│   ├── ppob/           # PPOB specific components (PPOBCard, BalanceCard, etc.)
│   └── *.jsx           # Main components (BottomNav, Header, ProtectedRoute, etc.)
├── layouts/             # Layout components (MainLayout)
├── pages/               # Page components (routes)
│   ├── Invoice/        # Invoice related pages (add, detail, index)
│   ├── POS/            # Point of Sale pages (products, transaction, etc.)
│   ├── ppob/           # PPOB service pages (PPOB, PPOBPulsa, PPOBListrik, etc.)
│   └── *.jsx           # Main pages (Home, Login, Profile, etc.)
├── services/            # API services & external integrations
├── store/               # State management (Zustand stores)
├── hooks/               # Custom React hooks (useDebounce)
├── helper/              # Utility functions (currency, format-date, is-empty)
└── index.css           # Global styles & Tailwind imports
```

### Component Architecture
- **Atomic Design**: Gunakan prinsip atomic design (atoms, molecules, organisms)
- **Single Responsibility**: Setiap komponen hanya memiliki satu tanggung jawab
- **Composition over Inheritance**: Gunakan composition pattern
- **Component Organization**: Pisahkan komponen berdasarkan fungsi dan domain:
  - `alert/` - Alert dan notification components
  - `card/` - Card-based UI components
  - `cs/` - Customer Support related components (ChatBubble, LiveChat, FeedbackForm, GuideAccordion)
  - `form/` - Form input components (SimpleInput, CustomCheckbox, CustomSelectBox, CustomTextarea, CustomInputFile)
  - `modal/` - Modal dan overlay components
  - `ppob/` - PPOB service specific components (PPOBCard, BalanceCard, TransactionCard, etc.)
- **Route Protection**: Gunakan ProtectedRoute dan PublicRoute untuk auth guards
- **Layout System**: Gunakan MainLayout dengan Header, BottomNav, dan ChatBubble
- **Modal Components**: Gunakan IframeModal, PromoDetailModal, PopupBox, BottomModal, BottomSheet untuk UI overlay
- **Responsive Container**: Gunakan `max-w-sm mx-auto` untuk mobile-first container design

### Page Architecture
- **Feature-based Pages**: Organisasi pages berdasarkan fitur bisnis:
  - `Invoice/` - Invoice management (add, detail, index)
  - `POS/` - Point of Sale system (products, transaction, categories, etc.)
  - `ppob/` - Payment Point Online Bank services (pulsa, listrik, game, etc.)
- **Page Naming**: Gunakan kebab-case untuk nested pages (`add-products.jsx`, `products-detail.jsx`)
- **Route Structure**: Implementasikan nested routing untuk feature modules

### State Management
- **Zustand**: Gunakan Zustand untuk global state management
- **Store Separation**: Pisahkan store berdasarkan domain dan fitur:
  - `authStore.js` - Authentication, session management, auto-logout
  - `themeStore.js` - Dark/light theme dengan persist
  - `userDataStore.js` - User profile data
  - `cartStore.js` - Shopping cart dan POS cart management
  - `posStore.js` - Point of Sale operations
  - `ppobStore.js` - PPOB services (balance, commission, stats)
  - `ppobProductStore.js` - PPOB product catalog
  - `ppobTransactionStore.js` - PPOB transaction history
  - `invoiceStore.js` - Invoice management
  - `transactionStore.js` - Transaction history
  - `fetchDataStore.js` - API data fetching states
  - `faqStore.js` - FAQ data management
  - `tokenStore.js` - Token management
  - `sessionStore.js` - Session data management
  - `chatStore.js` - Customer support chat
  - `csStore.js` - Customer support system
  - `ticketStore.js` - Support ticket management
  - `feedbackStore.js` - User feedback system
  - `checkoutStore.js` - Checkout process
  - `productStore.js` - Product catalog
  - `dashboardStore.js` - Dashboard data
  - `totalPriceStore.js` - Price calculation
  - `checkEmptyStore.js` - Empty state management
- **Local State**: Gunakan useState untuk state lokal komponen
- **Immutability**: Selalu update state secara immutable
- **Persistence**: Gunakan zustand/middleware persist untuk data yang perlu disimpan (theme, auth)
- **Session Storage**: Gunakan sessionStorage untuk auth tokens, user data, dan temporary data
- **Store Patterns**: Implementasikan async actions dalam store untuk API calls

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
- **Container**: `max-w-sm mx-auto` untuk mobile-first design dengan centered layout
- **Layout Structure**: `min-h-screen` dengan `bg-gray-100 dark:bg-slate-900`
- **Safe Area**: Gunakan `safe-bottom` class untuk iOS safe area handling
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Scroll Behavior**: Auto scroll to top pada route change

### Components Design Rules
- **Border Radius**: 8px (rounded-lg), 16px (rounded-2xl), 24px (rounded-3xl), 1.6rem (rounded-3xl custom)
- **Shadows**: Gunakan custom shadow `shadow-soft: '0 8px 28px rgba(2,22,47,.08)'`
- **Transitions**: 150ms ease-in-out untuk hover states, 420ms cubic-bezier(0.2, 0.9, 0.2, 1) untuk carousel
- **Focus States**: Selalu sediakan focus indicators yang jelas
- **Dark Mode**: Gunakan class-based dark mode dengan `darkMode: 'class'`
- **Overlay**: Gunakan `overlay-bg` class untuk modal backgrounds dengan backdrop-filter blur
- **Carousel**: Implementasikan dengan CSS transforms dan will-change optimization

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
- **Components**: PascalCase (`UserProfile`, `IncomeCard`, `ProtectedRoute`, `PPOBCard`)
- **Files**: PascalCase untuk components (`UserProfile.jsx`, `BottomNav.jsx`, `PPOBPulsa.jsx`)
- **Nested Pages**: kebab-case untuk nested pages (`add-products.jsx`, `products-detail.jsx`)
- **Stores**: camelCase dengan suffix Store (`authStore.js`, `themeStore.js`, `ppobStore.js`)
- **Variables**: camelCase (`userName`, `isLoading`, `fetchData`, `activeBranch`)
- **Constants**: UPPER_SNAKE_CASE (`VITE_API_ROUTES`, `VITE_APP_SALT`, `TOKEN_KEY`, `SESSION_KEY`)
- **CSS Classes**: kebab-case atau Tailwind classes (`overlay-bg`, `safe-bottom`, `carousel-track`)
- **Store Keys**: UPPER_SNAKE_CASE untuk sessionStorage keys (`TOKEN_KEY`, `SESSION_KEY`, `EXPIRED_KEY`)

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

### PWA Configuration
- **Service Worker**: Gunakan VitePWA plugin dengan workbox untuk auto-generate service worker
- **Manifest**: Konfigurasi PWA manifest dengan:
  - `name`: "CTS Merchant"
  - `short_name`: "CTS Merchant"
  - `theme_color`: "#002F6C" (CTS Primary Blue)
  - `background_color`: "#ffffff"
  - `display`: "standalone"
  - `orientation`: "portrait"
  - `scope`: "/"
  - `start_url`: "/"
- **Icons**: Gunakan icon sizes 192x192 dan 512x512 untuk berbagai device
- **Offline Support**: Implementasikan offline-first strategy dengan workbox
- **Cache Strategy**: 
  - `NetworkFirst` untuk navigasi
  - `CacheFirst` untuk assets (images, fonts)
  - `StaleWhileRevalidate` untuk API responses
- **App Shell**: Implementasikan app shell architecture dengan MainLayout
- **Update Prompt**: Gunakan `useRegisterSW` untuk menampilkan update notification

### React Optimization
- **Lazy Loading**: Gunakan `React.lazy()` untuk code splitting routes
- **Memoization**: Gunakan `useMemo` dan `useCallback` untuk expensive operations
- **Custom Hooks**: Buat custom hooks seperti `useDebounce` untuk reusable logic
- **State Optimization**: Gunakan Zustand dengan persist untuk optimal state management
- **Component Splitting**: Pisahkan komponen besar menjadi komponen kecil yang reusable

### Bundle Optimization
- **Vite Configuration**: Gunakan Vite untuk fast development dan optimized builds
- **Tree Shaking**: Import hanya yang diperlukan dari libraries
- **Code Splitting**: Split berdasarkan routes dan features menggunakan `React.lazy()`
- **Asset Optimization**: Compress images dan optimize fonts
- **Environment Variables**: Gunakan `VITE_` prefix untuk environment variables
- **Build Target**: ES2020 untuk modern browser support
- **Chunk Strategy**: Vendor chunks terpisah untuk better caching

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
- **Testing Environment**: jsdom untuk DOM simulation
- **Transformations**: babel-jest untuk ES6+ dan JSX
- **CSS Mocking**: identity-obj-proxy untuk CSS imports
- **Naming**: Descriptive test names dengan describe/it pattern
- **Mocking**: Mock external dependencies dan API calls
- **Store Testing**: Test Zustand stores dengan act() untuk async operations

## 🔒 Security Guidelines

### Data Handling
- **Input Validation**: Validasi semua user input
- **XSS Prevention**: Gunakan dangerouslySetInnerHTML dengan hati-hati
- **CSRF Protection**: Implementasikan CSRF tokens untuk forms
- **Sensitive Data**: Jangan log sensitive information

### Authentication & Authorization
- **Token Storage**: Gunakan sessionStorage untuk auth tokens dengan auto-cleanup
- **Session Management**: Implementasikan proper session timeout dengan auto-logout
- **Route Protection**: Protect private routes dengan `ProtectedRoute` dan `PublicRoute` guards
- **Auth Store Pattern**: Centralized authentication state dengan Zustand
- **Token Refresh**: Implementasikan token refresh mechanism
- **Branch Management**: Handle multi-branch access dengan `activeBranch` state
- **Auto Logout**: Implementasikan auto-logout pada token expiry

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
VITE_API_BASE_URL=https://api.example.com
VITE_POS_API_URL=https://pos-api.example.com
VITE_PPOB_API_URL=https://ppob-api.example.com
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

## 🛠️ Utility Functions & Helpers

### Helper Functions
- **Currency Formatting**: Gunakan `formatCurrency()` dari `src/helper/currency.js`
  - Support multiple formats (Indonesian, international)
  - Auto-clean input strings
  - Handle various separators (comma, dot)
- **Debouncing**: Gunakan `useDebounce()` hook dari `src/hooks/useDebounce.js`
  - Optimize search inputs dan API calls
  - Configurable delay (default 500ms)
- **Date Formatting**: Implementasikan helper untuk format tanggal Indonesia
- **Validation**: Buat helper functions untuk validasi form
- **API Helpers**: Centralized API error handling dan response formatting

### Custom Hooks
- **useDebounce**: Debounce values untuk search dan input optimization
- **useAuth**: Custom hook untuk authentication state
- **useTheme**: Custom hook untuk theme management
- **useLocalStorage**: Custom hook untuk localStorage operations
- **useSessionStorage**: Custom hook untuk sessionStorage operations


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