import { CalendarCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TripToolbar = () => {
    const navigate = useNavigate();

    return (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <CalendarCheck className="h-6 w-6 text-blue-600" />
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-gray-600">
                            Trips
                        </h1>

                        <p className="text-sm text-gray-500">
                            Track, manage, and monitor customer trips.
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <button
                    type="button"
                    onClick={() => navigate("/trips/create")}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-5
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        hover:text-white
                        cursor-pointer
                    "
                >
                    <Plus className="h-4 w-4" />
                    New Trip
                </button>

            </div>
        </div>
    );
};

export default TripToolbar;