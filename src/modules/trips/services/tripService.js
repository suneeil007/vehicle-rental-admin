import {
    getTrips,
    getMyTrips,
    getTrip,
    createTrip,
    updateTrip,
    pickupTrip,
    startTrip,
    completeTrip,
    cancelTrip,
    generateInvoice,
} from "../api/tripApi";

export const fetchTrips = async (params) => {
    const res = await getTrips(params);
    return res.data.data;
};

export const fetchMyTrips = async (params) => {
    const res = await getMyTrips(params);
    return res.data.data;
};

export const fetchTrip = async (trip) => {
    const res = await getTrip(trip);
    return res.data.data;
};

export const submitCreateTrip = async (payload) => {
    const res = await createTrip(payload);
    return res.data.data;
};

export const submitUpdateTrip = async (payload) => {
    const res = await updateTrip(payload);
    return res.data.data;
};

export const submitPickupTrip = async (trip) => {
    const res = await pickupTrip(trip);
    return res.data.data;
};

export const submitStartTrip = async (trip) => {
    const res = await startTrip(trip);
    return res.data.data;
};

export const submitCompleteTrip = async (payload) => {
    const res = await completeTrip(payload);
    return res.data.data;
};

export const submitCancelTrip = async (payload) => {
    const res = await cancelTrip(payload);
    return res.data.data;
};

export const submitGenerateInvoice = async (trip) => {
    const res = await generateInvoice(trip);
    return res.data.data;
};
