import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { List } from "lucide-react";
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

            <div className="flex items-center justify-between mb-0">
                <h1 className="text-xl font-bold text-gray-600 mb-0">Create Vehicle Category</h1>
            
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

            <p className="text-gray-500 text-sm">Add a new vehicle category</p>

            <VehicleCategoryForm
                onSubmit={handleCreate}
                isLoading={isPending}
                onCancel={() => navigate("/vehicle-categories")}
            />

        </div>

    );
};

export default VehicleCategoryCreatePage;