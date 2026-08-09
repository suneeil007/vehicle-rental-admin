import { useState, useCallback, useRef, useEffect } from "react";
import { UploadCloud, X, ImagePlus, Check } from "lucide-react";

const MultiImageUpload = ({
    value = [],
    onChange,
    existingImages = [],
    onRemoveExisting,
    onSetFeatured,
    label = "Images",
    helperText,
    error,
    maxFiles = 8,
    maxSizeMB = 2,
    accept = "image/jpeg,image/jpg,image/png,image/webp",
    thumbSize = 90,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState("");
    const [previews, setPreviews] = useState([]);

    const inputRef = useRef(null);

    const totalCount = existingImages.length + value.length;
    const canAddMore = totalCount < maxFiles;
    const isEmpty = totalCount === 0;

    useEffect(() => {
        const urls = value.map((file) => URL.createObjectURL(file));

        setPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [value]);

    const validateAndAdd = useCallback(
        (fileList) => {
            const incoming = Array.from(fileList);

            if (!incoming.length) return;

            setLocalError("");

            const allowedTypes = accept.split(",").map((t) => t.trim());

            const maxBytes = maxSizeMB * 1024 * 1024;

            const validFiles = [];

            incoming.forEach((file) => {
                if (!allowedTypes.includes(file.type)) {
                    setLocalError(
                        "Only JPG, PNG and WEBP images are allowed."
                    );
                    return;
                }

                if (file.size > maxBytes) {
                    setLocalError(
                        `Each image must be less than ${maxSizeMB}MB.`
                    );
                    return;
                }

                validFiles.push(file);
            });

            const remainingSlots = maxFiles - totalCount;

            if (remainingSlots <= 0) {
                setLocalError(`Maximum ${maxFiles} images allowed.`);
                return;
            }

            onChange([...value, ...validFiles.slice(0, remainingSlots)]);
        },
        [accept, maxFiles, maxSizeMB, onChange, totalCount, value]
    );

    const handleDrop = (e) => {
        e.preventDefault();

        setIsDragging(false);

        validateAndAdd(e.dataTransfer.files);
    };

    const removeNewImage = (index) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const thumbStyle = {
        width: thumbSize,
        height: thumbSize,
    };

    const displayError = error || localError;

    return (
    <div className="space-y-2">
        {label && (
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
        )}

        <div
            onClick={() => isEmpty && inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
                w-full
                rounded-xl
                border-2
                border-dashed
                p-4
                transition-all
                ${
                    isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50"
                }
                ${isEmpty ? "cursor-pointer" : ""}
            `}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                accept={accept}
                className="hidden"
                onChange={(e) => validateAndAdd(e.target.files)}
            />

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <UploadCloud
                        size={36}
                        className="text-blue-500 mb-3"
                    />

                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-blue-600">
                            Click to upload
                        </span>{" "}
                        or drag & drop
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG & WEBP • Max {maxSizeMB}MB
                    </p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">

                    {/* Existing Images */}
                    {existingImages.map((img) => (
                        <div
                            key={img.id}
                            style={thumbStyle}
                            className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                        >
                            <img
                                src={img.url}
                                alt=""
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            {onSetFeatured && (
                                <button
                                    type="button"
                                    title={
                                        img.is_featured
                                            ? "Featured image"
                                            : "Set as featured image"
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!img.is_featured) {
                                            onSetFeatured(img.id);
                                        }
                                    }}
                                    className={`
                                        absolute
                                        top-2
                                        left-2
                                        z-50
                                        flex
                                        items-center
                                        justify-center
                                        w-7
                                        h-7
                                        rounded-full
                                        shadow-lg
                                        transition
                                        ${
                                            img.is_featured
                                                ? "bg-green-600 text-white opacity-100"
                                                : "bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-green-600 hover:text-white"
                                        }
                                    `}
                                >
                                    <Check size={15} />
                                </button>
                            )}

                            {onRemoveExisting && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveExisting(img.id);
                                    }}
                                    className="
                                        absolute
                                        top-2
                                        right-2
                                        z-50
                                        flex
                                        items-center
                                        justify-center
                                        w-7
                                        h-7
                                        rounded-full
                                        bg-red-600
                                        text-white
                                        shadow-lg
                                        hover:bg-red-700
                                        transition
                                    "
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* New Images */}
                    {value.map((file, index) => (
                        <div
                            key={index}
                            style={thumbStyle}
                            className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                        >
                            <img
                                src={previews[index]}
                                alt={file.name}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeNewImage(index);
                                }}
                                className="
                                    absolute
                                    top-2
                                    right-2
                                    z-50
                                    flex
                                    items-center
                                    justify-center
                                    w-7
                                    h-7
                                    rounded-full
                                    bg-red-600
                                    text-white
                                    shadow-lg
                                    hover:bg-red-700
                                    transition
                                "
                            >
                                <X size={15} />
                            </button>
                        </div>
                    ))}

                    {/* Add More */}
                    {canAddMore && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                            style={thumbStyle}
                            className="
                                rounded-xl
                                border-2
                                border-dashed
                                border-gray-300
                                bg-white
                                hover:border-blue-500
                                hover:bg-blue-50
                                transition
                                flex
                                items-center
                                justify-center
                                text-gray-400
                            "
                        >
                            <ImagePlus size={26} />
                        </button>
                    )}
                </div>
            )}
        </div>

        <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
                {totalCount}/{maxFiles} images
            </p>

            {helperText && !displayError && (
                <p className="text-xs text-gray-400">
                    {helperText}
                </p>
            )}
        </div>

        {displayError && (
            <p className="text-sm text-red-600">
                {displayError}
            </p>
        )}
    </div>
);
};

export default MultiImageUpload;