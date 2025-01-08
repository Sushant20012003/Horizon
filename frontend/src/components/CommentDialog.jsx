import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Loader, MoreHorizontal } from 'lucide-react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { FiMessageCircle } from "react-icons/fi";
import { comment } from 'postcss'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { addComment, deletePost, likeDislikePost } from '@/redux/postSlice';
import { RiPokerHeartsFill, RiPokerHeartsLine } from 'react-icons/ri'
import { bookmarkUserProfilePost, commentUserProfilePost, deleteProfilePost, likeUserProfilePost } from '@/redux/profileSlice'
import { bookmarkPost, setFollowingUser } from '@/redux/authSlice'

export default function CommentDialog({ post, open, setOpen }) {

    const [text, setText] = useState("");
    let [displayWidth, setDisplayWidth] = useState(window.innerWidth);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);



    const changeEventHandler = (e) => {
        if (e.target.value.trim()) {
            setText(e.target.value);
        }
        else {
            setText("");
        }
    }

    const addCommentHandler = async () => {
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text }),
                credentials: 'include'
            });
            response = await response.json();

            if (response.success) {
                dispatch(addComment({ postId: post._id, comment: response.comment }));
                dispatch(commentUserProfilePost({ postId: post._id, comment: response.comment }));
                setText("")
            }
            console.log(response.message);

        } catch (error) {
            console.log(error);

        }
    }

    const likeDislikePostHandler = async () => {

        dispatch(likeDislikePost({ userId: user._id, postId: post._id }));
        dispatch(likeUserProfilePost({ userId: user._id, postId: post._id }));
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/like`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
            response = await response.json();
            if (response.success) {
                console.log(response.message);

            }
            else {
                console.log(response.message);
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
                credentials: 'include'
            });

            response = await response.json();
            if (response.success) {
                dispatch(deletePost(post?._id));
                dispatch(deleteProfilePost({ postId: post._id }));
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


    const addToFavoriteHandler = async () => {
        dispatch(bookmarkPost({ postId: post._id }));
        dispatch(bookmarkUserProfilePost({ post: post }));
        try {
            let response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });

            response = await response.json();
            console.log(response.message);

        } catch (error) {
            console.log(error);
        }
    }


    const followUnfollowHandler = async()=>{
            try {
                let response = await fetch(`http://localhost:8000/api/v1/user/followorunfollow/${post.author._id}`, {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    credentials:'include'
                });
    
                response = await response.json();
    
                if(response.success) {
                    console.log(response.message);
                    dispatch(setFollowingUser(post.author._id));
                    
                }
    
            } catch (error) {
                console.log(error);
                
            }
        }



    if (displayWidth > 768) {
        return (
            <div>

                <Dialog open={open}>
                    <DialogContent onInteractOutside={() => setOpen(false)} className="min-w-[700px] lg:min-w-[900px] max-w-[90%] max-h-[700px] p-0 m-0 " >
                        <div className="flex w-full">
                            <div className='w-1/2'>
                                <img
                                    src={post.image} alt="post image"
                                    className='w-full h-full object-cover aspect-square'
                                />
                            </div>
                            <div className="w-1/2 flex flex-col justify-between ">
                                <div className="flex items-center gap-2 pl-3 mt-2 pb-2   justify-between">
                                    <div className='flex items-center gap-2'>
                                        <Link>
                                            <Avatar className="size-7">
                                                <AvatarImage src={post?.author.profilePicture} alt="author_image" />
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
                                            <DialogContent className="flex flex-col items-center text-center text-sm rounded-xl w-[80%] md:w-[550px]">
                                                {
                                                    !(user._id === post.author._id) ? user.following.includes(post.author._id) ? <button onClick={followUnfollowHandler} className="cursor-pointer w-full text-red-600 font-bold p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Unfollow</button> : <button onClick={followUnfollowHandler} className="cursor-pointer w-full text-red-600 font-bold p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">{user.followers.includes(post.author._id)?'Follow Back':'Follow'}</button> : null

                                                }
                                                <button className="cursor-pointer w-full p-3 rounded hover:bg-slate-100 border-b-[1px] border-black">Add to favorites</button>
                                                {
                                                    user._id === post.author._id && <button className="flex cursor-pointer w-full text-red-600 font-bold  p-3 rounded hover:bg-slate-100 border-b-[1px] border-black justify-center items-center" onClick={deletePostHandler}>
                                                        {
                                                            loading ? <Loader className="w-5 h-5 text-violet-800 animate-spin" /> : 'Delete'
                                                        }
                                                    </button>
                                                }

                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                                <hr />
                                <div className="flex-1 overflow-y-auto max-h-96 mt-2 pl-3">
                                    <div className="">
                                        {
                                            post.comments.map((comment, index) => {
                                                return (
                                                    <div className='flex gap-2 mb-2' key={index}>
                                                        <Link>
                                                            <Avatar className="size-7">
                                                                <AvatarImage src={comment.author.profilePicture} alt="author_image" />
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                        </Link>
                                                        <p className='text-sm'><Link><span className='font-semibold'>{comment.author.username} </span> {comment.text}</Link></p>


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
                                            {
                                                post.likes.includes(user._id) ?
                                                    <RiPokerHeartsFill size={26} color="red" className="cursor-pointer hover:text-gray-600 " onClick={likeDislikePostHandler} />
                                                    : <RiPokerHeartsLine size={26} className="cursor-pointer hover:text-gray-600 active:scale-[1.3] transition easy-in duration-500" onClick={likeDislikePostHandler} />
                                            }
                                            <FiMessageCircle size={24} className="cursor-pointer hover:text-gray-600" />
                                            <TbSend size={24} className="cursor-pointer hover:text-gray-600" />
                                        </div>
                                        {
                                            !user.bookmarks.includes(post._id) ?
                                                <IoBookmarkOutline size={22} className="cursor-pointer hover:text-gray-600" onClick={addToFavoriteHandler} />
                                                : <IoBookmark size={22} className="cursor-pointer" onClick={addToFavoriteHandler} />
                                        }
                                    </div>
                                    <span className="font-medium block mb-2">{post.likes.length} likes</span>
                                    <div className="flex justify-between items-center border-t">
                                        <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full mb-3 mt-1 bg-white" value={text} onChange={changeEventHandler} />
                                        {
                                            text && <button className="text-blue-600 font-medium mr-3 " onClick={addCommentHandler}>Post</button>
                                        }
                                    </div>
                                </div>
                                <hr />

                            </div>

                        </div>

                    </DialogContent>
                </Dialog>
            </div>

        )
    }
    else {
        return (
            <div>

                <Dialog open={open}>
                    <DialogContent onInteractOutside={() => setOpen(false)} className="min-h-[300px] h-[60vh] w-[90%] max-w-[500px] p-0 m-0 " >
                        <VisuallyHidden> <DialogTitle>My Dialog Title</DialogTitle> </VisuallyHidden>
                        <div className="flex flex-col w-full ">
                            <h1 className='flex justify-center w-full font-semibold text-base p-2'>Commnets</h1>
                            <hr />
                            <div className="flex-1  overflow-y-auto max-h-96 ml-3 mt-2">

                                {
                                    post.comments.map((comment, index) => {
                                        return (
                                            <div className='flex gap-2 mb-2' key={index}>
                                                <Link>
                                                    <Avatar className="size-7">
                                                        <AvatarImage src={comment.author.profilePicture} alt="author_image" />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                </Link>
                                                <div className="flex flex-col m-0">
                                                    <Link><h1 className='font-semibold text-xs'>{comment.author.username}</h1></Link>
                                                    <p className='text-[13px]'>{comment.text}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="flex justify-between items-center border-t ml-3">
                                <input type="text" placeholder="Add a comment..." className="outline-none text-sm w-full mb-3 mt-1 bg-white" value={text} onChange={changeEventHandler} />
                                {
                                    text && <button className="text-blue-600 font-medium mr-3" onClick={addCommentHandler}>Post</button>
                                }
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

        )
    }
}
