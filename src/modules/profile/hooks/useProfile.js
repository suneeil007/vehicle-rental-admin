import { useQuery } from "@tanstack/react-query";
import profileService from "../services/profileService";


const useProfile = () => {


    return useQuery({

        queryKey:[
            "my-profile"
        ],


        queryFn:()=>profileService.get(),


    });


};


export default useProfile;