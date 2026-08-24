import { usePaymentSummary } from "../hooks/usePaymentSummary";

/**
 * Displays Total Payable / Paid / Due for a booking (and its trip's invoice,
 * once generated). Embed on BookingDetailPage and TripDetailPage.
 *
 * Usage:
 *   <PaymentSummaryCard booking={booking} invoice={invoice} />
 *   // invoice is optional — pass it once available (post trip completion)
 */
export const PaymentSummaryCard = ({ booking, invoice = null }) => {
  const { isLoading, totalPayable, totalPaid, due } = usePaymentSummary({
    booking,
    invoice,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        Loading payment summary...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
      <div>
        <p className="text-xs text-muted-foreground">Total Payable</p>
        <p className="text-lg font-semibold">
          NPR {totalPayable.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Paid</p>
        <p className="text-lg font-semibold text-green-700">
          NPR {totalPaid.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Due</p>
        <p
          className={`text-lg font-semibold ${
            due > 0 ? "text-red-600" : "text-green-700"
          }`}
        >
          NPR {due.toLocaleString()}
        </p>
      </div>
    </div>
  );
};