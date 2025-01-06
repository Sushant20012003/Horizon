import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[]
    },
    reducers:{
        setOnlineUsers:(state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state, action)=> {
            state.messages = action.payload;
        },
        setNewMessage:(state, action)=> {
            state.messages.push(action.payload);
        }
    }
});

export const {setOnlineUsers, setMessages, setNewMessage} = chatSlice.actions;
export default chatSlice.reducer;