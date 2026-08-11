import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { setFeaturedImage } from "../api/vehicleImageApi";
import { vehicleKeys } from "../api/vehicleKeys";

const useSetFeaturedImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setFeaturedImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
            toast.success("Featured image updated.");
        },
        onError: (error) => {
            console.error("Set featured image error:", error);
            toast.error(
                error?.response?.data?.message ?? "Failed to update featured image."
            );
        },
    });
};

export default useSetFeaturedImage;