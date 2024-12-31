import useGetUserProfile from '@/hooks/useGetUserProfile'
import store from '@/redux/store';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MdGridOn } from "react-icons/md";
import { LiaBookmark } from "react-icons/lia";
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import CommentDialog from './CommentDialog';


export default function Profile() {

  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);
  const { userProfile } = useSelector(store => store.userProfile);
  const { user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = userProfile?._id === user?._id;
  const isFollowing = userProfile?.followers.includes(user?._id);
  const [activeTab, setActiveTab] = useState('posts');
  const displayedPost = activeTab === 'posts' ? userProfile?.posts : activeTab === 'saved' ? userProfile?.bookmarks : [];

  const [activePostId, setActivePostId] = useState(null);
  // const [showPost, setShowPost] = useState(false)            can not pass it in commentDialog it will change state all post .

  return (
    <div className='flex w-[100vw] justify-center md:pl-[15%]'>
      <div className="flex flex-col gap-20 p-8 max-w-5xl">
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
                    <button className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400'>Edit profile</button>
                    <button className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400'>View archive</button>
                  </div>
                  : <div className=''>
                    {
                      isFollowing ?
                        <button className='bg-gray-300 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-gray-400'>Unfollow</button>
                        : <button className='bg-blue-500 py-1 px-3 rounded-[8px] text-sm font-medium hover:bg-blue-600'>Follow</button>
                    }
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
        <div className="border-t border-t-gray-200 ">
          <div className='flex gap-10 justify-center items-center'>
            <div className={`flex items-center gap-1 py-3 cursor-pointer text-gray-600 active:text-gray-800 ${activeTab === 'posts' && 'font-bold text-black'}`} onClick={() => setActiveTab('posts')}><MdGridOn className='size-[13px] ' /><span className={`text-[14px] font-semibold `}>POSTS</span></div>
            <div className={`flex items-center gap-1 py-3 cursor-pointer text-gray-600 active:text-gray-800 ${activeTab === 'saved' && 'font-bold text-black'}`} onClick={() => setActiveTab('saved')}><LiaBookmark /><span className={`text-[14px] font-semibold `}>SAVED</span></div>
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
