import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { branchSchema } from "../validation/branchSchema";

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

const BranchForm = ({ defaultValues, onSubmit, onCancel, isLoading = false }) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(branchSchema),
        defaultValues: {
            name: "",
            code: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            country: "",
            postal_code: "",
            latitude: "",
            longitude: "",
            opening_time: "",
            closing_time: "",
            manager_name: "",
            manager_phone: "",
            status: "active",
        },
    });

    const status = watch("status");

    useEffect(() => {
        if (!defaultValues) return;

        const formatTimeForInput = (value) => {
            if (!value) return "";
            const date = new Date(value);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().slice(11, 16); // "HH:MM"
        };

        reset({
            name: defaultValues.name ?? "",
            code: defaultValues.code ?? "",
            phone: defaultValues.phone ?? "",
            email: defaultValues.email ?? "",
            address: defaultValues.address ?? "",
            city: defaultValues.city ?? "",
            state: defaultValues.state ?? "",
            country: defaultValues.country ?? "",
            postal_code: defaultValues.postal_code ?? "",
            latitude: defaultValues.latitude ?? "",
            longitude: defaultValues.longitude ?? "",
            opening_time: formatTimeForInput(defaultValues.opening_time),
            closing_time: formatTimeForInput(defaultValues.closing_time),
            manager_name: defaultValues.manager_name ?? "",
            manager_phone: defaultValues.manager_phone ?? "",
            status: defaultValues.status ?? "active",
        });
    }, [defaultValues, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>
                    <label className="form-label">Branch Name</label>
                    <input {...register("name")} className="form-input" />
                    <p className="error-text">{errors.name?.message}</p>
                </div>

                <div>
                    <label className="form-label">Branch Code</label>
                    <input {...register("code")} className="form-input" />
                    <p className="error-text">{errors.code?.message}</p>
                </div>

                <div>
                    <label className="form-label">Phone</label>
                    <input {...register("phone")} className="form-input" />
                    <p className="error-text">{errors.phone?.message}</p>
                </div>

                <div>
                    <label className="form-label">Email</label>
                    <input {...register("email")} className="form-input" />
                    <p className="error-text">{errors.email?.message}</p>
                </div>

                <div className="md:col-span-2">
                    <label className="form-label">Address</label>
                    <input {...register("address")} className="form-input" />
                    <p className="error-text">{errors.address?.message}</p>
                </div>

                <div>
                    <label className="form-label">City</label>
                    <input {...register("city")} className="form-input" />
                    <p className="error-text">{errors.city?.message}</p>
                </div>

                <div>
                    <label className="form-label">State</label>
                    <input {...register("state")} className="form-input" />
                    <p className="error-text">{errors.state?.message}</p>
                </div>

                <div>
                    <label className="form-label">Country</label>
                    <input {...register("country")} className="form-input" />
                    <p className="error-text">{errors.country?.message}</p>
                </div>

                <div>
                    <label className="form-label">Postal Code</label>
                    <input {...register("postal_code")} className="form-input" />
                    <p className="error-text">{errors.postal_code?.message}</p>
                </div>

                <div>
                    <label className="form-label">Latitude</label>
                    <input {...register("latitude")} type="number" step="any" className="form-input" />
                    <p className="error-text">{errors.latitude?.message}</p>
                </div>

                <div>
                    <label className="form-label">Longitude</label>
                    <input {...register("longitude")} type="number" step="any" className="form-input" />
                    <p className="error-text">{errors.longitude?.message}</p>
                </div>

                <div>
                    <label className="form-label">Opening Time</label>
                    <input {...register("opening_time")} type="time" className="form-input" />
                    <p className="error-text">{errors.opening_time?.message}</p>
                </div>

                <div>
                    <label className="form-label">Closing Time</label>
                    <input {...register("closing_time")} type="time" className="form-input" />
                    <p className="error-text">{errors.closing_time?.message}</p>
                </div>

                <div>
                    <label className="form-label">Manager Name</label>
                    <input {...register("manager_name")} className="form-input" />
                    <p className="error-text">{errors.manager_name?.message}</p>
                </div>

                <div>
                    <label className="form-label">Manager Phone</label>
                    <input {...register("manager_phone")} className="form-input" />
                    <p className="error-text">{errors.manager_phone?.message}</p>
                </div>

                <div>
                    <label className="form-label">Status</label>
                    <Select
                        key={`status-${defaultValues?.slug ?? "new"}-${status}`}
                        value={status}
                        onValueChange={(value) =>
                            setValue("status", value, { shouldValidate: true, shouldDirty: true })
                        }
                    >
                        <SelectTrigger className="w-full h-11 rounded-lg border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="error-text">{errors.status?.message}</p>
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-5 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-lg border hover:bg-gray-50 cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 cursor-pointer text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting || isLoading
                        ? "Saving..."
                        : defaultValues
                        ? "Update Branch"
                        : "Create Branch"}
                </button>
            </div>
        </form>
    );
};

export default BranchForm;