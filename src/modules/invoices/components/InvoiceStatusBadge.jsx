const STATUS_STYLES = {
  issued: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  partially_paid: "bg-yellow-100 text-yellow-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-slate-200 text-slate-700",
};

export const InvoiceStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-800"
    }`}
  >
    {status?.replace("_", " ")}
  </span>
);