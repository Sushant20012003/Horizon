import { Sidebar } from 'lucide-react'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div>
        Sidebar
        <Outlet/>
    </div>
  )
}
