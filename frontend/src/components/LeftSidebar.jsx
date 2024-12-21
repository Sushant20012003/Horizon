import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from 'react';

const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <TrendingUp />, text: "Explore" },

    {
        icon: (
            <Avatar className="w-6 h-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile",
    },
    // Add a class to hide the Logout icon on mobile
    { icon: <LogOut />, text: "Logout", hideOnMobile: true },
];

export default function LeftSidebar() {

    const sidebarHandler = (actionType) => {
        alert(actionType);
    }

    return (
        <div className=''>
            {/* Sidebar for large screens */}
            <div className="fixed hidden lg:flex flex-col top-0 left-0 z-10 px-4 border-r border-gray-300 w-[16%] h-screen bg-white">
                <h1 className="text-lg font-bold mb-4">LOGO</h1>
                {sidebarItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 ${item.hideOnMobile ? "hidden lg:flex" : ""
                            }`}
                        onClick={() => sidebarHandler(item.text)}
                    >
                        <span className="text-gray-600">{item.icon}</span>
                        <span className="text-gray-800">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Mobile layout */}

            {/* Top bar */}
            <div className="sticky inset-x-0 top-0 flex justify-between items-center border-b border-gray-300 p-4 bg-white z-50 lg:hidden">
                {/* Left: LOGO */}
                <h1 className="text-lg font-bold">LOGO</h1>

                {/* Right: Notification and Messages */}
                <div className="flex gap-4">
                    <div
                        className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
                        onClick={() => sidebarHandler('Notification')}
                    >
                        <span>
                            <Heart />
                        </span>
                        <span className="text-xs">Notification</span>
                    </div>
                    <div
                        className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
                        onClick={() => sidebarHandler('Messages')}
                    >
                        <span>
                            <MessageCircle />
                        </span>
                        <span className="text-xs">Messages</span>
                    </div>
                </div>
            </div>


            {/* Bottom navigation */}

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
                            <span className="text-xs">{item.text}</span>
                        </div>
                    ))}
            </div>



        </div>

    );
}
