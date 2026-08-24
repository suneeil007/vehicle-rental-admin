import { useMemo, useState } from "react";
import useTrips from "../hooks/useTrips";
import { tripColumns } from "../components/TripColumns";
import TripTable from "../components/TripTable";
import TripToolbar from "../components/TripToolbar";
import TripStatusBadges from "../components/TripStatusBadges";

const TripListPage = () => {
    const {
        data: trips,
        isLoading,
        isError,
    } = useTrips();

    const [activeStatus, setActiveStatus] = useState("");

    const allTrips = trips ?? [];

    const filteredTrips = useMemo(() => {
        if (!activeStatus) return allTrips;
        return allTrips.filter((trip) => trip.status === activeStatus);
    }, [allTrips, activeStatus]);

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
                trips={filteredTrips}
                loading={isLoading}
                toolbarRight={
                    <TripStatusBadges
                        trips={allTrips}
                        activeStatus={activeStatus}
                        onSelect={setActiveStatus}
                    />
                }
            />
        </div>
    );
};

export default TripListPage;