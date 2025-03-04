import useGetUserProfile from '@/hooks/useGetUserProfile'
import store from '@/redux/store';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MdGridOn } from "react-icons/md";
import { LiaBookmark } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import CommentDialog from './CommentDialog';
import { setFollowingUser } from '@/redux/authSlice';
import { MdOutlineVerifiedUser } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { setCoversationParticipants, setSelectedParticipant } from '@/redux/conversationSlice';
import { BASE_URL } from '@/config/apiConfig';
import { setMessages, setOnlineUsers } from '@/redux/chatSlice';
import { setPosts } from '@/redux/postSlice';
import { setUserProfile } from '@/redux/profileSlice';
import { setNotification } from '@/redux/rtnSlice';


export default function Profile() {

  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);
  const { userProfile } = useSelector(store => store.userProfile);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const isLoggedInUserProfile = userProfile?._id === user?._id;
  const isFollowing = user.following.includes(userProfile?._id);
  const [activeTab, setActiveTab] = useState('posts');
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : activeTab === 'saved' ? userProfile?.bookmarks : [];
  const displayWidth = window.innerWidth;

  const [activePostId, setActivePostId] = useState(null);
  // const [showPost, setShowPost] = useState(false)            can not pass it in commentDialog it will change state all post .
  const navigate = useNavigate();


  const followUnfollowHandler = async () => {
    try {
      let response = await fetch(`${BASE_URL}/api/v1/user/followorunfollow/${userProfile?._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      response = await response.json();

      if (response.success) {
        console.log(response.message);
        dispatch(setFollowingUser(userProfile?._id));

      }

    } catch (error) {
      console.log(error);

    }
  }


  const handleLogout = async () => {
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
        dispatch(setMessages([]));
        dispatch(setOnlineUsers([]));
        dispatch(setCoversationParticipants([]));
        dispatch(setPosts([]));
        dispatch(setUserProfile(null));
        dispatch(setNotification([]));
        navigate('/login');
      }
    } catch (error) {
      console.log(error);

    }
  }



  return (
    <div className='flex w-[100vw] justify-center lg:pl-[15%]'>
      <div className="flex flex-col lg:gap-20 mt-8 max-w-5xl">
        {
          displayWidth >= 1024 ?
            <div className="grid grid-cols-2 ">
              <section className='flex justify-center items-center'>
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userProfile?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </section>
              <section className='flex flex-col gap-6'>
                <div className="flex gap-5">
                  <span>{userProfile?.username}</span>
                  {
                    isLoggedInUserProfile ?
                      <div className="flex gap-2">
                        <button className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400' onClick={() => navigate('/profile/edit')}>Edit profile</button>

                      </div>
                      : <div className='flex gap-2'>
                        {
                          isFollowing ?
                            <button className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400' onClick={followUnfollowHandler}>Unfollow</button>
                            : <button className='bg-blue-500 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-blue-600 text-white' onClick={followUnfollowHandler}>Follow</button>
                        }
                        <button onClick={() => { navigate('/chat'); dispatch(setSelectedParticipant({ _id: userProfile?._id, username: userProfile?.username, profilePicture: userProfile?.profilePicture })) }} className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400'>Message</button>
                      </div>
                  }
                </div>
                <div className="flex gap-10">
                  <span className="font-medium">{userProfile?.posts.length} posts</span>
                  <span className="font-medium">{userProfile?.followers.length} followers</span>
                  <span className="font-medium">{userProfile?.following.length} following</span>

                </div>
                <div>
                  <Badge variant={'secondary'}>@{userProfile?.username}</Badge>
                  <pre>
                    {userProfile?.bio}
                  </pre>
                </div>
              </section>
            </div>
            : <div className='mt-[17px] w-[100vw]'>
              <span className='flex items-center text-xl font-bold pl-2 gap-1'><RiVerifiedBadgeFill />{userProfile?.username}</span>
              <div className="px-4 py-4">
                <div className='flex justify-between'>
                  <Avatar className='size-[74px]'>
                    <AvatarImage src={userProfile?.profilePicture} />
                    <AvatarFallback><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7U_ef87Q7CQ1Fx_khkPq-y9IfPmBWrMZ6ig&s' /></AvatarFallback>
                  </Avatar>
                  <p><span className='block font-bold'>{userProfile?.posts.length}</span><span className='font-medium'>posts</span></p>
                  <p><span className='block font-bold'>{userProfile?.followers.length}</span><span className='font-medium'>followers</span></p>
                  <p><span className='block font-bold'>{userProfile?.following.length}</span><span className='font-medium'>following</span></p>
                </div>
                <Badge variant={'secondary'}>@{userProfile?.username}</Badge>
                <pre>{userProfile?.bio}</pre>
                {
                  user._id === userProfile?._id ?
                    <div className='flex gap-2'>
                      <button onClick={() => navigate('/profile/edit')} className='bg-gray-300 w-1/2 py-1 rounded-[10px] mt-2 font-medium active:bg-gray-400'>Edit profile</button>
                      <button onClick={handleLogout} className='bg-gray-300 w-1/2 py-1 rounded-[10px] mt-2 font-medium text-red-500 active:bg-gray-400'>Logout</button>
                    </div>
                    : <div className='flex gap-2 mt-2'>
                      <button onClick={followUnfollowHandler} className={`w-full py-1 rounded-[10px] font-medium  ${isFollowing ? 'bg-gray-400 ' : 'bg-blue-600 text-white'}`}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
                      <button onClick={() => { navigate('/chat'); dispatch(setSelectedParticipant({ _id: userProfile?._id, username: userProfile?.username, profilePicture: userProfile?.profilePicture })) }} className='w-full py-1 rounded-[10px] bg-gray-400 font-medium'>Message</button>
                    </div>
                }
              </div>
            </div>
        }


        <div className="border-t border-t-gray-200 lg:px-8 mb-12 lg:mb-0">
          <div className='flex gap-10 justify-center items-center'>
            <div className={`flex items-center gap-1 py-3 cursor-pointer text-gray-600 active:text-gray-800 ${activeTab === 'posts' && 'font-bold text-black'}`} onClick={() => setActiveTab('posts')}><MdGridOn className='size-[13px] ' /><span className={`text-[14px] font-semibold `}>POSTS</span></div>
            {
              userProfile?._id === user._id && <div className={`flex items-center gap-1 py-3 cursor-pointer text-gray-600 active:text-gray-800 ${activeTab === 'saved' && 'font-bold text-black'}`} onClick={() => setActiveTab('saved')}><LiaBookmark /><span className={`text-[14px] font-semibold `}>SAVED</span></div>
            }
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPost?.map((post) => {

                const isOpen = activePostId === post?._id;


                return (
                  <div key={post?._id} className='relative group cursor-pointer' onClick={() => setActivePostId(post._id)}>
                    <img src={post?.image} alt="post image" className='my-[1px] aspect-square object-cover' />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-white space-x-4">
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <FaRegHeart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <FiMessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                    <CommentDialog
                      post={post}
                      open={isOpen}
                      setOpen={(open) => setActivePostId(open ? post._id : null)}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
