import React, { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Loader} from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast, ToastContainer } from "react-toastify";
import { addComment, deletePost, likeDislikePost } from '@/redux/postSlice';
import { bookmarkPost } from "@/redux/authSlice";
import { Badge } from "@/components/ui/badge"





const Post = ({ post }) => {

    const [text, setText] = useState("");
    const [showComment, setShowComment] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen]= useState(false);
    const [loading, setLoading] = useState(false);
    let [displayWidth, setDisplayWidth] = useState(window.innerWidth);



    const changeEventHandler = (e) => {
        if (e.target.value.trim()) {
            setText(e.target.value);
        }
        else {
            setText("");
        }
    }



    const likeDislikePostHandler= async () => {

        dispatch(likeDislikePost({userId:user._id, postId:post._id}));
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/like`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
            response = await response.json();
            if(response.success) {
                console.log(response.message);
                
            }
            else {
                toast.error(response.message);
            }

        } catch (error) {
            console.log(error);

        }
    }



    const deletePostHandler = async () => {
        setLoading(true)
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post?._id}/delete`, {
                method: "DELETE",
                credentials:'include'
            });

            response = await response.json();
            if (response.success) {
                toast.success(response.message);
                dispatch(deletePost(post?._id));
                console.log(response.message);
                setOpen(false);
            }
            else {
                toast.error(response.message);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }



    const addCommnetHandler = async() => {
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/comment`, {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({text: text}),
                credentials:'include'
            });

            response = await response.json();

            if(response.success) {
                console.log(response.message);
                dispatch(addComment({postId:post._id, comment:response.comment}));
                setText("")
            }
            else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log(error);
            
        }
    }



    const addToFavoriteHandler = async() =>{
        dispatch(bookmarkPost({postId: post._id}));
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, {
                method:'POST',
                headers:{
                    "Content-Type": "application/json",
                },
                credentials:'include'
            });

            response = await response.json();
            console.log(response.message);
            
        } catch (error) {
            console.log(error);
        }
    }
  
    
    
    return (
        <div className="lg:pl-60 mb-3 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                        <AvatarImage src={post.author.profilePicture} alt="author_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post.author.username}</h1>
                    {
                        (post.author._id === user._id && displayWidth >768) && <Badge variant="secondary">Author</Badge>
                    }
                </div>
                <div className="">
                    <Dialog open={open} className="w-full">
                        <DialogTrigger className="">
                            <MoreHorizontal className="cursor-pointer" onClick={()=>setOpen(true)} />
                        </DialogTrigger>
                        <DialogContent className="flex flex-col items-center text-center text-sm rounded-xl w-[80%] md:w-[550px]" onInteractOutside={() => setOpen(false)}>
                            {
                                !(user._id === post.author._id) && <button className="cursor-pointer w-full text-red-600 font-bold p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Unfollow</button>

                            }
                            <button className="cursor-pointer w-full p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Add to favorites</button>
                            {
                                user._id === post.author._id && <button className="flex cursor-pointer w-full text-red-600 font-bold  p-3 rounded hover:bg-slate-100 border-b-[1px] border-black justify-center items-center" onClick={deletePostHandler}>
                                    {
                                        loading? <Loader className="w-5 h-5 text-violet-800 animate-spin" />: 'Delete'
                                    }
                                </button>
                            }


                        </DialogContent>
                    </Dialog>
                </div>
            </div>


            <img src={post.image} alt="post image" className="w-full max-w-[500px] rounded-sm my-2 object-cover aspect-square   " />


            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    {
                        post.likes.includes(user._id) ?
                            <RiPokerHeartsFill size={26} color="red" className="cursor-pointer hover:text-gray-600 " onClick={likeDislikePostHandler} />
                            : <RiPokerHeartsLine size={26} className="cursor-pointer hover:text-gray-600 active:scale-[1.3] transition easy-in duration-500" onClick={likeDislikePostHandler} />
                    }
                    <FiMessageCircle size={24} className="cursor-pointer hover:text-gray-600" onClick={() => { setShowComment(true) }} />
                    <TbSend size={24} className="cursor-pointer hover:text-gray-600" />
                </div>
                
                {
                    !user.bookmarks.includes(post._id)?
                    <IoBookmarkOutline size={22} className="cursor-pointer hover:text-gray-600" onClick={addToFavoriteHandler} />
                    :<IoBookmark size={22} className="cursor-pointer" onClick={addToFavoriteHandler} />
                }
            </div>
            <span className="font-medium block mb-2">{post.likes.length} likes</span>
            <p className="text-sm text-gray-600 mb-1"><span className="font-bold">{post.author.username}</span> {post.caption}</p>
            {
                post.comments.length ? <span className="text-gray-400 text-sm cursor-pointer" onClick={() => { setShowComment(true) }}>View all {post.comments.length} comments</span> : null
            }
            <CommentDialog post={post} open={showComment} setOpen={setShowComment} />
            <div className="flex justify-between items-center">
                <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full mb-3 mt-1" value={text} onChange={changeEventHandler} />
                {
                    text && <button className="text-blue-600 font-medium"  onClick={addCommnetHandler}>Post</button>
                }
            </div>
            <hr />
            <ToastContainer />
        </div>
    )
};


export default Post;
