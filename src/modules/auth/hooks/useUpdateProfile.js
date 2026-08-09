import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/authApi";

export default function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const { data } = await getProfile();
            return data.data;
        },
    });
}