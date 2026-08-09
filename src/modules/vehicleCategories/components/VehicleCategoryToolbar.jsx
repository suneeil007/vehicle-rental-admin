import { Car, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleCategoryToolbar = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* Title */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Car className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-600">
                            Vehicle Categories
                        </h1>

                        <p className="text-sm text-gray-500">
                            Manage your vehicle categories.
                        </p>
                    </div>
                </div>

                {/* Add Category */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/vehicle-categories/create")
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        hover:bg-blue-700
                        cursor-pointer
                        transition">
                    <Plus className="h-4 w-4" />
                    Add Category
                </button>

            </div>
        </div>
    );
};

export default VehicleCategoryToolbar;

