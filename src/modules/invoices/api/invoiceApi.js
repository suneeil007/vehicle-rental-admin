import api from "@/app/services/api";

/**
 * Fetch paginated list of invoices.
 * Supports query params: status, search, trip_slug, page, per_page, etc.
 */
export const fetchInvoices = (params = {}) => {
  return api.get("/invoices", { params });
};

/**
 * Fetch a single invoice by slug.
 */
export const fetchInvoiceBySlug = (slug) => {
  return api.get(`/invoices/${slug}`);
};