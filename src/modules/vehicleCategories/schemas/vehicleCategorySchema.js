import { z } from "zod";

export const vehicleCategorySchema = (isEdit = false) =>
    z.object({
        name: z
            .string()
            .trim()
            .min(3, "Category name is required")
            .max(100, "Maximum 100 characters allowed"),

        description: z
            .string()
            .trim()
            .max(500, "Maximum 500 characters allowed")
            .optional()
            .or(z.literal("")),

        status: z.preprocess(
            (value) => value === "true",
            z.boolean()
        ),
    });