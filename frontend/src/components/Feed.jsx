import React, { useEffect, useState } from 'react'
import Posts from './Posts';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { BASE_URL } from '@/config/apiConfig';

export default function Feed() {

    const dispatch = useDispatch();

    const getAllPost = async () => {
        try {
            let response = await fetch(`${BASE_URL}/api/v1/post/all`,{
                method: 'GET',
                credentials:'include'
            });
            response = await response.json();
            if (response.success) {
                console.log("dispatched all post");
                dispatch(setPosts(response.posts)); 
            }
            
            
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAllPost();
    }, []);

    return (
        <div className='flex-1 flex flex-col items-center px-[5px] mb-10 mt-14'>
            <Posts />
        </div>
    )
}
