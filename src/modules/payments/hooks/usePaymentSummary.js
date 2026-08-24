import { usePaymentsByBooking } from "./usePaymentsByBooking";

/**
 * Computes a payment summary for a booking:
 *  - totalPayable: authoritative total the customer owes
 *  - totalPaid: sum of all successful (status="paid") payments, minus refunds
 *  - due: totalPayable - totalPaid
 *
 * Source of truth for totalPayable:
 *  - If an invoice exists (trip completed), use invoice.total_amount / invoice.due_amount
 *    directly since the backend already calculates these authoritatively (this total
 *    includes extra_km_charge, late_return_charge, damage_charge, fuel_charge etc.
 *    on top of the booking's quoted amount, so it can be higher than final_amount).
 *  - Otherwise (pre-trip-completion), use booking.final_amount (quoted_amount minus
 *    discount_amount, confirmed from the Booking model/response).
 */
export const usePaymentSummary = ({ booking, invoice = null }) => {
  const { data, isLoading } = usePaymentsByBooking(booking?.slug);

  const payments = data?.data ?? data ?? [];

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => {
      const amount = Number(p.amount);
      return p.type === "refund" ? sum - amount : sum + amount;
    }, 0);

  let totalPayable = 0;
  let due = 0;

  if (invoice) {
    // Post-trip: Invoice is authoritative
    totalPayable = Number(invoice.total_amount);
    due = Number(invoice.due_amount);
  } else {
    // Pre-trip: booking.final_amount is the confirmed payable amount
    // (quoted_amount - discount_amount, calculated server-side)
    totalPayable = Number(booking?.final_amount ?? 0);
    due = Math.max(totalPayable - totalPaid, 0);
  }

  return {
    isLoading,
    payments,
    totalPayable,
    totalPaid,
    due,
  };
};