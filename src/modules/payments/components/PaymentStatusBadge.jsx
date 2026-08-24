const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-slate-200 text-slate-700",
};

const TYPE_STYLES = {
  advance: "bg-blue-100 text-blue-800",
  deposit: "bg-purple-100 text-purple-800",
  final: "bg-teal-100 text-teal-800",
  refund: "bg-orange-100 text-orange-800",
};

export const PaymentStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      STATUS_STYLES[status] || "bg-gray-100 text-gray-800"
    }`}
  >
    {status}
  </span>
);

export const PaymentTypeBadge = ({ type }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      TYPE_STYLES[type] || "bg-gray-100 text-gray-800"
    }`}
  >
    {type}
  </span>
);