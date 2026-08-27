import { Eye, FileText } from "lucide-react";

export const PaymentColumns = ({
    onView,
    onReceipt,
    showActions = false,
} = {}) => {

    const columns = [

        /*
        |--------------------------------------------------------------------------
        | Reference
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "transaction_reference",
            header: "Reference",

            cell: ({ row }) => (
                <span className="text-xs font-medium">
                    {row.original.transaction_reference ?? "—"}
                </span>
            ),
        },


        /*
        |--------------------------------------------------------------------------
        | Customer
        |--------------------------------------------------------------------------
        */

        {
            id: "customer",
            header: "Customer",

            cell: ({ row }) => {

                const payment = row.original;

                const customer =
                    payment?.customer ??
                    payment?.booking?.customer ??
                    payment?.trip?.customer ??
                    null;

                return (
                    <div className="flex flex-col">
                        <span className="text-xs font-medium">
                            {customer?.name ?? "—"}
                        </span>

                        {customer?.phone && (
                            <span className="text-[11px] text-gray-500">
                                {customer.phone}
                            </span>
                        )}
                    </div>
                );
            },
        },


        /*
        |--------------------------------------------------------------------------
        | Type
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "type",
            header: "Type",

            cell: ({ row }) => (
                <span className="text-xs capitalize">
                    {row.original.type
                        ? row.original.type.replace(/_/g, " ")
                        : "—"}
                </span>
            ),
        },


        /*
        |--------------------------------------------------------------------------
        | Amount
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "amount",
            header: "Amount",

            cell: ({ row }) => {

                const amount =
                    Number(row.original.amount ?? 0);

                return (
                    <span className="text-xs font-medium">
                        NPR {amount.toLocaleString()}
                    </span>
                );
            },
        },


        /*
        |--------------------------------------------------------------------------
        | Method
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "payment_method",
            header: "Method",

            cell: ({ row }) => (
                <span className="text-xs capitalize">
                    {row.original.payment_method
                        ? row.original.payment_method.replace(/_/g, " ")
                        : "—"}
                </span>
            ),
        },


        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "status",
            header: "Status",

            cell: ({ row }) => (
                <span
                    className={`text-xs font-medium capitalize ${
                        row.original.status === "paid"
                            ? "text-green-600"
                            : row.original.status === "failed"
                            ? "text-red-600"
                            : "text-muted-foreground"
                    }`}
                >
                    {row.original.status ?? "—"}
                </span>
            ),
        },


        /*
        |--------------------------------------------------------------------------
        | Received By
        |--------------------------------------------------------------------------
        */

        {
            id: "received_by",
            header: "Received By",

            cell: ({ row }) => (
                <span className="text-xs">
                    {row.original.received_by?.name ??
                        row.original.receivedBy?.name ??
                        "—"}
                </span>
            ),
        },


        /*
        |--------------------------------------------------------------------------
        | Paid At
        |--------------------------------------------------------------------------
        */

        {
            accessorKey: "paid_at",
            header: "Paid At",

            cell: ({ row }) => {

                const date =
                    row.original.paid_at;

                return (
                    <span className="text-xs">
                        {date
                            ? new Date(date).toLocaleString()
                            : "—"}
                    </span>
                );
            },
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    if (showActions) {

        columns.push({

            id: "actions",

            header: "Action",

            enableSorting: false,
            enableHiding: false,

            cell: ({ row }) => {

                const payment =
                    row.original;

                return (
                    <div className="flex items-center gap-2">

                        {/* VIEW PAYMENT */}

                        {onView &&
                            payment?.slug && (
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onView(payment);
                                    }}
                                    title="View Payment"
                                    className="
                                        inline-flex
                                        h-7
                                        w-7
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-md
                                        text-blue-600
                                        hover:bg-blue-50
                                        hover:text-blue-800
                                    "
                                >
                                    <Eye className="h-4 w-4" />
                                </button>
                            )}


                        {/* PAYMENT RECEIPT */}

                        {onReceipt &&
                            payment?.slug && (
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onReceipt(payment);
                                    }}
                                    title="Payment Receipt"
                                    className="
                                        inline-flex
                                        h-7
                                        w-7
                                        cursor-pointer
                                        items-center
                                        justify-center
                                        rounded-md
                                        text-green-600
                                        hover:bg-green-50
                                        hover:text-green-800
                                    "
                                >
                                    <FileText className="h-4 w-4" />
                                </button>
                            )}

                    </div>
                );
            },
        });
    }


    return columns;
};

export default PaymentColumns;