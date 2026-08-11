import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBranch } from "../services/branchService";
import { branchKeys } from "../api/branchKeys";

const useUpdateBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: editBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: branchKeys.all });
        },
    });
};

export default useUpdateBranch;