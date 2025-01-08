import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        notification: [], // Ensure this is initialized as an array
        isNotificationVisible: false,
    },
    reducers: {
        setNotification: (state, action) => {
            console.log(3);

            // Initialize notifications if undefined (added safeguard)
            if (!state.notification) {
                state.notification = [];
            }

            if (action.payload.type === 'like' || action.payload.type === 'follow') {
                state.notification.push(action.payload);
            } else {
                state.notification = state.notification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        },
        setIsNotificationVisible: (state, action) => {
            state.isNotificationVisible = action.payload;
        },
    },
});

export const { setNotification, setIsNotificationVisible } = rtnSlice.actions;
export default rtnSlice.reducer;
