import { Sidebar } from 'lucide-react'
import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import NotificationPage from './NotificationPage'

export default function MainLayout() {

  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  return (
    <div>
      {
        user ?
          <div>
            <NotificationPage />
            <LeftSidebar />
            <Outlet />
          </div> : <Navigate to="/login" />
      }
    </div>
  )
}
