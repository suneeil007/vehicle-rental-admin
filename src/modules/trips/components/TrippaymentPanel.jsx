import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, PlusCircle } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { usePaymentsByTrip } from "../../payments/hooks/usePaymentsByTrip";
import { PaymentColumns } from "../../payments/components/PaymentColumns";
import { PaymentTable } from "../../payments/components/PaymentTable";
import { RecordPaymentDialog } from "../../payments/components/RecordPaymentDialog";

const formatAmount = (amount) =>
    Number(amount ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const TripPaymentPanel = ({ trip }) => {

    const navigate = useNavigate();

    const [recordOpen, setRecordOpen] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Safety check
    |--------------------------------------------------------------------------
    */

    if (!trip) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-sm text-red-600">
                        Trip data is not available.
                    </p>
                </CardContent>
            </Card>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | IDs
    |--------------------------------------------------------------------------
    */

    const tripId = trip.id ?? null;

    const bookingId =
        trip.booking_id ??
        trip.booking?.id ??
        null;

    /*
    |--------------------------------------------------------------------------
    | Payment API
    |--------------------------------------------------------------------------
    */

    const {
        data,
        isLoading,
        isError,
        error,
    } = usePaymentsByTrip(trip.slug);

    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    */

    const payments = data?.data ?? data ?? [];

    /*
    |--------------------------------------------------------------------------
    | Total Paid
    |--------------------------------------------------------------------------
    */

    const totalPaid = payments
        .filter((payment) => payment.status === "paid")
        .reduce((sum, payment) => {

            const amount = Number(payment.amount ?? 0);

            if (payment.type === "refund") {
                return sum - amount;
            }

            return sum + amount;

        }, 0);

    /*
    |--------------------------------------------------------------------------
    | Total Payable
    |--------------------------------------------------------------------------
    */

    const totalPayable = Number(
        trip.total_amount ?? 0
    );

    /*
    |--------------------------------------------------------------------------
    | Due
    |--------------------------------------------------------------------------
    */

    const due = Math.max(
        totalPayable - totalPaid,
        0
    );

    /*
    |--------------------------------------------------------------------------
    | Payment Table Columns
    |--------------------------------------------------------------------------
    */

    const columns = PaymentColumns({
        onView: (payment) => {
            navigate(`/payments/${payment.slug}`);
        },
    });

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Card>

            {/* -------------------------------------------------------------- */}
            {/* HEADER */}
            {/* -------------------------------------------------------------- */}

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle className="flex items-center gap-2 normal-case">

                    <Wallet className="h-4 w-4 text-slate-500" />

                    Payments

                </CardTitle>

                {/* RECORD PAYMENT BUTTON */}

                <Button
                    type="button"
                    size="sm"
                    className={
                        due <= 0
                            ? "cursor-not-allowed bg-slate-200 text-slate-400"
                            : "cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                    }
                    onClick={() => {

                        if (due <= 0) {
                            return;
                        }

                        setRecordOpen(true);
                    }}
                    disabled={!tripId || due <= 0}
                >

                    <PlusCircle className="mr-2 h-4 w-4" />

                    Record Payment

                </Button>

            </CardHeader>

            <CardContent className="space-y-5">

                {/* ---------------------------------------------------------- */}
                {/* PAYMENT SUMMARY */}
                {/* ---------------------------------------------------------- */}

                <div className="grid grid-cols-3 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

                    {/* TOTAL PAYABLE */}

                    <div>

                        <p className="text-xs text-slate-500">
                            Total Payable
                        </p>

                        <p className="text-lg font-semibold text-slate-900">
                            Rs. {formatAmount(totalPayable)}
                        </p>

                    </div>

                    {/* PAID */}

                    <div>

                        <p className="text-xs text-slate-500">
                            Paid
                        </p>

                        <p className="text-lg font-semibold text-emerald-700">
                            Rs. {formatAmount(totalPaid)}
                        </p>

                    </div>

                    {/* DUE */}

                    <div>

                        <p className="text-xs text-slate-500">
                            Due
                        </p>

                        <p
                            className={`text-lg font-semibold ${
                                due > 0
                                    ? "text-red-600"
                                    : "text-emerald-700"
                            }`}
                        >
                            Rs. {formatAmount(due)}
                        </p>

                    </div>

                </div>

                {/* ---------------------------------------------------------- */}
                {/* PAYMENT HISTORY */}
                {/* ---------------------------------------------------------- */}

                <div>

                    <p className="mb-2 text-sm font-medium text-slate-700">
                        Payment History
                    </p>

                    {isError ? (

                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                            Failed to load payment history.

                            {error?.message && (
                                <div className="mt-1">
                                    {error.message}
                                </div>
                            )}

                        </div>

                    ) : (

                        <PaymentTable
                            data={payments}
                            columns={columns}
                            isLoading={isLoading}
                        />

                    )}

                </div>

            </CardContent>

            {/* -------------------------------------------------------------- */}
            {/* RECORD PAYMENT DIALOG */}
            {/* -------------------------------------------------------------- */}

            <RecordPaymentDialog
                open={recordOpen}
                onClose={() => setRecordOpen(false)}
                bookingId={bookingId}
                tripId={tripId}
                defaultType="final"
            />

        </Card>
    );
};

export default TripPaymentPanel;