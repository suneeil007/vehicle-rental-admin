import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicle } from "../api/vehicleApi";
import { toast } from "sonner";

const useDeleteVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            toast.success("Vehicle deleted successfully.");
        },
        onError: (error) => {
            console.error("Delete vehicle error:", error);
            toast.error(
                error?.response?.data?.message ?? "Failed to delete vehicle."
            );
        },
    });
};

export default useDeleteVehicle;