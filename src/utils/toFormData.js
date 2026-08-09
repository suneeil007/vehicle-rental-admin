/**
 * Converts a plain object into FormData.
 * - Skips null/undefined values (so backend "nullable" rules work correctly).
 * - Booleans are converted to 1/0, since PHP/Laravel don't parse "true"/"false" as booleans.
 * - Arrays are appended as key[] for each item.
 */
export const toFormData = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (typeof value === "boolean") {
            formData.append(key, value ? 1 : 0);
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item));
            return;
        }

        formData.append(key, value);
    });

    return formData;
};