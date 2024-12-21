import React, { useEffect, useState } from 'react'
import Posts from './Posts';
import axios from 'axios';

export default function Feed() {

    const [allPost, setAllPost] = useState([]);

    const getAllPost = async () => {
        try {
            let response = await axios.get('http://localhost:8000/api/v1/post/all', {
                withCredentials:true
            });
            if (response.data.success) {
                console.log('Data fetched');
                setAllPost(response.data.posts);
            }
            else {
                console.log(response.data.message);
                
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAllPost();
    }, []);

    return (
        <div className='flex-1 my-8 flex flex-col items-center px-[5px] mb-16'>
            <Posts allPost={allPost} />
        </div>
    )
}
