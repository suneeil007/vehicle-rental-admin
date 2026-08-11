import { Pencil, Trash2 } from "lucide-react";

const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
};

const BranchColumns = ({ onEdit, onDelete }) => [
    {
        header: "Branch",
        accessorKey: "name",
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">{row.original.name}</p>
                <p className="text-xs text-gray-500">{row.original.code}</p>
            </div>
        ),
    },

    {
        header: "City",
        accessorKey: "city",
    },

    {
        header: "Phone",
        accessorKey: "phone",
    },

    {
        header: "Manager",
        accessorKey: "manager_name",
        cell: ({ row }) => row.original.manager_name ?? "—",
    },

    {
    header: "Hours",
    accessorKey: "opening_time",
    cell: ({ row }) => {
        const formatTime = (value) => {
            if (!value) return "—";
            const date = new Date(value);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        };

        return (
            <span>
                {formatTime(row.original.opening_time)} – {formatTime(row.original.closing_time)}
            </span>
        );
    },
    },

    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    statusStyles[row.original.status] ?? "bg-gray-100 text-gray-600"
                }`}
            >
                {row.original.status}
            </span>
        ),
    },

    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onEdit(row.original)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(row.original)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        ),
    },
];

export default BranchColumns;