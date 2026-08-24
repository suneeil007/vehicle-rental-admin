import {
  fetchPayments,
  fetchPaymentBySlug,
  createPayment,
} from "../api/paymentApi";

export const getPayments = async (params) => {
  const res = await fetchPayments(params);
  return res.data.data;
};

export const getPaymentBySlug = async (slug) => {
  const res = await fetchPaymentBySlug(slug);
  return res.data.data;
};

export const recordPayment = async (payload) => {
  const res = await createPayment(payload);
  return res.data.data;
};