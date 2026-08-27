import { Pencil, Trash2 } from "lucide-react";

import {
    normalizeVehicleStatus,
} from "./VehicleStatusBadges";

/*
|--------------------------------------------------------------------------
| Status Configuration
|--------------------------------------------------------------------------
*/

const STATUS_CONFIG = {
    available: {
        label: "Available",
        className:
            "bg-green-100 text-green-700",
    },

    booked: {
        label: "Booked",
        className:
            "bg-blue-100 text-blue-700",
    },

    on_trip: {
        label: "On trip",
        className:
            "bg-orange-100 text-orange-700",
    },

    maintenance: {
        label: "Maintenance",
        className:
            "bg-yellow-100 text-yellow-700",
    },

    inactive: {
        label: "Inactive",
        className:
            "bg-gray-100 text-gray-600",
    },
};

/*
|--------------------------------------------------------------------------
| Vehicle Columns
|--------------------------------------------------------------------------
*/

const VehicleColumns = ({
    onEdit,
    onDelete,
}) => [
    /*
    |--------------------------------------------------------------------------
    | Vehicle
    |--------------------------------------------------------------------------
    */

    {
        header: "Vehicle",
        accessorKey: "name",

        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.original.name || "—"}
                </p>

                <p className="text-xs text-gray-500">
                    {row.original.brand || "—"}
                    {" • "}
                    {row.original.model || "—"}
                </p>
            </div>
        ),
    },

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    {
        header: "Category",
        accessorKey: "category",

        cell: ({ row }) => (
            <span>
                {row.original.category?.name ??
                    "—"}
            </span>
        ),
    },

    /*
    |--------------------------------------------------------------------------
    | Registration
    |--------------------------------------------------------------------------
    */

    {
        header: "Registration",
        accessorKey:
            "registration_number",

        cell: ({ row }) => (
            <span>
                {row.original
                    .registration_number || "—"}
            </span>
        ),
    },

    /*
    |--------------------------------------------------------------------------
    | Seats
    |--------------------------------------------------------------------------
    */

    {
        header: "Seats",
        accessorKey: "seat_capacity",

        cell: ({ row }) => (
            <span>
                {row.original.seat_capacity ??
                    "—"}
            </span>
        ),
    },

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    {
        header: "Price / Day",
        accessorKey: "price_per_day",

        cell: ({ row }) => (
            <span className="font-medium">
                Rs.{" "}
                {row.original.price_per_day ??
                    "0.00"}
            </span>
        ),
    },

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    {
        header: "Status",
        accessorKey: "status",

        cell: ({ row }) => {
            const normalizedStatus =
                normalizeVehicleStatus(
                    row.original.status
                );

            const config =
                STATUS_CONFIG[
                    normalizedStatus
                ];

            /*
            |--------------------------------------------------------------------------
            | Unknown status
            |--------------------------------------------------------------------------
            */

            if (!config) {
                return (
                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            bg-gray-100
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-gray-600
                        "
                    >
                        {row.original.status ||
                            "Unknown"}
                    </span>
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Known status
            |--------------------------------------------------------------------------
            */

            return (
                <span
                    className={`
                        inline-flex
                        items-center
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        ${config.className}
                    `}
                >
                    {config.label}
                </span>
            );
        },
    },

    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    {
        id: "actions",

        header: () => (
            <div className="text-right">
                Actions
            </div>
        ),

        enableSorting: false,

        cell: ({ row }) => (
            <div className="flex justify-end gap-2">

                {/* Edit */}
                <button
                    type="button"
                    onClick={() =>
                        onEdit?.(
                            row.original
                        )
                    }
                    className="
                        rounded-lg
                        p-2
                        text-blue-600
                        transition
                        hover:bg-blue-50
                        cursor-pointer
                    "
                    title="Edit vehicle"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                    type="button"
                    onClick={() =>
                        onDelete?.(
                            row.original
                        )
                    }
                    className="
                        rounded-lg
                        p-2
                        text-red-600
                        transition
                        hover:bg-red-50
                        cursor-pointer
                    "
                    title="Delete vehicle"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

            </div>
        ),
    },
];

export default VehicleColumns;