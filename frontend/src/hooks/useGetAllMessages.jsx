import { BASE_URL } from "@/config/apiConfig";
import { setMessages } from "@/redux/chatSlice";
import store from "@/redux/store";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";

export const useGetAllMessages = () => {

    const { selectedParticipant } = useSelector(store => store.conversation);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllMessages = async () => {
            let response = await fetch(`${BASE_URL}/api/v1/message/all/${selectedParticipant?._id}`, {
                method: 'GET',
                credentials: 'include'
            });

            response = await response.json();

            if(response.success) {
                console.log('fetched all messages');
                
                dispatch(setMessages(response.messages));
                
            }
        }

        fetchAllMessages();
    }, [selectedParticipant]);
}