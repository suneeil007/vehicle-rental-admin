import StatsCard from "../components/StatsCard";
import useDashboard from "../hooks/useDashboard";
import useDocumentTitle from "@/app/hooks/useDocumentTitle";

const DashboardPage = () => {

    useDocumentTitle("Dashboard");

    const { data, isLoading, error } = useDashboard();

    console.log({
        data,
        isLoading,
        error,
    });

    if (isLoading) {
        return <div>Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="text-red-600">
                Failed to load dashboard.
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-xl font-bold mb-8">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatsCard
                    title="Total Vehicles"
                    value={data?.total_vehicles}
                />

                <StatsCard
                    title="Available Vehicles"
                    value={data?.available_vehicles}
                />

                <StatsCard
                    title="Active Trips"
                    value={data?.active_trips}
                />

                <StatsCard
                    title="Pending Bookings"
                    value={data?.pending_bookings}
                />

                <StatsCard
                    title="Completed Trips"
                    value={data?.completed_trips}
                />

                <StatsCard
                    title="Today's Bookings"
                    value={data?.today_bookings}
                />

                <StatsCard
                    title="Today's Revenue"
                    value={`NPR ${data?.today_revenue}`}
                />

                <StatsCard
                    title="Monthly Revenue"
                    value={`NPR ${data?.monthly_revenue}`}
                />

                <StatsCard
                    title="Outstanding Due"
                    value={`NPR ${data?.outstanding_due}`}
                />

                <StatsCard
                    title="Unpaid Invoices"
                    value={data?.unpaid_invoices}
                />

            </div>
        </div>
    );
};

export default DashboardPage;