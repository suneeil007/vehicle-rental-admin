import { Pencil, Trash2 } from "lucide-react";

const statusStyles = {
    available: "bg-green-100 text-green-700",
    booked: "bg-blue-100 text-blue-700",
    maintenance: "bg-yellow-100 text-yellow-700",
    inactive: "bg-gray-100 text-gray-600",
};

const VehicleColumns = ({ onEdit, onDelete }) => [
    {
        header: "Vehicle",
        accessorKey: "name",
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.original.name}
                </p>

                <p className="text-xs text-gray-500">
                    {row.original.brand} • {row.original.model}
                </p>
            </div>
        ),
    },

    {
        header: "Category",
        accessorKey: "category.name",
        cell: ({ row }) => row.original.category?.name ?? "—",
    },

    {
        header: "Registration",
        accessorKey: "registration_number",
    },

    {
        header: "Seats",
        accessorKey: "seat_capacity",
        cell: ({ row }) => (
            <span>{row.original.seat_capacity}</span>
        ),
    },

    {
        header: "Price / Day",
        accessorKey: "price_per_day",
        cell: ({ row }) => (
            <span className="font-medium">
                Rs. {row.original.price_per_day}
            </span>
        ),
    },

    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    statusStyles[row.original.status] ??
                    "bg-gray-100 text-gray-600"
                }`}
            >
                {row.original.status}
            </span>
        ),
    },

    {
        id: "actions",
        header: () => (
            <div className="text-right">
                Actions
            </div>
        ),

        cell: ({ row }) => (
            <div className="flex justify-end gap-2">

                <button
                    type="button"
                    onClick={() => onEdit(row.original)}
                    className="
                        p-2
                        rounded-lg
                        text-blue-600
                        hover:bg-blue-50
                        transition
                        cursor-pointer
                    ">
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(row.original)}
                    //  onClick={() => {
                    //     console.log("Delete clicked:", row.original);
                    //     onDelete(row.original);
                    // }}
                    className="
                        p-2
                        rounded-lg
                        text-red-600
                        hover:bg-red-50
                        transition
                        cursor-pointer
                    ">
                    <Trash2 className="h-4 w-4" />
                </button>

            </div>
        ),
    },
];

export default VehicleColumns;