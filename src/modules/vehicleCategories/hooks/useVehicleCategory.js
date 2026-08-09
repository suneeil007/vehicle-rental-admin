import { useQuery } from "@tanstack/react-query";
import { getVehicleCategory } from "../api/vehicleCategoryApi";

const useVehicleCategory = (slug) => {

    return useQuery({

        queryKey: ["vehicle-category", slug],

        queryFn: async () => {
            const response = await getVehicleCategory(slug);
            return response.data.data;
        },

        enabled: !!slug,

    });

};

export default useVehicleCategory;