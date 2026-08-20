import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

import usePickupTrip from "../hooks/usePickupTrip";
import useStartTrip from "../hooks/useStartTrip";
import useGenerateInvoice from "../hooks/useGenerateInvoice";
import CompleteTripDialog from "./CompleteTripDialog";
import CancelTripDialog from "./CancelTripDialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUS_STYLES = {
    scheduled:
        "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700",

    picked_up:
        "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700",

    on_trip:
        "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700",

    completed:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700",

    cancelled:
        "border-red-200 bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700",
};

// Mirrors the backend's status machine:
// scheduled -> picked_up -> on_trip -> completed
// scheduled -> cancelled (only from scheduled, per Trip::canBeCancelled())
const TripRowActions = ({ trip }) => {
    const [completeOpen, setCompleteOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);

    const pickupTrip = usePickupTrip();
    const startTrip = useStartTrip();
    const generateInvoice = useGenerateInvoice();

    const canPickup = trip.status === "scheduled";
    const canCancel = trip.status === "scheduled";
    const canStart = trip.status === "picked_up";
    const canComplete = trip.status === "on_trip";
    const canGenerateInvoice = trip.status === "completed";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer hover:bg-slate-100"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                    <DropdownMenuItem
                        asChild
                        className="cursor-pointer"
                    >
                        <Link to={`/trips/${trip.slug}`}>
                            View
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        asChild
                        className="cursor-pointer"
                    >
                        <Link to={`/trips/${trip.slug}/edit`}>
                            Edit
                        </Link>
                    </DropdownMenuItem>

                    {canPickup && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => pickupTrip.mutate(trip.slug)}
                        >
                            Hand Over Vehicle
                        </DropdownMenuItem>
                    )}

                    {canStart && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => startTrip.mutate(trip.slug)}
                        >
                            Start Trip
                        </DropdownMenuItem>
                    )}

                    {canComplete && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setCompleteOpen(true)}
                        >
                            Complete Trip
                        </DropdownMenuItem>
                    )}

                    {canGenerateInvoice && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                                generateInvoice.mutate(trip.slug)
                            }
                        >
                            Generate Invoice
                        </DropdownMenuItem>
                    )}

                    {canCancel && (
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => setCancelOpen(true)}
                        >
                            Cancel Trip
                        </DropdownMenuItem>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

            <CompleteTripDialog
                trip={trip}
                open={completeOpen}
                onOpenChange={setCompleteOpen}
            />

            <CancelTripDialog
                trip={trip}
                open={cancelOpen}
                onOpenChange={setCancelOpen}
            />
        </>
    );
};

export const tripColumns = [
    {
        accessorKey: "customer.name",
        header: "Customer",
        cell: ({ row }) => row.original.customer?.name ?? "—",
    },
    {
        accessorKey: "vehicle.name",
        header: "Vehicle",
        cell: ({ row }) => row.original.vehicle?.name ?? "—",
    },
    {
        accessorKey: "rental_type",
        header: "Rental Type",
        cell: ({ row }) =>
            row.original.rental_type === "with_driver"
                ? "With Driver"
                : "Self Drive",
    },
    {
        accessorKey: "driver.name",
        header: "Driver",
        cell: ({ row }) => row.original.driver?.name ?? "—",
    },
    {
        accessorKey: "pickup_at",
        header: "Pickup At",
        cell: ({ row }) =>
            row.original.pickup_at
                ? new Date(row.original.pickup_at).toLocaleString()
                : "—",
    },
    {
        accessorKey: "total_amount",
        header: "Total",
        cell: ({ row }) => `Rs. ${row.original.total_amount}`,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                className={`inline-flex h-6 items-center justify-center border px-2.5 py-0 text-xs font-medium capitalize ${
                    STATUS_STYLES[row.original.status] ??
                    "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50 hover:text-slate-700"
                }`}
            >
                <span className="translate-y-[1px]">
                    {row.original.status.replace("_", " ")}
                </span>
            </Badge>
        ),
    },
    {   accessorKey: "Actions",
        id: "actions",
        cell: ({ row }) => <TripRowActions trip={row.original} />,
    },
];
