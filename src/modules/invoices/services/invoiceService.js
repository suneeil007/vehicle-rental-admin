import { fetchInvoices, fetchInvoiceBySlug } from "../api/invoiceApi";

export const getInvoices = async (params) => {
  const res = await fetchInvoices(params);
  return res.data.data;
};

export const getInvoiceBySlug = async (slug) => {
  const res = await fetchInvoiceBySlug(slug);
  return res.data.data;
};