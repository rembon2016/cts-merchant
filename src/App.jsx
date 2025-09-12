import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import { useThemeStore } from './store/themeStore'

function App() {
  const { isDark } = useThemeStore()

  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App