# CTS Merchant - Project Rules & Guidelines

## 📋 Overview

Dokumen ini berisi aturan dan panduan pengembangan untuk proyek CTS Merchant React Dashboard. Semua developer wajib mengikuti aturan ini untuk menjaga konsistensi dan kualitas kode.

## 🏗️ Architecture Guidelines

### Folder Structure
```
src/
├── components/          # Reusable UI components
├── layouts/             # Layout components
├── pages/               # Page components (routes)
├── services/            # API services & external integrations
├── store/               # State management (Zustand)
├── utils/               # Utility functions
├── hooks/               # Custom React hooks
├── constants/           # Application constants
└── types/               # TypeScript type definitions
```

### Component Architecture
- **Atomic Design**: Gunakan prinsip atomic design (atoms, molecules, organisms)
- **Single Responsibility**: Setiap komponen hanya memiliki satu tanggung jawab
- **Composition over Inheritance**: Gunakan composition pattern
- **Props Interface**: Definisikan props dengan jelas menggunakan PropTypes atau TypeScript

### State Management
- **Zustand**: Gunakan Zustand untuk global state management
- **Local State**: Gunakan useState untuk state lokal komponen
- **Store Structure**: Pisahkan store berdasarkan domain (userStore, themeStore, etc.)
- **Immutability**: Selalu update state secara immutable

## 🎨 Design System

### Color Palette
```css
:root {
  --c-primary: #3b82f6;     /* Blue 500 */
  --c-accent: #10b981;      /* Emerald 500 */
  --c-success: #22c55e;     /* Green 500 */
  --c-warning: #f59e0b;     /* Amber 500 */
  --c-error: #ef4444;       /* Red 500 */
  --c-gray-50: #f9fafb;
  --c-gray-100: #f3f4f6;
  --c-gray-900: #111827;
}
```

### Typography
- **Font Family**: Inter (primary), system fonts (fallback)
- **Font Sizes**: Gunakan Tailwind typography scale (text-xs hingga text-6xl)
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line Height**: 1.5 untuk body text, 1.2 untuk headings

### Spacing & Layout
- **Grid System**: Gunakan CSS Grid dan Flexbox
- **Spacing Scale**: Gunakan Tailwind spacing (4px increments)
- **Container**: Max-width 1200px untuk desktop
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

### Components Design Rules
- **Border Radius**: 8px (rounded-lg), 16px (rounded-2xl), 24px (rounded-3xl)
- **Shadows**: Gunakan custom shadow `shadow-soft`
- **Transitions**: 150ms ease-in-out untuk hover states
- **Focus States**: Selalu sediakan focus indicators yang jelas

## 💻 Coding Standards

### JavaScript/React
```javascript
// ✅ Good
const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  
  const handleSave = useCallback((data) => {
    onUpdate(data)
    setIsEditing(false)
  }, [onUpdate])
  
  return (
    <div className="user-profile">
      {/* Component content */}
    </div>
  )
}

// ❌ Bad
function userProfile(props) {
  var editing = false
  
  function save() {
    props.onUpdate()
    editing = false
  }
  
  return <div>{/* content */}</div>
}
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile`, `IncomeCard`)
- **Files**: PascalCase untuk components (`UserProfile.jsx`)
- **Variables**: camelCase (`userName`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: kebab-case (`user-profile`, `income-card`)

### Import/Export Rules
```javascript
// ✅ Good - Named exports untuk utilities
export const formatCurrency = (amount) => { /* */ }
export const validateEmail = (email) => { /* */ }

// ✅ Good - Default export untuk components
const UserProfile = () => { /* */ }
export default UserProfile

// ✅ Good - Import order
import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'react-router-dom'

import { useUserStore } from '../store/userStore'
import { formatCurrency } from '../utils/format'
import Button from '../components/Button'
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

## 🔧 Performance Guidelines

### React Optimization
- **Lazy Loading**: Gunakan `React.lazy()` untuk code splitting
- **Memoization**: Gunakan `useMemo` dan `useCallback` untuk expensive operations
- **Virtual Scrolling**: Implementasikan untuk list panjang
- **Image Optimization**: Gunakan format WebP, lazy loading untuk images

### Bundle Optimization
- **Tree Shaking**: Import hanya yang diperlukan
- **Code Splitting**: Split berdasarkan routes
- **Asset Optimization**: Compress images dan fonts
- **Caching**: Implementasikan proper caching strategy

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
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run tests
npm run test
```

### Environment Variables
```bash
# .env.example
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=CTS Merchant
VITE_APP_VERSION=1.0.0
```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance audit passed
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

## 📚 Documentation Standards

### Component Documentation
```javascript
/**
 * Button component with multiple variants and sizes
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Function} props.onClick - Click handler
 * @param {ReactNode} props.children - Button content
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Save Changes
 * </Button>
 */
const Button = ({ variant = 'primary', size = 'md', disabled = false, onClick, children }) => {
  // Component implementation
}
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