import { Pencil, Trash2, Check, X, Ban, Car, RotateCcw, Activity } from "lucide-react";

const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-red-100 text-red-700",
    trip_created: "bg-purple-100 text-purple-700",
    completed: "bg-gray-100 text-gray-600",
};

const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const BookingColumns = ({
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onCancel,
    onCreateTrip,
    onRestore,
    isSuperAdmin = false,
}) => [
    {
        header: "Booking",
        accessorKey: "slug",
        cell: ({ row }) => (
            <div>
                <p className="font-medium text-gray-900">
                    {row.original.customer?.name ?? "—"}
                </p>
                <p className="text-xs text-gray-500">
                    {row.original.vehicle?.name ?? "—"}
                </p>
            </div>
        ),
    },

    {
        header: "Pickup",
        accessorKey: "pickup_at",
        cell: ({ row }) => (
            <div>
                <p>{formatDateTime(row.original.pickup_at)}</p>
                <p className="text-xs text-gray-500">
                    {row.original.pickup_branch?.name ?? "—"}
                </p>
            </div>
        ),
    },

    {
        header: "Expected Return",
        accessorKey: "expected_return_at",
        cell: ({ row }) => formatDateTime(row.original.expected_return_at),
    },

    {
        header: "Amount",
        accessorKey: "final_amount",
        cell: ({ row }) => (
            <span className="font-medium">
                Rs. {row.original.final_amount ?? row.original.quoted_amount}
            </span>
        ),
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
                {row.original.status?.replace("_", " ")}
            </span>
        ),
    },

    
    {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const booking = row.original;
            const status = booking.status;

            const isPending = status === "pending";
            const isApproved = status === "approved";
            const isCancelled = status === "cancelled";
            const isRejected = status === "rejected";
            const isTripCreated = status === "trip_created";

            const canCancel = ["pending", "approved"].includes(status);
            const canRestore = isCancelled || isRejected;
            const canDelete =
                isSuperAdmin &&
                ["pending", "rejected", "cancelled"].includes(status);

            return (
                <div className="flex gap-1.5 flex-wrap">

                    {/* Approve — matches canBeApproved() */}
                    {isPending && (
                        <button type="button" onClick={() => onApprove(booking)} title="Approve" className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition cursor-pointer">
                            <Check className="h-4 w-4" />
                        </button>
                    )}

                    {/* Reject — matches isPending() check in service */}
                    {isPending && (
                        <button type="button" onClick={() => onReject(booking)} title="Reject" className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer">
                            <X className="h-4 w-4" />
                        </button>
                    )}

                    {/* Cancel — matches canBeCancelled() exactly */}
                    {canCancel && (
                        <button type="button" onClick={() => onCancel(booking)} title="Cancel" className="p-2 rounded-lg text-orange-600 hover:bg-orange-50 transition cursor-pointer">
                            <Ban className="h-4 w-4" />
                        </button>
                    )}

                    {/* Create Trip — matches service's explicit STATUS_APPROVED check */}
                    {isApproved && (
                        <button type="button" onClick={() => onCreateTrip(booking)} title="Create Trip" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer">
                            <Car className="h-4 w-4" />
                        </button>
                    )}

                    {/* Restore — matches canBeRestored() (cancelled or rejected) */}
                    {canRestore && (
                        <button type="button" onClick={() => onRestore(booking)} title="Restore" className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition cursor-pointer">
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    )}

                    {/* Edit — only shown (enabled) when pending */}
                    {isPending && (
                        <button type="button" onClick={() => onEdit(booking)} title="Edit" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer">
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}

                    {/* Ongoing indicator — trip_created only, informational, not clickable */}
                    {isTripCreated && (
                        <span
                            title="Trip in progress"
                            className="p-2 rounded-lg  text-gray-400 flex items-center justify-center"
                        >
                            <Activity className="h-4 w-4" />
                        </span>
                    )}

                    {/* Delete — hidden entirely once a trip has been created, and gated by role + status */}
                    {!isTripCreated && canDelete && (
                        <button type="button" onClick={() => onDelete(booking)} title="Delete" className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}

                </div>
            );
        },
    },
];

export default BookingColumns;