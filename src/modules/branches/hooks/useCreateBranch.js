import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBranch } from "../services/branchService";
import { branchKeys } from "../api/branchKeys";

const useCreateBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: branchKeys.all });
        },
    });
};

export default useCreateBranch;