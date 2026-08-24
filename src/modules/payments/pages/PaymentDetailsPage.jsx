import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CreditCard,
    User,
    CalendarDays,
    MapPin,
    Car,
    Route,
    Clock,
    Wallet,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    PaymentStatusBadge,
    PaymentTypeBadge,
} from "../components/PaymentStatusBadge";

import { usePayment } from "../hooks/usePayment";

const formatAmount = (amount) =>
    Number(amount ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
};

const PaymentDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isError,
        error,
    } = usePayment(slug);

    const payment = data?.data ?? data;

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (isLoading) {
        return (
            <div className="py-10 text-center text-sm text-muted-foreground">
                Loading payment...
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (isError || !payment) {
        return (
            <div className="space-y-4">

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/payments")}
                    className="cursor-pointer"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Payments
                </Button>

                <Card>
                    <CardContent className="p-6">
                        <p className="text-sm text-red-600">
                            {error?.message || "Payment not found."}
                        </p>
                    </CardContent>
                </Card>

            </div>
        );
    }

    const trip = payment.trip;

    /*
    |--------------------------------------------------------------------------
    | Trip Data
    |--------------------------------------------------------------------------
    */

    const customer =
        trip?.customer ??
        payment.booking?.customer ??
        payment.customer;

    const vehicle =
        trip?.vehicle ??
        trip?.vehicle_details;

    const driver =
        trip?.driver ??
        trip?.assigned_driver;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-5">

            {/* ==============================================================
                PAGE HEADER
            ============================================================== */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/payments")}
                        className="cursor-pointer"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>

                    <div>
                        <h1 className="text-xl font-semibold">
                            Payment Details
                        </h1>

                        <p className="text-sm text-slate-500">
                            {payment.transaction_reference ||
                                payment.slug}
                        </p>
                    </div>

                </div>

            </div>


            {/* ==============================================================
                PAYMENT INFORMATION
            ============================================================== */}

            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold normal-case">

                        <CreditCard className="h-4 w-4 text-slate-500" />

                        Payment Information

                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {/* REFERENCE */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Transaction Reference
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {payment.transaction_reference || "—"}
                            </p>
                        </div>


                        {/* AMOUNT */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Amount
                            </p>

                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                NPR {formatAmount(payment.amount)}
                            </p>
                        </div>


                        {/* TYPE */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Payment Type
                            </p>

                            <div className="mt-1">
                                <PaymentTypeBadge
                                    type={payment.type}
                                />
                            </div>
                        </div>


                        {/* METHOD */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Payment Method
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                {payment.payment_method
                                    ?.replace("_", " ") || "—"}
                            </p>
                        </div>


                        {/* STATUS */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Status
                            </p>

                            <div className="mt-1">
                                <PaymentStatusBadge
                                    status={payment.status}
                                />
                            </div>
                        </div>


                        {/* PAID AT */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Paid At
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDateTime(payment.paid_at)}
                            </p>
                        </div>

                    </div>

                </CardContent>

            </Card>


            {/* ==============================================================
                TRIP SUMMARY
            ============================================================== */}

            {trip && (
                <Card>

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-semibold normal-case">

                            <Route className="h-4 w-4 text-slate-500" />

                            Trip Information

                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {/* CUSTOMER */}

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Customer
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {customer?.name || "—"}
                                </p>
                            </div>


                            {/* VEHICLE */}

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Vehicle
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {vehicle?.name ||
                                        vehicle?.model ||
                                        vehicle?.vehicle_name ||
                                        "—"}
                                </p>
                            </div>


                            {/* RENTAL TYPE */}

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Rental Type
                                </p>

                                <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                    {trip.rental_type
                                        ?.replace("_", " ") || "—"}
                                </p>
                            </div>


                            {/* DRIVER */}

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Driver
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {driver?.name || "—"}
                                </p>
                            </div>


                            {/* PICKUP */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <MapPin className="h-3.5 w-3.5" />

                                    Pickup

                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {trip.pickup_location ||
                                        trip.pickup?.name ||
                                        trip.pickup?.location ||
                                        "—"}
                                </p>
                            </div>


                            {/* DROP */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <MapPin className="h-3.5 w-3.5" />

                                    Drop

                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {trip.drop_location ||
                                        trip.drop?.name ||
                                        trip.drop?.location ||
                                        "—"}
                                </p>
                            </div>


                            {/* PICKUP AT */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <CalendarDays className="h-3.5 w-3.5" />

                                    Pickup At

                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {formatDateTime(
                                        trip.pickup_at ||
                                        trip.pickup_datetime ||
                                        trip.start_at
                                    )}
                                </p>
                            </div>


                            {/* EXPECTED RETURN */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <Clock className="h-3.5 w-3.5" />

                                    Expected Return

                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {formatDateTime(
                                        trip.expected_return ||
                                        trip.expected_return_at ||
                                        trip.expected_end_at
                                    )}
                                </p>
                            </div>


                            {/* ACTUAL RETURN */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <CalendarDays className="h-3.5 w-3.5" />

                                    Actual Return

                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {formatDateTime(
                                        trip.actual_return ||
                                        trip.actual_return_at ||
                                        trip.returned_at
                                    )}
                                </p>
                            </div>


                            {/* TRIP STATUS */}

                            <div>
                                <p className="text-xs font-medium text-slate-500">
                                    Trip Status
                                </p>

                                <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                    {trip.status
                                        ?.replace("_", " ") || "—"}
                                </p>
                            </div>


                            {/* TOTAL TRIP AMOUNT */}

                            <div>
                                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">

                                    <Wallet className="h-3.5 w-3.5" />

                                    Total Trip Amount

                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    NPR{" "}
                                    {formatAmount(
                                        trip.total_amount
                                    )}
                                </p>
                            </div>

                        </div>

                    </CardContent>

                </Card>
            )}


            {/* ==============================================================
                RECEIVED / RELATIONS
            ============================================================== */}

            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold normal-case">

                        <User className="h-4 w-4 text-slate-500" />

                        Payment Reference

                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        {/* RECEIVED BY */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Received By
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {payment.received_by?.name || "—"}
                            </p>
                        </div>


                        {/* BOOKING */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Booking
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {payment.booking?.slug ||
                                    payment.booking?.id ||
                                    "—"}
                            </p>
                        </div>


                        {/* TRIP */}

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Trip
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {trip?.slug ||
                                    trip?.id ||
                                    "—"}
                            </p>
                        </div>

                    </div>

                </CardContent>

            </Card>


            {/* ==============================================================
                DATES
            ============================================================== */}

            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold normal-case">

                        <CalendarDays className="h-4 w-4 text-slate-500" />

                        Payment Dates

                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                            <p className="text-xs font-medium text-slate-500">
                                Created At
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDateTime(
                                    payment.created_at
                                )}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs font-medium text-slate-500">
                                Updated At
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDateTime(
                                    payment.updated_at
                                )}
                            </p>

                        </div>

                    </div>

                </CardContent>

            </Card>


            {/* ==============================================================
                NOTES
            ============================================================== */}

            {payment.notes && (
                <Card>

                    <CardHeader>

                        <CardTitle className="text-sm font-semibold normal-case">
                            Notes
                        </CardTitle>

                    </CardHeader>

                    <CardContent>

                        <p className="text-sm text-slate-700">
                            {payment.notes}
                        </p>

                    </CardContent>

                </Card>
            )}

        </div>
    );
};

export default PaymentDetailsPage;