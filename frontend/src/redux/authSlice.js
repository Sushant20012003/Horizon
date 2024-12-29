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
        } 
    }
});

export const { setAuthUser, bookmarkPost, setSuggestedUsers } = authSlice.actions;
export default authSlice.reducer;