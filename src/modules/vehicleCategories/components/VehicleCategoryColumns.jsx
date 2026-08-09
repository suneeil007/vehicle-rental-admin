import { Button } from "@/components/ui/button";
import {
    Eye,
     Pencil,
      Trash2
} from "lucide-react";


const VehicleCategoryColumns = ({
    onEdit,
      onDelete,
        isDeleting,
}) => [
    {
        id: "sn",
        header: "S.N.",
        cell: ({ row }) => row.index + 1,
    },

    {
        accessorKey: "name",
        header: "Category Name",
        cell: ({ row }) => (
            <span className="font-medium">
                {row.original.name}
            </span>
        ),
    },

    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.original.description ?? "";

            return (
                <span>
                    {
                        description.length > 60
                            ? `${description.substring(0, 60)}...`
                            :  description
                    }
                </span>
            );
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            row.original.status ? (
                <span
                   className="
                      inline-flex
                      rounded-full
                      bg-green-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-green-700
                   ">
                    Active
                </span>
            ) : (
                <span
                    className="
                        inline-flex
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-red-700
                    ">
                    Inactive
                </span>

            )
        )
    },

    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            if(!row.original.created_at)
                return "-";
            return new Date(
                row.original.created_at
            ).toLocaleDateString();
        }
    },

    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">

             
                {/* Edit */}

                <button
                    onClick={() => onEdit(row.original)}
                    title="Edit Vehicle Category"
                    className="
                        p-2
                        rounded-lg
                        text-blue-600
                        hover:bg-blue-50
                        transition
                        cursor-pointer
                    ">
                    <Pencil size={18}/>
                </button>


                 {/* Delete */}

                 <button
                    variant="destructive"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => onDelete(row.original)}
                    title="Delete Vehicle Category"
                    className="
                        p-2
                        rounded-lg
                        text-red-600
                        hover:bg-red-50
                        transition
                        cursor-pointer
                      ">
                        <Trash2 size={18}/>
                    </button>                

            </div>
        )
    }
]

export default VehicleCategoryColumns;