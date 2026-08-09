import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/userApi";


const useUsers = () => {
    return useQuery({
        queryKey:["users"],
        queryFn: async()=>{
            const response = await getUsers();
            // console.log("Users API:", response.data);
            return response.data.data;
        }
    });
};

export default useUsers;