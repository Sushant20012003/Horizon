import store from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import SuggestedUser from './SuggestedUser';
import { Link, useNavigate } from 'react-router-dom';

export default function RightSidebar() {

  const { user } = useSelector(store => store.auth);

  return (
    <div className='mt-14 pr-56 pl-10'>
      <div className="">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user._id}`}>
        <Avatar className="size-9">
          <AvatarImage src={user.profilePicture} alt="author_image" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </Link>
        <Link to={`/profile/${user._id}`}><h1>{user.username}</h1></Link>

      </div>
      <SuggestedUser/>
      </div>
    </div>
  )
}
