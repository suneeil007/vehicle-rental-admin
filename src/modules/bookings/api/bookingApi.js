import api from "@/app/services/api";

export const getBookings = () => api.get("/bookings");

export const getBooking = (booking) => api.get(`/bookings/${booking}`);

export const createBooking = (payload) => api.post("/bookings", payload);

export const approveBooking = (booking) => api.post(`/bookings/${booking}/approve`);

export const rejectBooking = (booking) => api.post(`/bookings/${booking}/reject`);

export const cancelBooking = (booking) => api.post(`/bookings/${booking}/cancel`);

export const createTripFromBooking = (booking) =>
    api.post(`/bookings/${booking}/create-trip`);

export const restoreBooking = (booking) => api.post(`/bookings/${booking}/restore`);

export const updateBooking = ({ booking, ...payload }) =>
    api.put(`/bookings/${booking}`, payload);

export const deleteBooking = (booking) => api.delete(`/bookings/${booking}`);