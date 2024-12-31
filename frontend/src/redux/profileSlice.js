import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import store from "./store";

const profileSlice = createSlice({
    name:'userProfile',
    initialState:{
        userProfile:null
    },
    reducers: {
        setUserProfile:(state, action) => {
            state.userProfile = action.payload;
        },
        likeUserProfilePost:(state, action) => {
            let userPost = state.userProfile.posts.find(post => post._id === action.payload.postId);
            let bookmarkPost = state.userProfile.bookmarks.find(post => post._id === action.payload.postId);
            
            if(userPost) {
                if(userPost.likes.includes(action.payload.userId)) {
                    userPost.likes = userPost.likes.filter(id => id !== action.payload.userId);
                }
                else {
                    userPost.likes.push(action.payload.userId);
                }
            }
            if(bookmarkPost) {
                if(bookmarkPost.likes.includes(action.payload.userId)) {
                    bookmarkPost.likes = bookmarkPost.likes.filter(id => id !== action.payload.userId);
                }
                else {
                    bookmarkPost.likes.push(action.payload.userId);
                }
            }
            
        },
        commentUserProfilePost:(state, action) => {
            let userPost = state.userProfile.posts.find(post => post._id === action.payload.postId);
            let bookmarkPost = state.userProfile.bookmarks.find(post => post._id === action.payload.postId);

            if(userPost) {
                userPost.comments.push(action.payload.comment)
            }
            if(bookmarkPost) {
                bookmarkPost.comments.push(action.payload.comment);
            }
        },
        bookmarkUserProfilePost:(state, action)=> {
            const Post = action.payload.post;
            const isBookmarked = state.userProfile.bookmarks.find(post => post._id === Post._id);
            
            if(isBookmarked) {
                state.userProfile.bookmarks = state.userProfile.bookmarks.filter(post => post._id !== Post._id);
            }
            else {
                state.userProfile.bookmarks.push(Post);
            }
            
        },
        deleteProfilePost:(state, action) => {
            const postId = action.payload.postId;

            state.userProfile.posts = state.userProfile.posts.filter(post => post._id !== postId);
            state.userProfile.bookmarks = state.userProfile.bookmarks.filter(post => post._id !== postId);
        }
    }
});


export const {setUserProfile, likeUserProfilePost, commentUserProfilePost, bookmarkUserProfilePost, deleteProfilePost} = profileSlice.actions;
export default profileSlice.reducer;