import { useQuery } from "@tanstack/react-query";
import branchService from "../services/branchService";


const useBranches = () => {

    return useQuery({

        queryKey:[
            "branches"
        ],

        queryFn:
            branchService.getAll

    });

};


export default useBranches;