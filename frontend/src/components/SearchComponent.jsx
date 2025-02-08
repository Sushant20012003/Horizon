import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog';
import { CiSearch } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/config/apiConfig';

export default function SearchComponent({ open, setOpen }) {

    const [text, setText] = useState();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (text) {
            const fetchUsers = async () => {
                let response = await fetch(`${BASE_URL}/api/v1/user/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: text }),
                    credentials: 'include'
                });

                response = await response.json();

                if (response.success) {
                    console.log('searched users fetched!');
                    setUsers(response.users);
                }
            }

            fetchUsers();
        }
        else {
            setUsers([]);
        }
    }, [text]);


    const navigateHandler = (id)=> {
        navigate(`/profile/${id}`);
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open}>
                <DialogContent onInteractOutside={() => setOpen(false)} className='rounded-xl'>
                    <div className="flex flex-col items-center w-[90vw] md:w-[500px] h-[80vh]">
                        <div className="flex w-[90%] h-8 md:h-10  gap-3 px-3 items-center bg-gray-300 mt-3 rounded-[10px] mb-6">
                            <CiSearch size={20} />
                            <input type="text" placeholder="Search..." className='focus:outline-none bg-gray-300 w-full' value={text} onChange={(e) => setText(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-3 w-[90%]">
                            {
                                users?.map((user, index) => {
                                    return (
                                        <div className="flex gap-2 items-center cursor-pointer" onClick={()=>navigateHandler(user._id)} key={index}>
                                            <Avatar>
                                                <AvatarImage src={user?.profilePicture} alt='profile picture' />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <span className='text-sm font-medium'>{user?.username}</span>
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
