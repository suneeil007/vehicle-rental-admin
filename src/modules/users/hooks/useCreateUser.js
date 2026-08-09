import { useMutation } from "@tanstack/react-query";
import { createUser } from "../api/userApi";


const useCreateUser = () => {

    return useMutation({
        mutationFn: createUser
    });

};


export default useCreateUser;