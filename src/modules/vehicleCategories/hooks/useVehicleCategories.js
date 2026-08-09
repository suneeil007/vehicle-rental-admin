import { useQuery } from "@tanstack/react-query";
import { getVehicleCategories } from "../api/vehicleCategoryApi";

const useVehicleCategories = () => {

    return useQuery({
        queryKey: ["vehicle-categories"],

        queryFn: async () => {
            const response = await getVehicleCategories();
             return response.data.data;
        },
    });

};

export default useVehicleCategories;