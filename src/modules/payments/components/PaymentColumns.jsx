import {
  PaymentStatusBadge,
  PaymentTypeBadge,
} from "./PaymentStatusBadge";

import { Eye, FileText } from "lucide-react";

export const PaymentColumns = ({ onView } = {}) => [
    {
      accessorKey: "transaction_reference",
      header: "Reference",
      cell: ({ row }) => (
        <span className="text-xs font-medium">
          {row.original.transaction_reference || "—"}
        </span>
      ),
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs">
          <PaymentTypeBadge type={row.original.type} />
        </span>
      ),
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-xs">
          NPR {Number(row.original.amount).toLocaleString()}
        </span>
      ),
    },

    {
      accessorKey: "payment_method",
      header: "Method",
      cell: ({ row }) => (
        <span className="text-xs capitalize">
          {row.original.payment_method.replace("_", " ")}
        </span>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="text-xs">
          <PaymentStatusBadge
            status={row.original.status}
          />
        </span>
      ),
    },

    {
      accessorKey: "received_by",
      header: "Received By",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.received_by?.name ?? "—"}
        </span>
      ),
    },

    {
      accessorKey: "paid_at",
      header: "Paid At",
      cell: ({ row }) => (
        <span className="text-xs whitespace-nowrap">
          {row.original.paid_at
            ? new Date(
                row.original.paid_at
              ).toLocaleString()
            : "—"}
        </span>
      ),
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) =>
          onView ? (
              <div className="flex items-center gap-2">

                  {/* View */}
                  <button
                      type="button"
                      onClick={() => onView(row.original)}
                      className="inline-flex cursor-pointer h-7 w-7 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                      title="View Payment"
                  >
                      <Eye className="h-4 w-4" />
                  </button>

                  {/* Receipt */}
                  <button
                      type="button"
                      onClick={() => {
                          if (row.original?.slug) {
                              window.location.href =
                                  `/payments/${row.original.slug}/receipt`;
                          }
                      }}
                      className="inline-flex cursor-pointer h-7 w-7 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                      title="Payment Receipt"
                  >
                      <FileText className="h-4 w-4" />
                  </button>

              </div>
          ) : null,
  },
];