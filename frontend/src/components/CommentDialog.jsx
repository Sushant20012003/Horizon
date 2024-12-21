import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { FiMessageCircle } from "react-icons/fi";
import { comment } from 'postcss'

export default function CommentDialog({ post, open, setOpen }) {

    const [text, setText] = useState("");

    const changeEventHandler = (e) => {
        if (e.target.value.trim()) {
            setText(e.target.value);
        }
        else {
            setText("");
        }
    }


    return (
        <div>
            <div className='hidden lg:block'>
                <Dialog open={open}>
                    <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-[980px] p-0 m-0 " >
                        <div className="flex">
                            <div className='w-1/2'>
                                <img
                                    src={post.image} alt="post image"
                                    className='w-full h-full object-cover '
                                />
                            </div>
                            <div className="w-1/2 flex flex-col justify-between ">
                                <div className="flex items-center gap-2 pl-3 mt-2 pb-2   justify-between">
                                    <div className='flex items-center gap-2'>
                                        <Link>
                                            <Avatar className="size-7">
                                                <AvatarImage src={post.author.profilePicture} alt="author_image" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <Link><h1 className='font-semibold'>{post.author.username}</h1></Link>
                                    </div>
                                    <div className='mr-3'>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <MoreHorizontal className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent className="flex flex-col items-center text-center text-sm rounded-xl">
                                                <button className="cursor-pointer w-full text-red-600 font-bold p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Unfollow</button>
                                                <button className="cursor-pointer w-full p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Add to favorites</button>
                                                <button className="cursor-pointer w-full text-red-600 font-bold  p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Cancel</button>

                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex-1 overflow-y-auto max-h-96">
                                    <div className="">
                                        {
                                            post.comments.map((comment, index) => {
                                                return (
                                                    <div className='flex gap-2'>
                                                        <Link>
                                                            <Avatar className="size-7">
                                                                <AvatarImage src={comment.author.profilePicture} alt="author_image" />
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                        </Link>
                                                        <Link><h1 className='font-semibold'>{comment.author.username}</h1></Link>
                                                        <p className='text-sm'>{comment.text}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <hr />
                                <div className="ml-3">
                                    <div className="flex justify-between mt-2">
                                        <div className="flex gap-4 items-center">
                                            <FaRegHeart size={22} className="cursor-pointer hover:text-gray-600 active:scale-[1.3] transition easy-in-out" />
                                            <FiMessageCircle size={24} className="cursor-pointer hover:text-gray-600" />
                                            <TbSend size={24} className="cursor-pointer hover:text-gray-600" />
                                        </div>
                                        <IoBookmarkOutline size={22} className="cursor-pointer hover:text-gray-600 mr-3" />
                                    </div>
                                    <span className="font-medium block mb-2">{post.likes.length} likes</span>
                                    <div className="flex justify-between items-center border-t">
                                        <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full mb-3 mt-1" value={text} onChange={changeEventHandler} />
                                        {
                                            text && <button className="text-blue-600 font-medium mr-3">Post</button>
                                        }
                                    </div>
                                </div>
                                <hr />

                            </div>

                        </div>

                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
