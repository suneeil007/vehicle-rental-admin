import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/userApi";


const useUsers = () => {
    return useQuery({
        queryKey:["users"],
        queryFn: async()=>{
            const response = await getUsers();
            // console.log("Users API:", response.data);
            // console.log("USERS API RESPONSE:", response.data);
            // console.log("USERS ARRAY:", response.data.data);
            return response.data.data;
        }
    });
};

export default useUsers;