import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/ImageUpload";

import { vehicleCategorySchema } from "../validation/vehicleCategorySchema";

const VehicleCategoryForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(vehicleCategorySchema(Boolean(defaultValues))),
        defaultValues: {
            name: "",
            description: "",
            status: true,
        },
    });

    const status = watch("status");

    useEffect(() => {
        if (!defaultValues) return;

        reset({
            name: defaultValues.name ?? "",
            description: defaultValues.description ?? "",
            status: Boolean(defaultValues.status),
        });

        setImageFile(null);
        setImageError("");
    }, [defaultValues, reset]);

    const submitHandler = (data) => {
        onSubmit({ ...data, image: imageFile });
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
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6
            ">
            <div className="grid grid-cols-1 gap-5">

                {/* Name */}
                <div>
                    <label className="form-label">Category Name</label>
                    <input
                        {...register("name")}
                        className="form-input"
                        placeholder="Enter category name"
                    />
                    <p className="error-text">{errors.name?.message}</p>
                </div>

                {/* Description */}
                <div>
                    <label className="form-label">Description</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Enter description"
                    />
                    <p className="error-text">{errors.description?.message}</p>
                </div>

                {/* Image */}
                <ImageUpload
                    label="Category Image"
                    value={imageFile}
                    onChange={(file) => {
                        setImageFile(file);
                        setImageError("");
                    }}
                    existingImageUrl={defaultValues?.image ?? null}
                    helperText={
                        defaultValues
                            ? "Leave empty to keep the current image."
                            : undefined
                    }
                    error={imageError}
                />

                {/* Status */}
                <div>
                    <label className="form-label">Status</label>
                    <Select
                        value={status ? "true" : "false"}
                        onValueChange={(value) =>
                            setValue("status", value === "true", {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                        }
                    >
                        <SelectTrigger className="h-11 rounded-lg border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
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
                    className="px-5 py-2.5 rounded-lg cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting || isLoading
                        ? "Saving..."
                        : defaultValues
                        ? "Update Category"
                        : "Create Category"}
                </button>
            </div>

        </form>
    );
};

export default VehicleCategoryForm;