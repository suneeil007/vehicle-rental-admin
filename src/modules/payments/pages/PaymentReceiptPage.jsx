import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Download,
    Printer,
    MapPin,
    CalendarDays,
    User,
    CreditCard,
} from "lucide-react";

import { usePayment } from "../hooks/usePayment";

const formatAmount = (amount) =>
    Number(amount ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
};

const calculateDuration = (start, end) => {
    if (!start || !end) return "—";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const difference = endDate - startDate;

    if (difference <= 0) return "—";

    const totalMinutes = Math.floor(difference / (1000 * 60));

    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor(
        (totalMinutes % (60 * 24)) / 60
    );
    const minutes = totalMinutes % 60;

    const parts = [];

    if (days > 0) {
        parts.push(`${days} day${days > 1 ? "s" : ""}`);
    }

    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }

    if (minutes > 0) {
        parts.push(
            `${minutes} minute${minutes > 1 ? "s" : ""}`
        );
    }

    return parts.length ? parts.join(", ") : "Less than 1 minute";
};

const PaymentReceiptPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const receiptRef = useRef(null);

    const {
        data,
        isLoading,
        isError,
    } = usePayment(slug);

    const payment = data?.data ?? data;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="py-10 text-center text-sm text-muted-foreground">
                Loading receipt...
            </div>
        );
    }

    if (isError || !payment) {
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                Payment receipt could not be loaded.
            </div>
        );
    }

    const trip = payment.trip;

    const customer =
        trip?.customer ||
        payment.booking?.customer ||
        null;

    const paymentSummary =
        payment.payment_summary || {};

    const tripTotal =
        Number(
            paymentSummary.trip_total ??
            trip?.total_amount ??
            0
        );

    const totalPaid =
        Number(
            paymentSummary.total_paid ?? 0
        );

    const remainingDue =
        Number(
            paymentSummary.remaining_due ??
            Math.max(0, tripTotal - totalPaid)
        );

    const isFullyPaid =
        remainingDue <= 0;

    /*
    |--------------------------------------------------------------------------
    | Duration
    |--------------------------------------------------------------------------
    */

    const duration = calculateDuration(
        trip?.pickup_at,
        trip?.actual_return_at ||
            trip?.expected_return_at
    );

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */

    const pickupLocation =
        trip?.pickup_location || "—";

    const dropLocation =
        trip?.drop_location || "—";

    return (
        <div className="payment-receipt-page min-h-screen bg-slate-100 p-6 print:bg-white print:p-0">

            {/* ACTION BAR */}

            <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between print:hidden">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </button>

                </div>

            </div>


            {/* RECEIPT */}

            <div
                ref={receiptRef}
                className="payment-receipt mx-auto max-w-3xl bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none"
            >

                {/* HEADER */}

                <div className="border-b border-slate-200 pb-5 text-center">

                    <h1 className="text-2xl font-bold text-slate-900">
                        VEHICLE RENTAL
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Payment Receipt
                    </p>

                </div>


                {/* RECEIPT INFO */}

                <div className="mt-6 flex justify-between">

                    <div>

                        <p className="text-xs text-slate-500">
                            Receipt No.
                        </p>

                        <p className="text-sm font-semibold text-slate-900">
                            {payment.transaction_reference ||
                                payment.slug}
                        </p>

                    </div>

                    <div className="text-right">

                        <p className="text-xs text-slate-500">
                            Payment Date
                        </p>

                        <p className="text-sm font-medium text-slate-900">
                            {formatDate(payment.paid_at)}
                        </p>

                    </div>

                </div>


                {/* CUSTOMER INFORMATION */}

                <div className="mt-6 rounded-lg border border-slate-200 p-4">

                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">

                        <User className="h-4 w-4 text-slate-500" />

                        Customer Information

                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div>

                            <p className="text-xs text-slate-500">
                                Customer Name
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {customer?.name || "—"}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Phone
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {customer?.phone || "—"}
                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-slate-900">
                                {customer?.email || "—"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* TRIP INFORMATION */}

                <div className="mt-6 rounded-lg border border-slate-200 p-4">

                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">

                        <MapPin className="h-4 w-4 text-slate-500" />

                        Trip Information

                    </h2>


                    {/* LOCATIONS */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>

                            <p className="text-xs text-slate-500">
                                Pickup Location
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {pickupLocation}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Drop Location
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {dropLocation}
                            </p>

                        </div>

                    </div>


                    {/* DATES */}

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <div>

                            <p className="text-xs text-slate-500">
                                Pickup At
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDate(
                                    trip?.pickup_at
                                )}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Expected Return
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDate(
                                    trip?.expected_return_at
                                )}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Actual Return
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDate(
                                    trip?.actual_return_at
                                )}
                            </p>

                        </div>

                    </div>


                    {/* DURATION */}

                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">

                        <CalendarDays className="h-4 w-4 text-slate-500" />

                        <div>

                            <p className="text-xs text-slate-500">
                                Trip Duration
                            </p>

                            <p className="text-sm font-semibold text-slate-900">
                                {duration}
                            </p>

                        </div>

                    </div>

                </div>


                {/* PAYMENT INFORMATION */}

                <div className="mt-6 rounded-lg border border-slate-200 p-4">

                    <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">

                        <CreditCard className="h-4 w-4 text-slate-500" />

                        Payment Information

                    </h2>


                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <p className="text-xs text-slate-500">
                                Payment Type
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                {payment.type || "—"}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Payment Method
                            </p>

                            <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                {payment.payment_method
                                    ?.replaceAll("_", " ") ||
                                    "—"}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Status
                            </p>

                            <p className="mt-1 text-sm font-semibold capitalize text-emerald-600">
                                {payment.status || "—"}
                            </p>

                        </div>


                        <div>

                            <p className="text-xs text-slate-500">
                                Transaction Reference
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {payment.transaction_reference ||
                                    "—"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* PAYMENT SUMMARY */}

                <div className="mt-6">

                    <div className="overflow-hidden rounded-lg border border-slate-200">

                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                            <span className="text-sm text-slate-600">
                                Trip Total
                            </span>

                            <span className="text-sm font-semibold text-slate-900">
                                NPR {formatAmount(tripTotal)}
                            </span>

                        </div>


                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                            <span className="text-sm text-slate-600">
                                Total Paid
                            </span>

                            <span className="text-sm font-semibold text-slate-900">
                                NPR {formatAmount(totalPaid)}
                            </span>

                        </div>


                        <div
                            className={`flex items-center justify-between px-4 py-4 ${
                                isFullyPaid
                                    ? "bg-emerald-50"
                                    : "bg-amber-50"
                            }`}
                        >

                            <span className="text-sm font-semibold text-slate-900">
                                {isFullyPaid
                                    ? "Payment Status"
                                    : "Remaining Due"}
                            </span>

                            {isFullyPaid ? (

                                <span className="text-sm font-bold text-emerald-600">
                                    FULLY PAID
                                </span>

                            ) : (

                                <span className="text-lg font-bold text-amber-700">
                                    NPR {formatAmount(
                                        remainingDue
                                    )}
                                </span>

                            )}

                        </div>

                    </div>

                </div>


                {/* CURRENT PAYMENT */}

                <div className="mt-6">

                    <div className="flex items-center justify-between border-b border-slate-200 py-4">

                        <span className="text-sm text-slate-600">
                            This Payment
                        </span>

                        <span className="text-xl font-bold text-slate-900">
                            NPR {formatAmount(payment.amount)}
                        </span>

                    </div>

                </div>


                {/* NOTES */}

                {payment.notes && (

                    <div className="mt-6">

                        <p className="text-xs font-medium text-slate-500">
                            Notes
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                            {payment.notes}
                        </p>

                    </div>

                )}


                {/* FOOTER */}

                <div className="mt-10 border-t border-slate-200 pt-5 text-center">

                    <p className="text-xs text-slate-500">
                        Thank you for your payment.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        This is a computer-generated receipt.
                    </p>

                </div>

            </div>


            {/* PRINT CSS */}

            <style>
                {`
                    @media print {

                        /* =========================================
                        HIDE EVERYTHING EXCEPT RECEIPT
                        ========================================= */

                        body * {
                            visibility: hidden !important;
                        }

                        .payment-receipt,
                        .payment-receipt * {
                            visibility: visible !important;
                        }


                        /* =========================================
                        REMOVE ALL LAYOUT OFFSET
                        ========================================= */

                        html,
                        body,
                        #root {
                            width: 100% !important;
                            min-width: 0 !important;

                            margin: 0 !important;
                            padding: 0 !important;

                            background: white !important;
                        }


                        /* =========================================
                        RECEIPT PAGE
                        ========================================= */

                        .payment-receipt-page {
                            position: static !important;

                            width: 100% !important;
                            min-width: 0 !important;

                            margin: 0 !important;
                            padding: 0 !important;

                            background: white !important;
                        }


                        /* =========================================
                        RECEIPT ITSELF
                        ========================================= */

                        .payment-receipt {
                            position: absolute !important;

                            top: 0 !important;
                            left: 0 !important;

                            width: 100% !important;
                            max-width: none !important;

                            margin: 0 !important;
                            padding: 0 !important;

                            background: white !important;

                            box-shadow: none !important;
                        }


                        /* =========================================
                        HIDE ACTION BAR
                        ========================================= */

                        button,
                        .print\\:hidden {
                            display: none !important;
                        }


                        /* =========================================
                        A4
                        ========================================= */

                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default PaymentReceiptPage;

