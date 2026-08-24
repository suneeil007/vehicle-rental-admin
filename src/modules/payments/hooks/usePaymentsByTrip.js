import { usePayments } from "./usePayments";

/**
 * Fetches all payments tied to a specific trip (typically the final settlement).
 * Used to render the payment history table on the Trip detail page.
 */
export const usePaymentsByTrip = (tripSlug) => {
  return usePayments(tripSlug ? { trip_slug: tripSlug } : undefined);
};