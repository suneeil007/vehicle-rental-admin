import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/authApi";
import { authKeys } from "../api/authKeys";

const useProfile = () => {
    return useQuery({
        queryKey: authKeys.profile,
        queryFn: async () => {
            const response = await getProfile();
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // 5 min — role rarely changes mid-session
    });
};

export default useProfile;