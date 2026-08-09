import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

/**
 * Reusable image upload field with drag-and-drop, preview, and validation.
 *
 * Props:
 * - value: File | null            → currently selected new file (controlled)
 * - onChange: (file: File|null) => void
 * - existingImageUrl: string|null → shown when no new file is selected (edit mode)
 * - label: string
 * - helperText: string
 * - error: string
 * - maxSizeMB: number
 * - accept: string
 */
const ImageUpload = ({
    value,
    onChange,
    existingImageUrl = null,
    label = "Image",
    helperText,
    error,
    maxSizeMB = 2,
    accept = "image/jpeg,image/jpg,image/png,image/webp",
}) => {
    const [preview, setPreview] = useState(existingImageUrl);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState("");
    const inputRef = useRef(null);

    // Sync preview when existingImageUrl changes (e.g. defaultValues load)
    useEffect(() => {
        if (!value) {
            setPreview(existingImageUrl);
        }
    }, [existingImageUrl, value]);

    // Build/revoke object URL for a newly selected file
    useEffect(() => {
        if (!value) return;

        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    const validateAndSet = useCallback(
        (file) => {
            if (!file) return;

            setLocalError("");

            const allowedTypes = accept.split(",").map((t) => t.trim());
            if (!allowedTypes.includes(file.type)) {
                setLocalError("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
                return;
            }

            const maxBytes = maxSizeMB * 1024 * 1024;
            if (file.size > maxBytes) {
                setLocalError(`Image must be smaller than ${maxSizeMB} MB.`);
                return;
            }

            onChange(file);
        },
        [accept, maxSizeMB, onChange]
    );

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        validateAndSet(file);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange(null);
        setPreview(null);
        setLocalError("");
        if (inputRef.current) inputRef.current.value = "";
    };

    const displayError = error || localError;

    return (
        <div>
            {label && <label className="form-label">{label}</label>}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-dashed
                    cursor-pointer
                    transition-colors
                    overflow-hidden
                    ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400 bg-gray-50"
                    }
                    ${preview ? "p-2" : "p-8"}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => validateAndSet(e.target.files?.[0])}
                />

                {preview ? (
                    <div className="relative group w-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="
                                absolute
                                top-2
                                right-2
                                bg-white/90
                                hover:bg-white
                                text-gray-700
                                hover:text-red-600
                                rounded-full
                                p-1.5
                                shadow-sm
                                transition-colors
                            "
                            title="Remove image"
                        >
                            <X size={16} />
                        </button>
                        <div
                            className="
                                absolute
                                inset-0
                                bg-black/0
                                group-hover:bg-black/10
                                rounded-lg
                                transition-colors
                                flex
                                items-center
                                justify-center
                                pointer-events-none
                            "
                        >
                            <span
                                className="
                                    opacity-0
                                    group-hover:opacity-100
                                    text-white
                                    text-xs
                                    font-medium
                                    bg-black/50
                                    px-2
                                    py-1
                                    rounded
                                    transition-opacity
                                "
                            >
                                Click or drop to replace
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="rounded-full bg-gray-100 p-3 mb-3">
                            {isDragging ? (
                                <Upload size={22} className="text-blue-500" />
                            ) : (
                                <ImageIcon size={22} className="text-gray-400" />
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            JPG, PNG, or WEBP — up to {maxSizeMB}MB
                        </p>
                    </>
                )}
            </div>

            {helperText && !displayError && (
                <p className="text-xs text-gray-400 mt-1.5">{helperText}</p>
            )}

            {displayError && (
                <p className="error-text mt-1.5">{displayError}</p>
            )}
        </div>
    );
};

export default ImageUpload;