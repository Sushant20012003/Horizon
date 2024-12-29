import { createSlice } from "@reduxjs/toolkit";
import { use } from "react";
import { useSelector } from "react-redux";
import store from "./store";


const postSlice = createSlice({
    name: "posts",
    initialState:{
        posts: [],
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload; // Replace all posts
        },
        addPost: (state, action) => {
            state.posts.push(action.payload); // Append a single post
        },
        deletePost:(state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload); // Remove a single post
        },
        likeDislikePost:(state, action) => {
            let post = state.posts.find(post => post._id === action.payload.postId);
            if(post.likes.includes(action.payload.userId)) {
                post.likes = post.likes.filter(id => id !== action.payload.userId);
            }
            else {
                post.likes.push(action.payload.userId);
            }
        },
        addComment:(state, action) =>{
            let post = state.posts.find(post => post._id === action.payload.postId);
            post.comments.push(action.payload.comment);
        },
        
    },
    
});

export const { setPosts, addPost, deletePost, likeDislikePost, addComment } = postSlice.actions;
export default postSlice.reducer;