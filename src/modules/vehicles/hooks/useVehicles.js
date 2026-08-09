import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "../api/vehicleApi";

const useVehicles = () => {
    return useQuery({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const response = await getVehicles();
            return response.data.data
        },

    });
};

export default useVehicles;