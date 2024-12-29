import store from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function SuggestedUser() {

    const { suggestedUsers } = useSelector(store => store.auth);

    return (
        <div className='mt-8 h-[270px] overflow-hidden w-[300px]'>
            <div className="flex justify-between">
                <h1 className='font-semibold text-gray-500'>Suggested for you</h1>
                <Link className='font-semibold text-gray-500'>See All</Link>
            </div>
            <div className=''>
                {
                    suggestedUsers.map((user, index) => {
                        return (
                            <div key={index} className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8">
                                        <AvatarImage src={user.profilePicture} alt="author_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <h1>{user.username}</h1>
                                </div>
                                <span className="text-sm font-medium text-blue-600">Follow</span>
                            </div>
                        )

                    }
                    )
                }
            </div>
        </div>
    )
}
