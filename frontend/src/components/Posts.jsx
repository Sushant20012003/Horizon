import React from 'react';
import Post from './Post';

export default function Posts({allPost}) {
  return (
    <div>
        {
            allPost.map((item, index)=>(
                <Post key={index} post={item} />
            ))
        }
    </div>
  )
}
