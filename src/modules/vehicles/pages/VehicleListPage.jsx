import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useVehicles from "../hooks/useVehicles";
import useDeleteVehicle from "../hooks/useDeleteVehicle";

import VehicleColumns from "../components/VehicleColumns";
import VehicleTable from "../components/VehicleTable";
import VehicleToolbar from "../components/VehicleToolbar";
import DeleteVehicleDialog from "../components/DeleteVehicleDialog";

const VehicleListPage = () => {
    const navigate = useNavigate();

    const { data = [], isLoading } = useVehicles();

    const deleteMutation = useDeleteVehicle();

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleEdit = (vehicle) => {
        navigate(`/vehicles/${vehicle.slug}/edit`);
    };

    const handleDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedVehicle) return;

        deleteMutation.mutate(selectedVehicle.slug, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedVehicle(null);
            },
        });
    };

    const columns = VehicleColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <div>
            <VehicleToolbar />

            <VehicleTable
                vehicles={data}
                columns={columns}
                loading={isLoading}
            />

            <DeleteVehicleDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onConfirm={confirmDelete}
                loading={deleteMutation.isPending}
                vehicle={selectedVehicle}
            />
        </div>
    );
};

export default VehicleListPage;