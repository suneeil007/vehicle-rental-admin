import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    paymentSchema,
    PAYMENT_TYPES,
    PAYMENT_METHODS,
} from "../validation/paymentSchema";

import { useCreatePayment } from "../hooks/useCreatePayment";

/**
 * RecordPaymentDialog
 *
 * Supports:
 *
 * 1. Booking payment
 *    booking_id = booking ID
 *    trip_id    = optional trip ID
 *
 * 2. Standalone trip payment
 *    booking_id = null
 *    trip_id    = trip ID
 */
export const RecordPaymentDialog = ({
    open,
    onClose,
    bookingId,
    tripId = null,
    defaultType = "advance",
}) => {
    const {
        mutate: createPayment,
        isPending,
    } = useCreatePayment();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(paymentSchema),

        defaultValues: {
            booking_id: bookingId ?? null,
            trip_id: tripId ?? null,
            type: defaultType,
            payment_method: "cash",
            amount: undefined,
            transaction_reference: "",
            notes: "",
        },
    });

    const paymentMethod = watch("payment_method");

    useEffect(() => {
        if (open) {
            reset({
                booking_id: bookingId ?? null,
                trip_id: tripId ?? null,
                type: defaultType,
                payment_method: "cash",
                amount: undefined,
                transaction_reference: "",
                notes: "",
            });
        }
    }, [
        open,
        bookingId,
        tripId,
        defaultType,
        reset,
    ]);

    if (!open) return null;

    const onSubmit = (values) => {
        const payload = {
            ...values,

            booking_id: values.booking_id ?? null,
            trip_id: values.trip_id ?? null,

            amount: Number(values.amount),
        };

        createPayment(payload, {
            onSuccess: () => {
                toast.success("Payment recorded successfully");
                onClose();
            },

            onError: (err) => {
                toast.error(
                    err?.response?.data?.message ||
                        "Failed to record payment"
                );
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">

                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
                >
                    ×
                </button>

                <h2 className="mb-4 pr-10 text-lg font-semibold">
                    Record Payment
                </h2>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Amount */}
                    <div>
                        <label className="form-label">
                            Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            {...register("amount", {
                                valueAsNumber: true,
                            })}
                        />

                        {errors.amount && (
                            <p className="error-text">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="form-label">
                            Type
                        </label>

                        <select
                            className="form-input"
                            {...register("type")}
                        >
                            {PAYMENT_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t.charAt(0).toUpperCase() +
                                        t.slice(1)}
                                </option>
                            ))}
                        </select>

                        {errors.type && (
                            <p className="error-text">
                                {errors.type.message}
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="form-label">
                            Payment Method
                        </label>

                        <select
                            className="form-input"
                            {...register("payment_method")}
                        >
                            {PAYMENT_METHODS.map((m) => (
                                <option key={m} value={m}>
                                    {m
                                        .replace("_", " ")
                                        .replace(/^\w/, (c) =>
                                            c.toUpperCase()
                                        )}
                                </option>
                            ))}
                        </select>

                        {errors.payment_method && (
                            <p className="error-text">
                                {errors.payment_method.message}
                            </p>
                        )}
                    </div>

                    {/* Transaction Reference */}
                    {paymentMethod !== "cash" && (
                        <div>
                            <label className="form-label">
                                Transaction Reference
                            </label>

                            <input
                                type="text"
                                className="form-input"
                                placeholder="Transaction / slip number"
                                {...register(
                                    "transaction_reference"
                                )}
                            />

                            {errors.transaction_reference && (
                                <p className="error-text">
                                    {
                                        errors
                                            .transaction_reference
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="form-label">
                            Notes (optional)
                        </label>

                        <textarea
                            className="form-input"
                            rows={2}
                            {...register("notes")}
                        />
                    </div>

                    {errors.trip_id && (
                        <p className="error-text">
                            {errors.trip_id.message}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-md border px-4 py-2 text-sm"
                            disabled={isPending}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Recording..."
                                : "Record Payment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};