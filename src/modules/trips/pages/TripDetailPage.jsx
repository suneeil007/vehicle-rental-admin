import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import {
    User,
    Car,
    UserRound,
    MapPin,
    Navigation,
    CalendarDays,
    Clock3,
    Gauge,
    Fuel,
    Wallet,
    Route,
    Wrench,
    ArrowLeft,
    Pencil,
    Truck,
    Play,
    CheckCircle2,
    FileText,
    XCircle,
    ListChecks,
} from "lucide-react";

import useTrip from "../hooks/useTrip";
import usePickupTrip from "../hooks/usePickupTrip";
import useStartTrip from "../hooks/useStartTrip";
import useGenerateInvoice from "../hooks/useGenerateInvoice";

import CompleteTripDialog from "../components/CompleteTripDialog";
import CancelTripDialog from "../components/CancelTripDialog";
import TripPaymentPanel from "../components/TrippaymentPanel";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

const TripDetailPage = () => {
    const { slug } = useParams();

    const {
        data: trip,
        isLoading,
        isError,
    } = useTrip(slug);

    const [completeOpen, setCompleteOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);

    const pickupTrip = usePickupTrip();
    const startTrip = useStartTrip();
    const generateInvoice = useGenerateInvoice();

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <div className="text-sm text-slate-500">
                    Loading trip...
                </div>
            </div>
        );
    }

    if (isError || !trip) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="font-medium text-red-700">
                    Trip not found.
                </p>

                <Button
                    asChild
                    variant="outline"
                    className="mt-4"
                >
                    <Link to="/trips">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Trips
                    </Link>
                </Button>
            </div>
        );
    }

    const canPickup = trip.status === "scheduled";
    const canCancel = trip.status === "scheduled";
    const canStart = trip.status === "picked_up";
    const canComplete = trip.status === "on_trip";
    const canGenerateInvoice = trip.status === "completed";


    console.log("TRIP:", trip);
