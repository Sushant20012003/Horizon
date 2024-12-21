import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';

export default function Home() {
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>

      {/* RightSidebar will be hidden on small screens and appear only on medium and larger screens */}
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
