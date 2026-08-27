import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useVehicles from "../hooks/useVehicles";
import useDeleteVehicle from "../hooks/useDeleteVehicle";

import VehicleColumns from "../components/VehicleColumns";
import VehicleTable from "../components/VehicleTable";
import VehicleToolbar from "../components/VehicleToolbar";
import VehicleStatusBadges, {
    normalizeVehicleStatus,
} from "../components/VehicleStatusBadges";

import DeleteVehicleDialog from "../components/DeleteVehicleDialog";

import useDocumentTitle from "@/app/hooks/useDocumentTitle";

/*
|--------------------------------------------------------------------------
| Vehicle List Page
|--------------------------------------------------------------------------
*/

const VehicleListPage = () => {
    useDocumentTitle("Vehicles");

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Vehicles API
    |--------------------------------------------------------------------------
    */

    const {
        data: vehicles,
        isLoading,
        isError,
    } = useVehicles();

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const deleteMutation = useDeleteVehicle();

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [selectedVehicle, setSelectedVehicle] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [activeStatus, setActiveStatus] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | All Vehicles
    |--------------------------------------------------------------------------
    */

    const allVehicles = useMemo(() => {
        if (!Array.isArray(vehicles)) {
            return [];
        }

        return vehicles;
    }, [vehicles]);

    /*
    |--------------------------------------------------------------------------
    | Filter Vehicles
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Always normalize both values.
    |
    | This makes:
    |
    | on_trip
    | on trip
    | On Trip
    | ON_TRIP
    | on-trip
    |
    | all work correctly.
    |
    */

    const filteredVehicles = useMemo(() => {
        const normalizedStatus =
            normalizeVehicleStatus(activeStatus);

        if (!normalizedStatus) {
            return allVehicles;
        }

        return allVehicles.filter((vehicle) => {
            const vehicleStatus =
                normalizeVehicleStatus(
                    vehicle?.status
                );

            return vehicleStatus === normalizedStatus;
        });
    }, [allVehicles, activeStatus]);

    /*
    |--------------------------------------------------------------------------
    | Edit
    |--------------------------------------------------------------------------
    */

    const handleEdit = (vehicle) => {
        if (!vehicle?.slug) {
            console.error(
                "Vehicle slug missing:",
                vehicle
            );

            return;
        }

        navigate(
            `/vehicles/${vehicle.slug}/edit`
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const handleDelete = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDeleteOpen(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Confirm Delete
    |--------------------------------------------------------------------------
    */

    const confirmDelete = () => {
        if (!selectedVehicle?.slug) {
            return;
        }

        deleteMutation.mutate(
            selectedVehicle.slug,
            {
                onSuccess: () => {
                    setDeleteOpen(false);
                    setSelectedVehicle(null);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Columns
    |--------------------------------------------------------------------------
    */

    const columns = useMemo(
        () =>
            VehicleColumns({
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        []
    );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-4">

            {/* Toolbar */}
            <VehicleToolbar />

            {/* Error */}
            {isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-600">
                        Failed to load vehicles.
                    </p>
                </div>
            )}

            {/* Table */}
            <VehicleTable
                columns={columns}
                vehicles={filteredVehicles}
                loading={isLoading}
                toolbarRight={
                    <VehicleStatusBadges
                        vehicles={allVehicles}
                        activeStatus={activeStatus}
                        onSelect={setActiveStatus}
                    />
                }
            />

            {/* Delete Dialog */}
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