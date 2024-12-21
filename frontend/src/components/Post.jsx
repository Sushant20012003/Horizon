import React, { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { FiMessageCircle } from "react-icons/fi";
import CommentDialog from "./CommentDialog";
import { RiPokerHeartsLine } from "react-icons/ri";
import { RiPokerHeartsFill } from "react-icons/ri";






const Post = ({ post }) => {

    const [text, setText]=useState("");
    const [showComment, setShowComment] = useState(false);
    
    const changeEventHandler= (e)=>{
        if(e.target.value.trim()){
            setText(e.target.value);
        }
        else{
            setText("");
        }
    }

    const likeDislikePost=async(postId)=>{

    }

    return (
        <div className="mb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                        <AvatarImage src={post.author.profilePicture} alt="author_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post.author.username}</h1>
                </div>
                <div className="">
                    <Dialog>
                        <DialogTrigger className="">
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
            
            
            <img src={post.image} alt="post image" className="w-full max-w-[500px] rounded-sm my-2 object-cover aspect-square   " />
            
            
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                <RiPokerHeartsLine size={26} color="" className="cursor-pointer hover:text-gray-600 active:scale-[1.3] transition easy-in-out" />
                <FiMessageCircle size={24} className="cursor-pointer hover:text-gray-600" onClick={()=>{setShowComment(true)}} />
                <TbSend size={24} className="cursor-pointer hover:text-gray-600" />
                </div>
                <IoBookmarkOutline size={22} className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="font-medium block mb-2">{post.likes.length} likes</span>
            <p className="text-sm text-gray-600 mb-1"><span className="font-bold">{post.author.username}</span> {post.caption}</p>
            {
                post.comments.length? <span className="text-gray-400 text-sm cursor-pointer" onClick={()=>{setShowComment(true)}}>View all {post.comments.length} comments</span>:null
            }
            <CommentDialog post={post} open={showComment} setOpen={setShowComment} />
            <div className="flex justify-between items-center">
                <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full mb-3 mt-1" value={text} onChange={changeEventHandler} />
                {
                    text && <button className="text-blue-600 font-medium">Post</button>
                }
            </div>
            <hr/>
            
        </div>
    )
};


export default Post;
