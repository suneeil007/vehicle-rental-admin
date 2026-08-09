import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicleCategory } from "../api/vehicleCategoryApi";

const useDeleteVehicleCategory = () => {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteVehicleCategory,

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["vehicle-categories"],
            });

        },

    });

};

export default useDeleteVehicleCategory;