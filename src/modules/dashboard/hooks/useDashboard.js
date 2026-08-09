import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../api/dashboardApi";

const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard-summary"],

        queryFn: async () => {
            const response = await getDashboardSummary();
            return response.data.data;
        },

        staleTime: 1000 * 60,
    });
};

export default useDashboard;