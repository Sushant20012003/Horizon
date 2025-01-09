import store from '@/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { setIsNotificationVisible } from '@/redux/rtnSlice';
import { setFollowingUser } from '@/redux/authSlice';

export default function NotificationPage() {

    const { notification, isNotificationVisible } = useSelector(store => store.realTimeNotification);
    const navigate = useNavigate();
    const notificationRef = useRef(null);
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth);

    // Handle click outside the notification box
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                dispatch(setIsNotificationVisible(false));
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const followUnfollowHandler = async(id)=>{
              try {
                  let response = await fetch(`http://localhost:8000/api/v1/user/followorunfollow/${id}`, {
                      method:"POST",
                      headers:{
                          'Content-Type':'application/json'
                      },
                      credentials:'include'
                  });
      
                  response = await response.json();
      
                  if(response.success) {
                      console.log(response.message);
                      dispatch(setFollowingUser(id));
                      
                  }
      
              } catch (error) {
                  console.log(error);
                  
              }
          }

    return (
        <div className="relative ml-[16%] z-10">

            {/* Notification Box */}
            <div
                className={`fixed top-0 left-[16%] h-full w-[400px] bg-gray-800 text-white shadow-lg p-6 transform transition-transform duration-500 ${isNotificationVisible ? 'translate-x-0 ' : '-translate-x-[400px] '
                    }`}
                ref={notificationRef}
            >
                <span className='absolute right-0 text-xl mr-3 cursor-pointer' onClick={() => dispatch(setIsNotificationVisible(false))}>X</span>
                <h2 className="text-2xl font-bold mb-4">Notification</h2>
                <div className="flex flex-col gap-4">
                    {
                        notification?.slice().reverse().map((notification, i) => {
                            return (
                                <div className="flex justify-between" key={i}>
                                    <div className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={notification?.userDetails?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p><span className='font-medium'>{notification?.userDetails?.username}</span>  <span className='font-thin'>{notification?.type === 'like'? 'liked your post.': 'following you.'}</span></p>
                                    </div>
                                    <button className={`${user.following.includes(notification?.userId)?'bg-gray-400 hover:bg-gray-500 text-black':'bg-blue-500 hover:bg-blue-600'} py-1 px-3 rounded-[8px] text-sm font-medium `} onClick={()=>followUnfollowHandler(notification?.userId)}>{user.following.includes(notification?.userId)?'Unfollow':'Follow'}</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}
