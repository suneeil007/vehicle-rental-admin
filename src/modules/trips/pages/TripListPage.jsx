import { Link } from "react-router-dom";
import useTrips from "../hooks/useTrips";
import { tripColumns } from "../components/TripColumns";
import { Button } from "@/components/ui/button";
import TripTable from "../components/TripTable";
import TripToolbar from "../components/TripToolbar";

const TripListPage = () => {
    const {
        data: trips,
        isLoading,
        isError,
    } = useTrips();

    return (
        <div className="space-y-4">
            <TripToolbar />

            {isError && (
                <p className="text-destructive">
                    Failed to load trips.
                </p>
            )}

            <TripTable
                columns={tripColumns}
                trips={trips ?? []}
                loading={isLoading}
            />
        </div>
    );
};

export default TripListPage;