import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';
import store from '@/redux/store';

export default function Posts() {

  const {posts}  = useSelector(store=>store.posts)
  

  return (
    <div>
        {
            posts.map((post, index)=>(
                <Post key={index} post={post} />
            ))
        }
    </div>
  )
}
