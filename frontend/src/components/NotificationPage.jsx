import store from '@/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { setIsNotificationVisible } from '@/redux/rtnSlice';
import { setFollowingUser } from '@/redux/authSlice';
import { BASE_URL } from '@/config/apiConfig';

export default function NotificationPage() {

    const { notification, isNotificationVisible } = useSelector(store => store.realTimeNotification);
    const navigate = useNavigate();
    const notificationRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

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


    const followUnfollowHandler = async (id) => {
        try {
            let response = await fetch(`${BASE_URL}/api/v1/user/followorunfollow/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            response = await response.json();

            if (response.success) {
                console.log(response.message);
                dispatch(setFollowingUser(id));

            }

        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className="relative z-10">
            {/* Notification Box */}
            <div
                className={`fixed top-0 left-0  lg:left-[16%] h-full sm:w-[300px] md:w-[400px] w-full bg-gray-800 text-white shadow-lg p-4 sm:p-6 transform transition-transform duration-500 overflow-y-auto ${isNotificationVisible ? 'translate-x-0' : '-translate-x-full'
                    }`}
                ref={notificationRef}
            >
                <span
                    className="absolute right-2 top-2 text-xl cursor-pointer"
                    onClick={() => dispatch(setIsNotificationVisible(false))}
                >
                    X
                </span>
                <h2 className="text-xl md:text-2xl font-bold mb-4">Notification</h2>
                <div className="flex flex-col gap-4">
                    {notification?.slice().reverse().map((notification, i) => {
                        return (
                            <div className="flex justify-between items-center" key={i}>
                                <div className="flex gap-2 items-center">
                                    <Avatar>
                                        <AvatarImage src={notification?.userDetails?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <p className="text-sm sm:text-base">
                                        <span className="font-medium">
                                            {notification?.userDetails?.username}
                                        </span>{' '}
                                        <span className="font-thin">
                                            {notification?.type === 'like'
                                                ? 'liked your post.'
                                                : 'following you.'}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    className={`${user.following.includes(notification?.userId)
                                            ? 'bg-gray-400 hover:bg-gray-500 text-black'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        } py-1 px-2 sm:px-3 rounded-[8px] text-xs sm:text-sm font-medium`}
                                    onClick={() => followUnfollowHandler(notification?.userId)}
                                >
                                    {user.following.includes(notification?.userId)
                                        ? 'Unfollow'
                                        : 'Follow'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

    );
}
