import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setToken } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import store from '@/redux/store';
import { setIsNotificationVisible } from '@/redux/rtnSlice';
import SearchComponent from './SearchComponent';
import { BASE_URL } from '@/config/apiConfig';



export default function LeftSidebar() {

    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openCreate, setOpenCreate] = useState(false);
    const { isNotificationVisible } = useSelector(store => store.realTimeNotification);
    const [openSearch, setOpenSearch] = useState(false);
    const { selectedParticipant } = useSelector(store => store.conversation);

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <PlusSquare />, text: "Create" },
        { icon: <MessageCircle />, text: "Messages", hideOnMobile: true },
        { icon: <Heart />, text: "Notifications", hideOnMobile: true },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile",
        },
        // Add a class to hide the Logout icon on mobile
        { icon: <LogOut />, text: "Logout", hideOnMobile: true },
    ];



    const sidebarHandler = async (actionType) => {
        if (actionType === "Logout") {
            try {
                let response = await fetch(`${BASE_URL}/api/v1/user/logout`, {
                    method: 'GET',
                    credentials: 'include'
                });
                response = await response.json();

                if (response.success) {
                    console.log(response.message);
                    dispatch(setAuthUser(null));
                    dispatch(setToken(null));
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);

            }
            return;
        }
        if (actionType === "Create") {
            setOpenCreate(true);
            return;
        }
        if (actionType === 'Home') {
            navigate('/');
            return;
        }
        if (actionType === 'Profile') {
            navigate(`/profile/${user._id}`);
            return;
        }
        if (actionType === 'Messages') {
            navigate('/chat');
            return;
        }
        if (actionType === 'Notifications') {
            dispatch(setIsNotificationVisible(!isNotificationVisible));
            return;
        }
        if (actionType === 'Search') {
            setOpenSearch(true);
        }

    }

    return (
        <div className='z-30'>
            {/* Sidebar for large screens */}
            <div className="fixed hidden lg:flex flex-col top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
                <h1 className="md:text-2xl font-bold mb-4 font-mono">Horizon</h1>
                {sidebarItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 ${item.hideOnMobile ? "hidden lg:flex" : ""}`}
                        onClick={() => sidebarHandler(item.text)}
                    >
                        <span className="text-gray-600">{item.icon}</span>
                        <span className="text-gray-800">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Mobile layout */}

            {/* Top bar */}
            {
                !selectedParticipant && <div className="fixed inset-x-0 top-0 flex h-[50px] justify-between items-center border-b border-gray-300 p-4 bg-white z-50 lg:hidden">
                    {/* Left: LOGO */}
                    <h1 className="text-xl font-bold font-mono">Horizon</h1>

                    {/* Right: Notification and Messages */}
                    <div className="flex gap-4">
                        <div
                            className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
                            onClick={() => sidebarHandler('Notifications')}
                        >
                            <span>
                                <Heart />
                            </span>

                        </div>
                        <div
                            className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
                            onClick={() => sidebarHandler('Messages')}
                        >
                            <span>
                                <MessageCircle />
                            </span>

                        </div>
                    </div>
                </div>
            }


            {/* Bottom navigation */}

            {
                !selectedParticipant &&
                <div className="fixed inset-x-0 bottom-0 flex justify-around items-center p-3 bg-white border-t border-gray-300 lg:hidden z-50">
                    {sidebarItems
                        .filter((item) => !item.hideOnMobile) // Filter out Logout on mobile
                        .map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
                                onClick={() => sidebarHandler(item.text)}
                            >
                                <span>{item.icon}</span>

                            </div>
                        ))}
                </div>
            }

            <CreatePost open={openCreate} setOpen={setOpenCreate} />
            <SearchComponent open={openSearch} setOpen={setOpenSearch} />
        </div>

    );
}
