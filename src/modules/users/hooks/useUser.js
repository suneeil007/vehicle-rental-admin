import {
        useQuery
    } from "@tanstack/react-query";

import {
        getUser
    } from "../api/userApi";

const useUser = (slug)=>{
    return useQuery({
        queryKey:[
            "user",
            slug
        ],
        queryFn:async()=>{
            const response =
                await getUser(slug);
                // console.log("SINGLE USER API:",response.data);
                return response.data.data;
        },
        enabled:Boolean(slug)
    });
};


export default useUser;