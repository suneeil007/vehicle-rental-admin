import { z } from "zod";

export const vehicleCategorySchema = (isEdit = false) =>
    z.object({
        name: z
            .string()
            .min(3, "Category name is required")
            .max(100, "Maximum 100 characters"),

        description: z
            .string()
            .optional(),

        status: z.boolean(),
    });