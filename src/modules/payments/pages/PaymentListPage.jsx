import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { usePayments } from "../hooks/usePayments";
import { PaymentColumns } from "../components/PaymentColumns";
import { PaymentTable } from "../components/PaymentTable";

const SUBMENU_TITLES = {
    "": "All Payments",
    advance: "Advance & Deposit Payments",
    "advance,deposit": "Advance & Deposit Payments",
    final: "Final Settlements",
    refund: "Refunds",
};

export const PaymentListPage = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const typeParam = searchParams.get("type") || "";

    const [filters, setFilters] = useState({
        status: "",
        type: typeParam,
        payment_method: "",
    });

    /*
    |--------------------------------------------------------------------------
    | Sync filters with URL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            type: typeParam,
        }));
    }, [typeParam]);

    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    */

    const {
        data,
        isLoading,
    } = usePayments(filters);

    /*
    |--------------------------------------------------------------------------
    | Filter Change
    |--------------------------------------------------------------------------
    */

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | View Payment
    |--------------------------------------------------------------------------
    */

    const handleView = (payment) => {

        if (!payment?.slug) {
            console.error("Payment slug not found:", payment);
            return;
        }

        navigate(`/payments/${payment.slug}`);
    };

    /*
    |--------------------------------------------------------------------------
    | Columns
    |--------------------------------------------------------------------------
    */

    const columns = PaymentColumns({
        onView: handleView,
    });

    /*
    |--------------------------------------------------------------------------
    | Page Title
    |--------------------------------------------------------------------------
    */

    const pageTitle =
        SUBMENU_TITLES[typeParam] ?? "Payments";

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-4">

            {/* PAGE HEADER */}

            <div className="flex items-center justify-between">

                <h1 className="text-xl font-semibold">
                    {pageTitle}
                </h1>

            </div>


            {/* FILTERS */}

            <div className="flex flex-wrap gap-3">

                {/* STATUS */}

                <select
                    className="form-input w-40"
                    value={filters.status}
                    onChange={(e) =>
                        handleFilterChange(
                            "status",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Statuses
                    </option>

                    <option value="pending">
                        Pending
                    </option>

                    <option value="paid">
                        Paid
                    </option>

                    <option value="failed">
                        Failed
                    </option>

                    <option value="refunded">
                        Refunded
                    </option>
                </select>


                {/* TYPE */}

                <select
                    className="form-input w-40"
                    value={filters.type}
                    onChange={(e) =>
                        handleFilterChange(
                            "type",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Types
                    </option>

                    <option value="advance">
                        Advance
                    </option>

                    <option value="deposit">
                        Deposit
                    </option>

                    <option value="final">
                        Final
                    </option>

                    <option value="partial">
                        Partial
                    </option>

                    <option value="refund">
                        Refund
                    </option>
                </select>


                {/* PAYMENT METHOD */}

                <select
                    className="form-input w-40"
                    value={filters.payment_method}
                    onChange={(e) =>
                        handleFilterChange(
                            "payment_method",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        All Methods
                    </option>

                    <option value="cash">
                        Cash
                    </option>

                    <option value="card">
                        Card
                    </option>

                    <option value="bank_transfer">
                        Bank Transfer
                    </option>

                    <option value="esewa">
                        eSewa
                    </option>

                    <option value="khalti">
                        Khalti
                    </option>
                </select>

            </div>


            {/* PAYMENT TABLE */}

            <PaymentTable
                data={data?.data ?? data ?? []}
                columns={columns}
                isLoading={isLoading}
            />

        </div>
    );
};

export default PaymentListPage;