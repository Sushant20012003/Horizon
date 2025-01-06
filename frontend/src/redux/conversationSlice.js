import { createSlice } from "@reduxjs/toolkit";



const conversationSlice =  createSlice({
    name:'conversation',
    initialState:{
        participants:[],
        selectedParticipant:null
    },
    reducers:{
        setCoversationParticipants:(state, action) => {
            state.participants = action.payload;
        },
        setSelectedParticipant:(state, action) => {
            state.selectedParticipant = action.payload;
        }
    }
});

export const {setCoversationParticipants, setSelectedParticipant} = conversationSlice.actions;
export default conversationSlice.reducer;