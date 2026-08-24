import { Eye, FileText } from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

export const InvoiceColumns = ({
    onView,
    onReceipt,
} = {}) => [

    {
        accessorKey: "invoice_number",
        header: "Invoice #",
        cell: ({ row }) => (
            <span className="text-xs font-medium">
                {row.original.invoice_number}
            </span>
        ),
    },

    {
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <span className="text-xs">
                {row.original.customer?.name ?? "—"}
            </span>
        ),
    },

    {
        accessorKey: "total_amount",
        header: "Total",
        cell: ({ row }) => (
            <span className="text-xs">
                NPR{" "}
                {Number(
                    row.original.total_amount ?? 0
                ).toLocaleString()}
            </span>
        ),
    },

    {
        accessorKey: "paid_amount",
        header: "Paid",
        cell: ({ row }) => (
            <span className="text-xs text-green-700">
                NPR{" "}
                {Number(
                    row.original.paid_amount ?? 0
                ).toLocaleString()}
            </span>
        ),
    },

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
                    className={`text-xs ${
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

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <InvoiceStatusBadge
                status={row.original.status}
            />
        ),
    },

    {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => (
            <span className="text-xs">
                {row.original.due_date
                    ? new Date(
                        row.original.due_date
                    ).toLocaleDateString()
                    : "—"}
            </span>
        ),
    },

    {
        id: "actions",
        header: "Action",

        cell: ({ row }) => {

            const invoice = row.original;

            /*
            |--------------------------------------------------------------------------
            | Find paid payment
            |--------------------------------------------------------------------------
            */

            const paidPayment =
                invoice.payments?.find(
                    (payment) =>
                        payment.status === "paid"
                );

            return (
                <div className="flex items-center gap-2">

                    {/* VIEW INVOICE */}

                    {onView && (
                        <button
                            type="button"
                            onClick={() =>
                                onView(invoice)
                            }
                            title="View Invoice"
                            className="text-slate-500 hover:text-blue-600"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    )}

                    {/* PAYMENT RECEIPT */}

                    {onReceipt &&
                        paidPayment?.slug && (
                            <button
                                type="button"
                                onClick={() =>
                                    onReceipt(
                                        paidPayment
                                    )
                                }
                                title="Payment Receipt"
                                className="text-slate-500 hover:text-green-600"
                            >
                                <FileText className="h-4 w-4" />
                            </button>
                        )}

                </div>
            );
        },
    },
];