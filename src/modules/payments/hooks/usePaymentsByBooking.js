import { usePayments } from "./usePayments";

/**
 * Fetches all payments tied to a specific booking (advance/deposit/final/refund).
 * Used to render the payment history table on the Booking detail page.
 */
export const usePaymentsByBooking = (bookingSlug) => {
  return usePayments(bookingSlug ? { booking_slug: bookingSlug } : undefined);
};