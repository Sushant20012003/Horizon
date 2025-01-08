import React from 'react';
import Feed from './Feed';
import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers';

export default function Home() {

  useGetSuggestedUsers();

  return (
    <div className='flex z-1'>
      <div className='flex-grow'>
        <Feed />
        <Outlet />
      </div>

      {/* RightSidebar will be hidden on small screens and appear only on medium and larger screens */}
      <div className="hidden lg:block w-[35%]">
        <RightSidebar />
      </div>
    </div>
  );
}
