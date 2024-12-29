import { setSuggestedUsers } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = async()=>{

    const dispatch = useDispatch();

    let response = await fetch('http://localhost:8000/api/v1/user/suggested', {
        method:'GET', 
        credentials:'include'
    });
    response = await response.json();

    if(response.success) {
        console.log('fetched suggested users');
        
        dispatch(setSuggestedUsers(response.users));
    }
}

export default useGetSuggestedUsers;