import api from "@/app/services/api";

/**
 * Fetch paginated list of payments.
 * Supports query params for filtering: booking_slug, trip_slug, status, type, payment_method, search, page, etc.
 */
export const fetchPayments = (params = {}) => {
  return api.get("/payments", { params });
};

/**
 * Fetch a single payment by slug.
 */
export const fetchPaymentBySlug = (slug) => {
  return api.get(`/payments/${slug}`);
};

/**
 * Record a new payment.
 * payload: { booking_id, trip_id?, amount, type, payment_method, transaction_reference?, notes?, paid_at? }
 */
export const createPayment = (payload) => {
  return api.post("/payments", payload);
};