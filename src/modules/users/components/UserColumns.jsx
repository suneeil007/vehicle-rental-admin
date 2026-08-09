import {
    Eye,
     Pencil,
      Trash2
} from "lucide-react";

export const userColumns = ({
        onView,
           onEdit,
              onDelete,
                  isDeleting 
    }) => [


    // Serial Number
    {
        id: "sn",
        header: "S.N.",
        enableSorting:false,
        cell: ({ table, row }) => {

            const pageIndex =
                table.getState()
                .pagination
                  .pageIndex;

            const pageSize =
                table.getState()
                .pagination
                  .pageSize;

            return (
                pageIndex * pageSize
                +
                row.index
                +
                1
            );
        }
    },

    // Name
    {
        accessorKey: "name",
        header: "Name",
        enableSorting:true,
    },

    // Email
    {
        accessorKey: "email",
        header: "Email",
        enableSorting:true,
    },

    // Phone
    {
        accessorKey: "phone",
        header: "Phone",
        enableSorting:true,
    },

    // Role
    {
        accessorFn: (row) =>
            row.role?.name ?? "-",
        id: "role",
        header: "Role",
        enableSorting:true,

    },

    // Status
    {
        accessorKey: "status",
        header: "Status",
        enableSorting:true,
        cell: ({ row }) => {
           const status =
           row.original.status;
            return (
                <span
                    className={`                    
                        inline-flex
                        items-center
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium                        
                        ${
                            status === "active"
                            ?
                            "bg-green-100 text-green-700"
                            :
                            "bg-gray-100 text-gray-700"
                        }
                    `}>
                    {status}
                </span>
            );
        }
    },

    // Actions
    {
        id: "actions",
        header: "Actions",
        enableSorting:false,
        cell: ({ row }) => {
          const user =
           row.original;
            return (

                <div
                    className="
                        flex
                        items-center
                        gap-1
                    ">

                    {/* View */}

                    <button
                        onClick={() =>
                            onView(user)
                        }
                        title="View User"
                            className="
                                p-2
                                rounded-lg
                                text-green-600
                                hover:bg-green-50
                                transition
                                cursor-pointer
                            ">
                        <Eye size={18}/>
                    </button>

                    {/* Edit */}

                    <button
                        onClick={() =>
                            onEdit(user)
                        }
                        title="Edit User"
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
                        title="Delete User"
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
            );
        }

    }

];