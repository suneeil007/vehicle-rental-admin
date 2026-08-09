import { useNavigate } from "react-router-dom";
import { useState } from "react";

import useVehicleCategories from "../hooks/useVehicleCategories";
import useDeleteVehicleCategory from "../hooks/useDeleteVehicleCategory";

import VehicleCategoryTable from "../components/vehicleCategoryTable";
import VehicleCategoryColumns from "../components/VehicleCategoryColumns";
import DeleteVehicleCategoryDialog from "../components/DeleteVehicleCategoryDialog";
import VehicleCategoryToolbar from "../components/VehicleCategoryToolbar"



const VehicleCategoryListPage = () => {
    const navigate = useNavigate();

    const { data = [], isLoading } = useVehicleCategories();
    // console.log("Vehicle Categories", data);
    const deleteMutation = useDeleteVehicleCategory();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);


    const handleEdit = (category) => {
        navigate(`/vehicle-categories/${category.slug}/edit`);
    };

    const handleDelete = (category) => {
        setSelectedCategory(category);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if(!selectedCategory) return;
        deleteMutation.mutate(selectedCategory.slug, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedCategory(null);
            },
        });
    };

    const columns = VehicleCategoryColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <div>

             <VehicleCategoryToolbar />

            <VehicleCategoryTable
                categories={data}
                columns={columns}
            />

             <DeleteVehicleCategoryDialog 
                 open={deleteOpen}
                 onOpenChange={setDeleteOpen}
                 onConfirm={confirmDelete}
                 loading={deleteMutation.isPending}
                 category={selectedCategory}
             />

        </div>
    )

}


export default VehicleCategoryListPage;