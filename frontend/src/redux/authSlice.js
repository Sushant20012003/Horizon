import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[]
    },
    reducers:{
        //actions
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        bookmarkPost:(state, action)=> {
            const postId = action.payload.postId;
            if(state.user.bookmarks.includes(postId)) {
                state.user.bookmarks = state.user.bookmarks.filter(id => id !== postId);
            }
            else {
                state.user.bookmarks.push(postId);
            }
        },
        setSuggestedUsers:(state, action) => {
            state.suggestedUsers = action.payload;
        },
        editProfile:(state, action)=> {
            state.user.profilePicture = action.payload.profilePicture;
            state.user.bio = action.payload.bio;
            state.user.gender = action.payload.gender;
        },
        setFollowingUser:(state, action)=>{
            const targetId = action.payload;
            const isFollowing = state.user.following.includes(targetId);
            if(isFollowing) {
                state.user.following = state.user.following.filter((id)=> id !== targetId);
            }
            else {
                state.user.following.push(targetId);
            }
        },
        setFollowerUser:(state, action)=>{
            const isFollower = state.user.followers.includes(action.payload);
            if(isFollower) {
                state.user.followers = state.user.followers.filter((id)=> id !== action.payload);
            }
            else {
                state.user.followers.push(action.payload);
            }
        }
    }
});

export const { setAuthUser, bookmarkPost, setSuggestedUsers, editProfile, setFollowingUser, setFollowerUser} = authSlice.actions;
export default authSlice.reducer;