import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import VehicleForm from "../components/vehicleForm";
import useCreateVehicle from "../hooks/useCreateVehicle";
import { toFormData } from "../../../utils/toFormData";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const VehicleCreatePage = () => {

    useDocumentTitle("Create Vehicle");
    
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateVehicle();

    const handleCreate = (data) => {

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
            featured_new_index: data.featured_new_index,
        });

        mutate(
            formData,
            {
                onSuccess: () => {
                    toast.success("Vehicle created successfully");
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
                        error.response?.data?.message || "Something went wrong"
                    );
                },
            }
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Create Vehicle</h1>
                <p className="text-gray-500">Add a new vehicle to the fleet</p>
            </div>

            <VehicleForm
                onSubmit={handleCreate}
                isLoading={isPending}
                onCancel={() => navigate("/vehicles")}
            />
        </div>
    );
};

export default VehicleCreatePage;