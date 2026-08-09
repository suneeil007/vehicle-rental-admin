import { useMutation, useQueryClient } from "@tanstack/react-query";
import profileService from "../services/profileService";

const useUpdateProfile = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: ({ slug, data }) =>
            profileService.update(slug, data),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: ["profile", variables.slug],
            });

        },

    });

};

export default useUpdateProfile;