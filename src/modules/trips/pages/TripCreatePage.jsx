import { useNavigate } from "react-router-dom";
import { List } from "lucide-react";
import TripForm from "../components/TripForm";
import useCreateTrip from "../hooks/useCreateTrip";

const TripCreatePage = () => {
    const navigate = useNavigate();
    const createTrip = useCreateTrip();

    const handleSubmit = (values) => {
        createTrip.mutate(values, {
            onSuccess: (trip) => {
                navigate(`/trips/${trip.slug}`);
            },
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-0">

            <h1 className="text-xl font-bold text-gray-600 mb-0">
                    Create Trip
                </h1>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/trips")
                    }
                    className="h-10 w-10 flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-white transition cursor-pointer relative top-[10px]"
                    title="Trips List"
                >
                    <List className="h-4 w-4" />
                </button>

            </div>

            <p className="text-gray-500 text-sm">
                Add new trip
            </p>

            <TripForm
                onSubmit={handleSubmit}
                onCancel={() => navigate("/trips")}
                isSubmitting={createTrip.isPending}
            />
        </div>
    );
};

export default TripCreatePage;
