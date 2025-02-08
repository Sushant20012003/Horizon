import { BASE_URL } from "@/config/apiConfig";
import { setSuggestedUsers } from "@/redux/authSlice";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = async()=>{

    const dispatch = useDispatch();

    let response = await fetch(`${BASE_URL}/api/v1/user/suggested`, {
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