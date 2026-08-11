import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";

import VehicleCategoryForm from "../components/vehicleCategoryForm";

import useVehicleCategory from "../hooks/useVehicleCategory";
import useUpdateVehicleCategory from "../hooks/useUpdateVehicleCategory";
import { toFormData } from "../../../utils/toFormData"; 
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const VehicleCategoryEditPage = () => {

    const navigate = useNavigate();
    const { slug } = useParams();

    const {
        data: vehicleCategory,
        isLoading,
    } = useVehicleCategory(slug);

    useDocumentTitle(vehicleCategory ? `Edit ${vehicleCategory.name}` : "Edit Vehicle Category");

    const updateMutation = useUpdateVehicleCategory();

    const handleSubmit = (data) => {

        const formData = toFormData({
            name: data.name,
            description: data.description ?? "",
            status: data.status,
            image: data.image, // will be skipped by toFormData if null (no new file selected)
            _method: "PUT",    // Laravel method spoofing — required for FormData + PUT
        });

        updateMutation.mutate(
            {
                slug,
                data: formData,
            },
            {
                onSuccess: () => {

                    toast.success(
                        "Vehicle category updated successfully."
                    );

                    navigate("/vehicle-categories");
                },

                onError: (error) => {

                    const errors = error.response?.data?.errors;

                    if (errors) {
                        Object.values(errors)
                            .flat()
                            .forEach((message) => {
                                toast.error(message);
                            });

                        return;
                    }

                    toast.error(
                        error.response?.data?.message ||
                        "Something went wrong."
                    );
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-6">
        
            <div className="flex items-center justify-between mb-0">
                <h1 className="text-xl font-bold text-gray-600 mb-0">Edit Vehicle Category</h1>
            
                <button
                        type="button"
                        onClick={() => navigate("/vehicle-categories")}
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

            <p className="text-gray-500 text-sm">Update vehicle category details</p>

            <VehicleCategoryForm
                defaultValues={vehicleCategory}
                onSubmit={handleSubmit}
                isLoading={updateMutation.isPending}
                onCancel={() => navigate("/vehicle-categories")}
            />
        </div>
    );
};

export default VehicleCategoryEditPage;