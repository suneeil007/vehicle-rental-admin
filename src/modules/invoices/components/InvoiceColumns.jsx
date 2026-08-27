import { Eye, FileText } from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export const InvoiceColumns = ({
    onView,
    onReceipt,
} = {}) => [

    /*
    |--------------------------------------------------------------------------
    | Invoice Number
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "invoice_number",
        header: "Invoice #",

        cell: ({ row }) => (
            <span className="text-xs font-medium">
                {row.original.invoice_number ?? "—"}
            </span>
        ),
    },


    /*
    |--------------------------------------------------------------------------
    | Customer
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "customer",
        header: "Customer",

        cell: ({ row }) => {

            const customer =
                row.original.customer;

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
    | Rental Type
    |--------------------------------------------------------------------------
    */

    {
        id: "rental_type",
        header: "Rental Type",

        cell: ({ row }) => {

            const rentalType =
                row.original.trip?.rental_type;

            return (
                <span className="text-xs capitalize">
                    {rentalType
                        ? rentalType.replace(/_/g, " ")
                        : "—"}
                </span>
            );
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Invoice Date
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "invoice_date",
        header: "Invoice Date",

        cell: ({ row }) => {

            const date =
                row.original.invoice_date;

            return (
                <span className="text-xs">
                    {date
                        ? new Date(date).toLocaleDateString()
                        : "—"}
                </span>
            );
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "total_amount",
        header: "Total",

        cell: ({ row }) => {

            const total =
                Number(
                    row.original.total_amount ?? 0
                );

            return (
                <span className="text-xs font-medium">
                    NPR {total.toLocaleString()}
                </span>
            );
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Paid
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "paid_amount",
        header: "Paid",

        cell: ({ row }) => {

            const paid =
                Number(
                    row.original.paid_amount ?? 0
                );

            return (
                <span className="text-xs text-green-700">
                    NPR {paid.toLocaleString()}
                </span>
            );
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Due
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "due_amount",
        header: "Due",

        cell: ({ row }) => {

            const due =
                Number(
                    row.original.due_amount ?? 0
                );

            return (
                <span
                    className={`text-xs font-medium ${
                        due > 0
                            ? "text-red-600"
                            : "text-green-700"
                    }`}
                >
                    NPR {due.toLocaleString()}
                </span>
            );
        },
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
            <InvoiceStatusBadge
                status={row.original.status}
            />
        ),
    },


    /*
    |--------------------------------------------------------------------------
    | Due Date
    |--------------------------------------------------------------------------
    */

    {
        accessorKey: "due_date",
        header: "Due Date",

        cell: ({ row }) => {

            const date =
                row.original.due_date;

            return (
                <span className="text-xs">
                    {date
                        ? new Date(date).toLocaleDateString()
                        : "—"}
                </span>
            );
        },
    },


    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    {
        id: "actions",
        header: "Action",

        enableSorting: false,
        enableHiding: false,

        cell: ({ row }) => {

            const invoice =
                row.original;

            /*
            |--------------------------------------------------------------------------
            | Payments
            |--------------------------------------------------------------------------
            |
            | Invoice payments should normally come from:
            |
            | invoice.payments
            |
            */

            const payments =
                Array.isArray(invoice.payments)
                    ? invoice.payments
                    : [];


            /*
            |--------------------------------------------------------------------------
            | Find paid payment
            |--------------------------------------------------------------------------
            */

            const paidPayment =
                payments.find(
                    (payment) =>
                        String(payment.status).toLowerCase() ===
                        "paid"
                );


            return (
                <div className="flex items-center gap-2">

                    {/* ---------------------------------------------------------- */}
                    {/* VIEW INVOICE */}
                    {/* ---------------------------------------------------------- */}

                    {onView && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onView(invoice);
                            }}
                            title="View Invoice"
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    )}


                    {/* ---------------------------------------------------------- */}
                    {/* PAYMENT RECEIPT */}
                    {/* ---------------------------------------------------------- */}

                    {onReceipt &&
                        paidPayment && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onReceipt(paidPayment);
                                }}
                                title="Payment Receipt"
                                className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-green-600 hover:bg-green-50 hover:text-green-800"
                            >
                                <FileText className="h-4 w-4" />
                            </button>
                        )}

                </div>
            );
        },
    },
];