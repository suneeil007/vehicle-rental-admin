import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/authApi";

const useProfile = () => {
    return useQuery({
        queryKey: ["profile"],

        queryFn: async () => {
            const response = await getProfile();

            // API Response:
            // {
            //   success: true,
            //   data: { ...user }
            // }

            return response.data.data;
        },

        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export default useProfile;