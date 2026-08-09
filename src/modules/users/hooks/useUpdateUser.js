import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
        updateUser
    } from "../api/userApi";


const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
       mutationFn:({slug,data})=>{
            return updateUser(
                slug,
                data
            );
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:["users"]
            });
        }
    });
};

export default useUpdateUser;