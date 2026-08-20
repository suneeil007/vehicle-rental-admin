import api from "@/app/services/api";

export const getTrips = (params) => api.get("/trips", { params });

export const getMyTrips = (params) => api.get("/trips/me", { params });

export const getTrip = (trip) => api.get(`/trips/${trip}`);

export const createTrip = (payload) => api.post("/trips", payload);

export const updateTrip = ({ trip, ...payload }) =>
    api.put(`/trips/${trip}`, payload);

export const pickupTrip = (trip) => api.post(`/trips/${trip}/pickup`);

export const startTrip = (trip) => api.post(`/trips/${trip}/start`);

export const completeTrip = ({ trip, ...payload }) =>
    api.post(`/trips/${trip}/complete`, payload);

export const cancelTrip = ({ trip, reason }) =>
    api.post(`/trips/${trip}/cancel`, { reason });

export const generateInvoice = (trip) =>
    api.post(`/trips/${trip}/generate-invoice`);
