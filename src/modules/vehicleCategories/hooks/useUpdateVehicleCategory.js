import { useMutation } from "@tanstack/react-query";
import { updateVehicleCategory } from "../api/vehicleCategoryApi";

const useUpdateVehicleCategory = () => {
    return useMutation({
        mutationFn: updateVehicleCategory,
    });
};

export default useUpdateVehicleCategory;