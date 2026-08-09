import { useMutation } from "@tanstack/react-query";
import { createVehicleCategory } from "../api/vehicleCategoryApi";


const useCreateVehicleCategory = () => {

    return useMutation({
        mutationFn: createVehicleCategory
    });

};


export default useCreateVehicleCategory;