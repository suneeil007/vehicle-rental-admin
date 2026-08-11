import { useQuery } from "@tanstack/react-query";
import { fetchBranches } from "../services/branchService";
import { branchKeys } from "../api/branchKeys";

const useBranches = () => {
    return useQuery({
        queryKey: branchKeys.all,
        queryFn: fetchBranches,
    });
};

export default useBranches;