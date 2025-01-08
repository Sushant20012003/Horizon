import { createSlice } from "@reduxjs/toolkit";


const rtnSlice = createSlice({
    name:'realTimeNotification',
    initialState:{
        likeNotification:[],
        isNotificationVisible:false
    },
    reducers:{
        setLikeNotification:(state, action)=> {
            if(action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            }
            else {
                state.likeNotification = state.likeNotification.filter((item)=>item.userId !== action.payload.userId);
            }
        },
        setIsNotificationVisible:(state, action) => {
            state.isNotificationVisible = action.payload;
        }
    }
});


export const {setLikeNotification, setIsNotificationVisible} = rtnSlice.actions;
export default rtnSlice.reducer;