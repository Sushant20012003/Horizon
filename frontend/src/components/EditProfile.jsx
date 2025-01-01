import store from '@/redux/store'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { editProfile } from '@/redux/authSlice';
import { readFileDataURL } from '@/lib/utils';

export default function EditProfile() {
    
    const { user } = useSelector(store => store.auth);
    const imageRef = useRef();
    const [input, setInput] = useState({profilePicture:"", bio:user?.bio, gender:user?.gender});
    const [imagePreview, setImagePreview] = useState(user?.profilePicture);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const fileChangeHandler = async(e)=>{
        const file = e.target.files?.[0];
        if(file) {
            setInput({...input, profilePicture:file});
            const dataUrl = await readFileDataURL(file);
            setImagePreview(dataUrl);
        }

    }

    const editProfileHandler = async()=> {

        setLoading(true)

        const formData = new FormData();
        formData.append('bio', input.bio);
        formData.append('gender', input.gender);
        formData.append('profilePicture', input.profilePicture);

        try {
            let response = await fetch('http://localhost:8000/api/v1/user/profile/edit', {
                method:'POST',
                body:formData,
                credentials:'include'
            });

            response = await response.json();

            if(response.success) {
                console.log(response.message);
                console.log(response.user);
                
                dispatch(editProfile({profilePicture:response.user.profilePicture, bio:response.user.bio, gender:response.user.gender}));
                navigate(`/profile/${user._id}`);
            }

        } catch (error) {
            console.log(error);
            
        } finally {
            setLoading(false);
        }
        
    }

    return (
        <div className='flex w-[100vw] justify-center'>
            <div className='flex max-w-5xl '>
                <section className='flex flex-col gap-8 w-full my-8'>
                    <h1 className='font-bold text-2xl'>Edit Profile</h1>
                    <div className="flex bg-gray-300 w-[600px] p-5 rounded-xl justify-between items-center">
                        <div className="flex gap-3 items-center">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={imagePreview} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className='font-medium text-base'>{user?.username}</h1>
                        </div>
                        <input type="file" className='hidden' ref={imageRef} onChange={fileChangeHandler} />
                        <button className='bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-[8px] font-medium font-mono' onClick={()=>imageRef.current.click()} >Change photo</button>
                    </div>
                    <div className="">
                        <h1 className='font-bold text-xl'>Bio</h1>
                        <textarea name='bio' className='w-full p-3 border border-gray-500 rounded-xl mt-2' value={input.bio} onChange={(e)=>setInput({...input, bio:e.target.value})} />
                    </div>
                    <div className="w-full">
                        <h1 className='font-bold text-xl'>Gender</h1>
                        <select name="gender" id="" className='w-full border rounded-xl p-3 mt-2' value={input.gender || ""} onChange={(e)=>setInput({...input, gender:e.target.value})}>
                            <option value="" disabled></option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className='flex justify-end'>
                    <button className='bg-blue-500 hover:bg-blue-600 font-medium font-mono w-fit px-14 py-2 rounded-[8px]' onClick={editProfileHandler}>
                        {
                            loading?
                            <Loader2 className='animate-spin' />
                            :"Submit"
                        }
                    </button>
                    </div>
                </section>
            </div>
        </div>
    )
}