console.log("TRIP STATUS:", trip.status);
console.log("VEHICLE:", trip.vehicle);
console.log("VEHICLE STATUS:", trip.vehicle?.status);

    const formatAmount = (amount) =>
        Number(amount ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDateTime = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString();
    };

    const statusLabel = trip.status
        ? trip.status.replace("_", " ")
        : "Unknown";

    const billingItems = [
        {
            label: "Base Amount",
            amount: trip.base_amount,
            icon: Wallet,
        },
        {
            label: "Extra KM Charge",
            amount: trip.extra_km_charge,
            icon: Route,
        },
        {
            label: "Late Return Charge",
            amount: trip.late_return_charge,
            icon: Clock3,
        },
        {
            label: "Damage Charge",
            amount: trip.damage_charge,
            icon: Wrench,
        },
        {
            label: "Fuel Charge",
            amount: trip.fuel_charge,
            icon: Fuel,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50/60">
            <div className="max-w-12xl space-y-6 p-4 md:p-6 bg-white rounded-lg">

                {/* PAGE HEADER */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="-ml-2 text-slate-500"
                            >
                                <Link to="/trips">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Trips
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Trip Details
                            </h1>

                            {/* STATUS BADGE */}
                            <Badge
                                className={`inline-flex h-7 items-center justify-center border px-2.5 py-0 text-xs font-medium capitalize ${
                                    STATUS_STYLES[trip.status] ??
                                    "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                            >
                                <span className="translate-y-[1px]">
                                    {statusLabel}
                                </span>
                            </Badge>

                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage trip information, vehicle condition and billing.
                        </p>
                    </div>

                    {/* TOP ACTIONS */}
                    <div className="flex flex-wrap gap-2">

                        <Button
                            asChild
                            variant="outline"
                        >
                            <Link to={`/trips/${trip.slug}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>

                        {canPickup && (
                            <Button
                                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() =>
                                    pickupTrip.mutate(trip.slug)
                                }
                            >
                                <Truck className="mr-2 h-4 w-4" />
                                Hand Over Vehicle
                            </Button>
                        )}

                        {canStart && (
                            <Button
                                className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
                                onClick={() => startTrip.mutate(trip.slug)}
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Start Trip
                            </Button>
                        )}

                        {canComplete && (
                            <Button
                                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                                onClick={() =>
                                    setCompleteOpen(true)
                                }
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Complete Trip
                            </Button>
                        )}

                        {canGenerateInvoice && (
                            <Button
                                variant="outline"
                                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                                onClick={() =>
                                    generateInvoice.mutate(trip.slug)
                                }
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Invoice
                            </Button>
                        )}

                        {canCancel && (
                            <Button
                                variant="destructive"
                                className="cursor-pointer bg-red-500 text-white hover:bg-red-700"
                                onClick={() =>
                                    setCancelOpen(true)
                                }
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Trip
                            </Button>
                        )}

                    </div>
                </div>

                {/* TOP INFORMATION */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                    {/* CUSTOMER & VEHICLE */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 normal-case">
                                <User className="h-4 w-4 text-slate-500" />
                                Customer & Vehicle
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <InfoRow
                                icon={User}
                                label="Customer"
                                value={trip.customer?.name}
                            />

                            <InfoRow
                                icon={Car}
                                label="Vehicle"
                                value={trip.vehicle?.name}
                            />

                            <InfoRow
                                icon={Route}
                                label="Rental Type"
                                value={
                                    trip.rental_type === "with_driver"
                                        ? "With Driver"
                                        : "Self Drive"
                                }
                            />

                            {trip.driver && (
                                <InfoRow
                                    icon={UserRound}
                                    label="Driver"
                                    value={trip.driver.name}
                                />
                            )}

                        </CardContent>
                    </Card>

                    {/* PICKUP / DROP */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 normal-case">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                Pickup / Drop
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <InfoRow
                                icon={MapPin}
                                label="Pickup"
                                value={
                                    trip.pickup_branch?.name ??
                                    trip.pickup_location ??
                                    "—"
                                }
                            />

                            <InfoRow
                                icon={Navigation}
                                label="Drop"
                                value={
                                    trip.drop_branch?.name ??
                                    trip.drop_location ??
                                    "—"
                                }
                            />

                            <InfoRow
                                icon={CalendarDays}
                                label="Pickup At"
                                value={formatDateTime(trip.pickup_at)}
                            />

                            <InfoRow
                                icon={Clock3}
                                label="Expected Return"
                                value={formatDateTime(
                                    trip.expected_return_at
                                )}
                            />

                            {trip.actual_return_at && (
                                <InfoRow
                                    icon={CheckCircle2}
                                    label="Actual Return"
                                    value={formatDateTime(
                                        trip.actual_return_at
                                    )}
                                />
                            )}

                        </CardContent>
                    </Card>

                    {/* VEHICLE CONDITION */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 normal-case">
                                <Car className="h-4 w-4 text-slate-500" />
                                Vehicle Condition
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <InfoRow
                                icon={Gauge}
                                label="Pickup Odometer"
                                value={
                                    trip.pickup_odometer != null
                                        ? `${trip.pickup_odometer} km`
                                        : "—"
                                }
                            />

                            <InfoRow
                                icon={Gauge}
                                label="Return Odometer"
                                value={
                                    trip.return_odometer != null
                                        ? `${trip.return_odometer} km`
                                        : "—"
                                }
                            />

                            <InfoRow
                                icon={Fuel}
                                label="Pickup Fuel"
                                value={
                                    trip.pickup_fuel != null
                                        ? trip.pickup_fuel
                                        : "—"
                                }
                            />

                            <InfoRow
                                icon={Fuel}
                                label="Return Fuel"
                                value={
                                    trip.return_fuel != null
                                        ? trip.return_fuel
                                        : "—"
                                }
                            />

                        </CardContent>
                    </Card>

                    {/* BILLING */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 normal-case">
                                <ListChecks className="h-4 w-4 text-slate-500" />
                                Billing Summary
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">

                            <div className="px-5 py-3">

                                {billingItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between border-b border-slate-100 py-1 last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                                                    <Icon className="h-4 w-4 text-slate-500" />
                                                </div>

                                                <span className="text-sm text-slate-600">
                                                    {item.label}
                                                </span>

                                            </div>

                                            <span className="text-sm font-medium text-slate-900">
                                                Rs. {formatAmount(item.amount)}
                                            </span>
                                        </div>
                                    );
                                })}

                            </div>

                            {/* TOTAL */}
                            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-slate-900">
                                            Total
                                        </span>
                                    </div>

                                    <span className="text-xl font-bold text-slate-900">
                                        Rs. {formatAmount(trip.total_amount)}
                                    </span>

                                </div>

                            </div>

                        </CardContent>
                    </Card>

                </div>

                {/* PAYMENTS */}
                <TripPaymentPanel trip={trip} />

                {/* CANCELLATION */}
                {trip.status === "cancelled" && (
                    <Card className="border-red-200">

                        <CardHeader className="border-b border-red-100 bg-red-50/60">
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <XCircle className="h-5 w-5" />
                                Cancellation
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            <InfoRow
                                icon={FileText}
                                label="Reason"
                                value={
                                    trip.cancellation_reason ?? "—"
                                }
                            />

                            <InfoRow
                                icon={Clock3}
                                label="Cancelled At"
                                value={formatDateTime(
                                    trip.cancelled_at
                                )}
                            />

                        </CardContent>
                    </Card>
                )}

                {/* BOTTOM ACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">

                    <Button
                        asChild
                        variant="ghost"
                        className="cursor-pointer"
                    >
                        <Link to="/trips">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Trips
                        </Link>
                    </Button>

                    <div className="flex flex-wrap gap-2">

                        {canPickup && (
                            <Button
                                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                                onClick={() =>
                                    pickupTrip.mutate(trip.slug)
                                }
                            >
                                <Truck className="mr-2 h-4 w-4" />
                                Hand Over Vehicle
                            </Button>
                        )}

                        {canStart && (
                           <Button
                            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700"
                            onClick={() => startTrip.mutate(trip.slug)}
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Start Trip
                        </Button>
                        )}

                        {canComplete && (
                            <Button
                                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                                onClick={() =>
                                    setCompleteOpen(true)
                                }
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Complete Trip
                            </Button>
                        )}

                    </div>
                </div>

                {/* DIALOGS */}
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

            </div>
        </div>
    );
};

/**
 * Reusable information row
 */
const InfoRow = ({ icon: Icon, label, value }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4 text-slate-500" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium normal-case text-slate-400">
                    {label}
                </p>

                <p className="mt-0.5 text-xs font-medium text-slate-800">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
};

export default TripDetailPage;