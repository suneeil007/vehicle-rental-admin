import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";
import VehicleForm from "../components/vehicleForm";
import useVehicle from "../hooks/useVehicle";
import useUpdateVehicle from "../hooks/useUpdateVehicle";
import { toFormData } from "../../../utils/toFormData";

import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const VehicleEditPage = () => {

    const navigate = useNavigate();
    const { slug } = useParams();

    const { data: vehicle, isLoading } = useVehicle(slug);
    useDocumentTitle(vehicle ? `Edit ${vehicle.name}` : "Edit Vehicle");
    const updateMutation = useUpdateVehicle();

    const handleSubmit = (data) => {

        const formData = toFormData({
            vehicle_category_id: data.vehicle_category_id,
            name: data.name,
            brand: data.brand,
            model: data.model,
            manufacture_year: data.manufacture_year,
            transmission: data.transmission,
            fuel_type: data.fuel_type,
            seat_capacity: data.seat_capacity,
            price_per_day: data.price_per_day,
            registration_number: data.registration_number,
            mileage: data.mileage,
            color: data.color,
            description: data.description,
            status: data.status,
            images: data.images,
            removed_image_ids: data.removed_image_ids,
            _method: "PUT",
        });

        updateMutation.mutate(
            { slug, data: formData },
            {
                onSuccess: () => {
                    toast.success("Vehicle updated successfully.");
                    navigate("/vehicles");
                },
                onError: (error) => {
                    const errors = error.response?.data?.errors;
                    if (errors) {
                        Object.values(errors).flat().forEach((message) => {
                            toast.error(message);
                        });
                        return;
                    }
                    toast.error(
                        error.response?.data?.message || "Something went wrong."
                    );
                },
            }
        );
    };

    if (isLoading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
        
             <div className="flex items-center justify-between mb-0">
                <h1 className="text-xl font-bold text-gray-600 mb-0">Edit Vehicle</h1>
            
                <button
                        type="button"
                        onClick={() => navigate("/vehicles")}
                        className="
                            h-10 w-10
                            flex items-center justify-center
                            rounded-md
                            text-blue-600
                            bg-blue-50
                            hover:bg-white
                            transition
                            cursor-pointer
                            relative top-[10px]
                        "
                        title="Users List"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>

            <p className="text-gray-500 text-sm">Update vehicle details</p>

            <VehicleForm
                defaultValues={vehicle}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                onCancel={() => navigate("/vehicles")}
            />
        </div>
    );
};

export default VehicleEditPage;