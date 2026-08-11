import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBranch } from "../services/branchService";
import { toast } from "sonner";
import { branchKeys } from "../api/branchKeys";

const useDeleteBranch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeBranch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: branchKeys.all });
            toast.success("Branch deleted successfully.");
        },
        onError: (error) => {
            console.error("Delete branch error:", error);
            toast.error(
                error?.response?.data?.message ?? "Failed to delete branch."
            );
        },
    });
};

export default useDeleteBranch;