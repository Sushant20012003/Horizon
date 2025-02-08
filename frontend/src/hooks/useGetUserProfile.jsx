import { BASE_URL } from "@/config/apiConfig";
import { setUserProfile } from "@/redux/profileSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile =(userId) =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchUserProfile = async()=>{
            try {
                let response = await fetch(`${BASE_URL}/api/v1/user/profile/${userId}`, {
                    method:'GET',
                    credentials:'include'
                });
                response = await response.json();
        
                if(response.success) {
                    console.log('user profile fetched');
                    dispatch(setUserProfile(response.user));
                }
            } catch (error) {
                console.log(error);
                
            }
        }

        fetchUserProfile();
    }, [userId]);
}


export default useGetUserProfile;
