import { BASE_URL } from '@/config/apiConfig';
import { setCoversationParticipants } from '@/redux/conversationSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetConversationUsers = async(userId)=> {

    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                let response = await fetch(`${BASE_URL}/api/v1/message/users`, {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({userId:userId}),
                    credentials:'include'
                });
        
                response =await response.json();
        
                if(response.success) {
                    console.log('Conversation users fetched');
                    dispatch(setCoversationParticipants(response.participants));
                    
                }
        
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchUsers();
    }, [])
}

export default useGetConversationUsers;
