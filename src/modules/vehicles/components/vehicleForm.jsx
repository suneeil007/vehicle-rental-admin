import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Check, ChevronsUpDown } from "lucide-react";

import MultiImageUpload from "@/components/ui/MultiImageUpload";

import { vehicleSchema } from "../validation/vehicleSchema";
import useVehicleCategories from "../../vehicleCategories/hooks/useVehicleCategories";
import useSetFeaturedImage from "../hooks/useSetFeaturedImage";

// Adjust the import paths above to match your actual folder structure.

const TRANSMISSION_OPTIONS = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
];

const FUEL_TYPE_OPTIONS = [
    { value: "petrol", label: "Petrol" },
    { value: "diesel", label: "Diesel" },
    { value: "electric", label: "Electric" },
    { value: "hybrid", label: "Hybrid" },
];

const STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "booked", label: "Booked" },
    { value: "maintenance", label: "Maintenance" },
    { value: "inactive", label: "Inactive" },
];


const VehicleForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {

    // console.log("EDIT VEHICLE DATA:", defaultValues)
    const { data: categories } = useVehicleCategories();

    const setFeaturedMutation = useSetFeaturedImage();

    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [removedImageIds, setRemovedImageIds] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(vehicleSchema(Boolean(defaultValues))),
        defaultValues: {
            vehicle_category_id: "",
            name: "",
            brand: "",
            model: "",
            manufacture_year: "",
            transmission: "",
            fuel_type: "",
            seat_capacity: "",
            price_per_day: "",
            registration_number: "",
            mileage: "",
            color: "",
            description: "",
            status: "available",
        },
    });

    const transmission = watch("transmission");
    const fuelType = watch("fuel_type");
    const status = watch("status");
    const categoryId = watch("vehicle_category_id");


    useEffect(() => {
        if (!defaultValues) return;

        const transmissionValue =
            defaultValues.transmission
                ? String(defaultValues.transmission).toLowerCase()
                : "";

        const fuelTypeValue =
            defaultValues.fuel_type
                ? String(defaultValues.fuel_type).toLowerCase()
                : "";

        const statusValue =
            defaultValues.status
                ? String(defaultValues.status).toLowerCase()
                : "available";

        reset({
            vehicle_category_id: String(
                defaultValues.category?.id ?? ""
            ),

            name: defaultValues.name ?? "",
            brand: defaultValues.brand ?? "",
            model: defaultValues.model ?? "",

            manufacture_year: defaultValues.manufacture_year
                ? String(defaultValues.manufacture_year)
                : "",

            transmission: transmissionValue,
            fuel_type: fuelTypeValue,

            seat_capacity: defaultValues.seat_capacity ?? "",
            price_per_day: defaultValues.price_per_day ?? "",
            registration_number: defaultValues.registration_number ?? "",

            mileage: defaultValues.mileage
                ? String(defaultValues.mileage)
                : "",

            color: defaultValues.color ?? "",
            description: defaultValues.description ?? "",
            status: statusValue,
        });

        setNewImages([]);
        setRemovedImageIds([]);

        setExistingImages(
            (defaultValues.images ?? []).map((img) => ({
                id: img.id,
                url: img.image,
                is_featured: img.is_featured,
            }))
        );
    }, [defaultValues, reset]);


    const handleSetFeatured = (imageId) => {
        setFeaturedMutation.mutate(imageId, {
            onSuccess: () => {
                setExistingImages((prev) =>
                    prev.map((img) => ({
                        ...img,
                        is_featured: img.id === imageId,
                    }))
                );
            },
        });
    };


    const submitHandler = (data) => {
        onSubmit({
            ...data,
            images: newImages,
            removed_image_ids: removedImageIds,
        });
    };

    return (
        <form
            onSubmit={handleSubmit(
                (data) => submitHandler(data),
                (validationErrors) => {
                    console.log("VALIDATION ERRORS:", validationErrors);
                }
            )}
            className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


            {/* Category */}
            <div className="w-full">
                <label className="form-label">Category</label>

                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            role="combobox"
                            className="form-input w-full flex items-center justify-between text-left font-normal"
                        >
                            <span className="truncate">
                                {categoryId
                                    ? categories?.find(
                                        (cat) =>
                                            String(cat.id) === String(categoryId)
                                    )?.name
                                    : "Select category"}
                            </span>

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        className="w-[var(--radix-popover-trigger-width)] min-w-0 p-0"
                    >
                        <Command className="w-full">
                            <CommandInput
                                placeholder="Search category..."
                            />

                            <CommandList className="w-full">
                                <CommandEmpty>
                                    No category found.
                                </CommandEmpty>

                                <CommandGroup className="w-full">
                                    {categories?.map((cat) => (
                                        <CommandItem
                                            key={cat.id}
                                            value={cat.name}
                                            className="w-full"
                                            onSelect={() => {
                                                setValue(
                                                    "vehicle_category_id",
                                                    String(cat.id),
                                                    {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    }
                                                );
                                            }}
                                        >
                                            <Check
                                                className={`mr-2 h-4 w-0 ${
                                                    String(categoryId) ===
                                                    String(cat.id)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                            />

                                            <span className="truncate">
                                                {cat.name}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <p className="error-text">
                    {errors.vehicle_category_id?.message}
                </p>
            </div>



                {/* Name */}
                <div>
                    <label className="form-label">Vehicle Name</label>
                    <input
                        {...register("name")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.name?.message}</p>
                </div>

                {/* Brand */}
                <div>
                    <label className="form-label">Brand</label>
                    <input
                        {...register("brand")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.brand?.message}</p>
                </div>

                {/* Model */}
                <div>
                    <label className="form-label">Model</label>
                    <input
                        {...register("model")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.model?.message}</p>
                </div>

                {/* Manufacture Year */}
                <div>
                    <label className="form-label">Manufacture Year</label>
                    <input
                        {...register("manufacture_year")}
                        className="form-input"
                        placeholder=""
                        maxLength={4}
                    />
                    <p className="error-text">{errors.manufacture_year?.message}</p>
                </div>

                {/* Transmission */}
                    <div>
                        <label className="form-label">Transmission</label>

                        <Select
                            key={`transmission-${defaultValues?.id ?? "new"}-${transmission}`}
                            value={transmission || ""}
                            onValueChange={(value) =>
                                setValue("transmission", value, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                })
                            }
                        >
                            <SelectTrigger className="w-full h-11 rounded-lg border-gray-300">
                                <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>

                            <SelectContent>
                                {TRANSMISSION_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <p className="error-text">{errors.transmission?.message}</p>
                    </div>

                {/* Fuel Type */}
                <div>
                    <label className="form-label">Fuel Type</label>

                    <Select
                        key={`fuel-${defaultValues?.id ?? "new"}-${fuelType}`}
                        value={fuelType || ""}
                        onValueChange={(value) =>
                            setValue("fuel_type", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                    >
                        <SelectTrigger className="w-full h-11 rounded-lg border-gray-300">
                            <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>

                        <SelectContent>
                            {FUEL_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <p className="error-text">{errors.fuel_type?.message}</p>
                </div>

                {/* Seat Capacity */}
                <div>
                    <label className="form-label">Seat Capacity</label>
                    <input
                        type="number"
                        {...register("seat_capacity")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.seat_capacity?.message}</p>
                </div>

                {/* Price Per Day */}
                <div>
                    <label className="form-label">Price Per Day</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register("price_per_day")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.price_per_day?.message}</p>
                </div>

                {/* Registration Number */}
                <div>
                    <label className="form-label">Registration Number</label>
                    <input
                        {...register("registration_number")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.registration_number?.message}</p>
                </div>

                {/* Mileage */}
                <div>
                    <label className="form-label">Mileage (km)</label>
                    <input
                        type="number"
                        {...register("mileage")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.mileage?.message}</p>
                </div>

                {/* Color */}
                <div>
                    <label className="form-label">Color</label>
                    <input
                        {...register("color")}
                        className="form-input"
                        placeholder=""
                    />
                    <p className="error-text">{errors.color?.message}</p>
                </div>

                {/* Status */}
                <div>
                    <label className="form-label">Status</label>
                    <Select
                        key={`status-${defaultValues?.id ?? "new"}-${status}`}
                        value={status}
                        onValueChange={(value) =>
                            setValue("status", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
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

                {/* Description */}
                <div className="md:col-span-3">
                    <label className="form-label">Description</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Enter description"
                    />
                    <p className="error-text">{errors.description?.message}</p>
                </div>

                {/* Images */}
                <div className="md:col-span-3">
                    <MultiImageUpload
                        label="Vehicle Photos"
                        value={newImages}
                        onChange={setNewImages}
                        existingImages={existingImages}
                        onRemoveExisting={(id) => {
                            setExistingImages((prev) => prev.filter((img) => img.id !== id));
                            setRemovedImageIds((prev) => [...prev, id]);
                        }}
                        onSetFeatured={handleSetFeatured}
                        maxFiles={8}
                    />
                </div>

            </div>

            <div className="flex justify-end gap-3 pt-5 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 rounded-lg border hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting || isLoading
                        ? "Saving..."
                        : defaultValues
                        ? "Update Vehicle"
                        : "Create Vehicle"}
                </button>
            </div>

        </form>
    );
};

export default VehicleForm;