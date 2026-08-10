import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import VehicleCategoryForm from "../components/vehicleCategoryForm";
import useCreateVehicleCategory from "../hooks/useCreateVehicleCategory";
import { toFormData } from "../../../utils/toFormData"; 
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const VehicleCategoryCreatePage = () => {

    useDocumentTitle("Create Vehicle Category");

    const navigate = useNavigate();

    const { mutate, isPending } = useCreateVehicleCategory();

    const handleCreate = (data) => {

        const formData = toFormData({
            name: data.name,
            description: data.description ?? "",
            status: data.status,
            image: data.image,
        });

        mutate(
            formData,
            {
                onSuccess: () => {
                    toast.success("Vehicle category created successfully");
                    navigate("/vehicle-categories");
                },
                onError: (error) => {
                    toast.error(
                        error.response?.data?.message || "Something went wrong"
                    );
                }
            }
        );
    };

    return (

        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold">Create Vehicle Category</h1>
                <p className="text-gray-500">Add a new vehicle category</p>
            </div>

            <VehicleCategoryForm
                onSubmit={handleCreate}
                isLoading={isPending}
                onCancel={() => navigate("/vehicle-categories")}
            />

        </div>

    );
};

export default VehicleCategoryCreatePage;