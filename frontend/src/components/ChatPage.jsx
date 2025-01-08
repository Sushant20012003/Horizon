import useGetConversationUsers from '@/hooks/useGetConversationUsers'
import store from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedParticipant } from '@/redux/conversationSlice';
import Messages from './Messages';
import { MessageCircleCode } from 'lucide-react';
import { setMessages, setNewMessage } from '@/redux/chatSlice';
import { use } from 'react';
import { useGetAllMessages } from '@/hooks/useGetAllMessages';

export default function ChatPage() {

    const { user } = useSelector(store => store.auth);
    useGetConversationUsers(user._id);
    const { participants, selectedParticipant } = useSelector(store => store.conversation);
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(store => store.chat);

    const [textMessage, setTextMessage] = useState();



    const sendMessageHandler = async (receiverId) => {
        try {
            let response = await fetch(`http://localhost:8000/api/v1/message/send/${receiverId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: textMessage }),
                credentials: 'include'
            });
            response = await response.json();

            if (response.success) {
                dispatch(setNewMessage(response.newMessage));
                console.log('Message send');
                setTextMessage("");

            }
        } catch (error) {
            console.log(error);

        }
    }


    useEffect(()=>{
        return ()=>{
            dispatch(setSelectedParticipant(null));
        }
    },[]);



    return (
        <div className='flex ml-[16%] h-screen '>
            <div className="w-[500px]  border-r">
                <h1 className='font-bold text-2xl my-5 pl-3'>{user?.username}</h1>
                <div className='flex px-3 justify-between'>
                    <span className='font-medium text-lg'>Messages</span>

                </div>
                <div className="flex flex-col mt-5 overflow-y-auto">
                    {
                        participants?.map((participant) => {

                            const isOnline = onlineUsers.includes(participant?._id)

                            return (
                                <div key={participant?._id} className='flex items-center py-2 gap-3 hover:bg-gray-100 pl-3' onClick={() => dispatch(setSelectedParticipant(participant))}>
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={participant?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className={` ${isOnline ? 'text-base font-medium' : 'text-lg'}`}>{participant.username}</span>
                                        <span className={`text-xs font-bold ${isOnline ? 'text-green-700' : 'hidden'}`}>online</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
            {
                selectedParticipant ?
                    <div className='relative w-full'>
                        <div className='flex flex-col justify-between h-[97vh] '>
                            <div className='flex items-center gap-3 p-5 border-b'>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedParticipant.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <span className='text-lg'>{selectedParticipant.username}</span>
                                {
                                    onlineUsers.includes(selectedParticipant?._id) && <span className='size-3 rounded-full bg-green-600 absolute top-14 left-14'></span>
                                }

                            </div>
                            <Messages selectedUser={selectedParticipant} />
                            <div className='pt-2'>
                                <div className='flex w-[90%] justify-between px-5 py-2 border mx-auto rounded-2xl'>
                                    <input type="text" placeholder='Message...' value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className='focus:outline-none bg-white w-full' />
                                    <button onClick={() => sendMessageHandler(selectedParticipant?._id)} className='text-blue-600 active:text-blue-700 font-semibold'>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className='flex justify-center items-center w-full'>
                        <div className="flex flex-col justify-center items-center w-[40%]">
                            <MessageCircleCode className='size-32 border-4 border-black rounded-[40%] p-5 w-fit mb-5' />
                            <span className='text-xl font-[400]'>Your message</span>
                            <p>Send message to start chat</p>

                        </div>
                    </div>
            }

        </div>
    )
}
