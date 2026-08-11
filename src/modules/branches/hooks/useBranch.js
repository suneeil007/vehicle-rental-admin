import { useQuery } from "@tanstack/react-query";
import { fetchBranch } from "../services/branchService";
import { branchKeys } from "../api/branchKeys";

const useBranch = (slug) => {
    return useQuery({
        queryKey: branchKeys.detail(slug),
        queryFn: () => fetchBranch(slug),
        enabled: Boolean(slug),
    });
};

export default useBranch;