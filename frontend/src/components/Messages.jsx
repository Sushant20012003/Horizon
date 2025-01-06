import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { useGetAllMessages } from '@/hooks/useGetAllMessages'
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { setMessages } from '@/redux/chatSlice';
import { setSelectedParticipant } from '@/redux/conversationSlice';
import { useGetRTM } from '@/hooks/useGetRTM';

export default function Messages({ selectedUser }) {

    useGetAllMessages();
    useGetRTM();
    const {messages} = useSelector(store=>store.chat);
    const dispatch = useDispatch();

    return (
        <div className='overflow-y-auto flex-1 p-4 '>
            <div className='flex justify-center mb-5'>
                <div className="flex flex-col justify-center items-center gap-2">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedUser.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span>{selectedUser.username}</span>
                    <Link><button className='bg-gray-200 px-3 py-1 rounded-[7px]'>View Profile</button></Link>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {
                    messages && messages.map((message)=>{
                        return(
                            <div key={message._id} className={`flex  ${selectedUser?._id === message.senderId? 'justify-start': 'justify-end'}`}>
                                <span className={`w-fit px-5 py-1 rounded-xl ${selectedUser?._id === message.senderId? 'bg-gray-300':'bg-blue-500 text-white'}`}>{message.message}</span>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}
