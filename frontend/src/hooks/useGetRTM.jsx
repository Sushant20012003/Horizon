import { setNewMessage } from "@/redux/chatSlice";
import store from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

export const useGetRTM = ()=> {
    const dispatch = useDispatch();
    const {socket} = useSelector(store=>store.socketio);

    useEffect(()=>{
        socket?.on('newMessage', (newMessage)=>{
            dispatch(setNewMessage(newMessage));
        });

        return ()=>{
            socket?.off('newMessage');
        }

    },[setNewMessage]);
}