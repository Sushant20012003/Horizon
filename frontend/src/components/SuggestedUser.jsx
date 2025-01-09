import store from '@/redux/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setFollowingUser } from '@/redux/authSlice';

export default function SuggestedUser() {

    const { suggestedUsers, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();


    const followUnfollowHandler = async(id)=>{
              try {
                  let response = await fetch(`http://localhost:8000/api/v1/user/followorunfollow/${id}`, {
                      method:"POST",
                      headers:{
                          'Content-Type':'application/json'
                      },
                      credentials:'include'
                  });
      
                  response = await response.json();
      
                  if(response.success) {
                      console.log(response.message);
                      dispatch(setFollowingUser(id));
                      
                  }
      
              } catch (error) {
                  console.log(error);
                  
              }
          }
    
          
    return (
        <div className='mt-8  w-[300px]'>
            <div className="flex justify-between">
                <h1 className='font-semibold text-gray-500'>Suggested for you</h1>
                <Link className='font-semibold text-gray-500'>See All</Link>
            </div>
            <div className=''>
                {
                    suggestedUsers?.map((suggestedUser, index) => {
                        return (
                            <div key={index} className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-2">
                                    <Link to={`/profile/${suggestedUser._id}`}>
                                    <Avatar className="size-8">
                                        <AvatarImage src={suggestedUser.profilePicture} alt="author_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar></Link>
                                    <Link to={`/profile/${suggestedUser._id}`}><h1>{suggestedUser.username}</h1></Link>
                                </div>
                                {
                                    user.following.includes(suggestedUser?._id)?<span onClick={()=>followUnfollowHandler(suggestedUser?._id)} className="cursor-pointer text-sm font-medium text-gray-400 hover:text-black">Unfollow</span>:<span onClick={()=>followUnfollowHandler(suggestedUser?._id)} className="cursor-pointer text-sm font-medium text-blue-600 hover:text-black">Follow</span>
                                }
                            </div>
                        )

                    }
                    )
                }
            </div>
        </div>
    )
}
