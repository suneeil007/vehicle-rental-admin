import {
    getBookings,
    getBooking,
    createBooking,
    approveBooking,
    rejectBooking,
    cancelBooking,
    createTripFromBooking,
    restoreBooking,
    updateBooking,
    deleteBooking,
} from "../api/bookingApi";

export const fetchBookings = async () => {
    const response = await getBookings();
    return response.data.data;
};

export const fetchBooking = async (booking) => {
    const response = await getBooking(booking);
    return response.data.data;
};

export const addBooking = async (payload) => {
    const response = await createBooking(payload);
    return response.data.data;
};

export const approveBookingAction = async (booking) => {
    const response = await approveBooking(booking);
    return response.data.data;
};

export const rejectBookingAction = async (booking) => {
    const response = await rejectBooking(booking);
    return response.data.data;
};

export const cancelBookingAction = async (booking) => {
    const response = await cancelBooking(booking);
    return response.data.data;
};

export const createTripAction = async (booking) => {
    const response = await createTripFromBooking(booking);
    return response.data.data;
};

export const restoreBookingAction = async (booking) => {
    const response = await restoreBooking(booking);
    return response.data.data;
};

export const editBooking = async ({ booking, ...payload }) => {
    const response = await updateBooking({ booking, ...payload });
    return response.data.data;
};

export const removeBooking = async (booking) => {
    const response = await deleteBooking(booking);
    return response.data;
};