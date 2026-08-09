import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../services/userService";

const useDeleteUser = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: (slug) => userService.delete(slug),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

        },

    });

};

export default useDeleteUser;