import { setUserProfile } from "@/redux/profileSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile =(userId) =>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchUserProfile = async()=>{
            try {
                let response = await fetch(`http://localhost:8000/api/v1/user/profile/${userId}`, {
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
