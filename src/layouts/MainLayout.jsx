import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import Header from '../components/Header'

const MainLayout = () => {
  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen">
      <main className="max-w-sm mx-auto min-h-screen safe-bottom relative">
        <Header />
        <Outlet />
        <div className="h-28"></div>
        <BottomNav />
      </main>
    </div>
  )
}

export default MainLayout