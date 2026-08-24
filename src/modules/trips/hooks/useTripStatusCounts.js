import { useQueries } from "@tanstack/react-query";
import { getTrips } from "../api/tripApi";

export const TRIP_STATUSES = [
  "scheduled",
  "picked_up",
  "on_trip",
  "completed",
  "cancelled",
];

/**
 * Fetches the total count of trips per status.
 *
 * Implementation note: there's no dedicated /trips/stats endpoint yet, so
 * this hits the existing /trips list endpoint once per status with
 * per_page=1 and reads the pagination total (Laravel's paginate() response
 * includes a total regardless of per_page). If a stats endpoint is added
 * later, this hook is the only place that needs to change.
 */
export const useTripStatusCounts = () => {
  const results = useQueries({
    queries: TRIP_STATUSES.map((status) => ({
      queryKey: ["trips", "count", status],
      queryFn: async () => {
        const res = await getTrips({ status, per_page: 1 });
        // Handles both `{ data: { total } }` and `{ data: { meta: { total } } }`
        // Laravel paginate shapes depending on how ApiResponse wraps it.
        const payload = res.data.data;
        const total = payload?.total ?? payload?.meta?.total ?? 0;
        return { status, total };
      },
      staleTime: 30_000,
    })),
  });

  const counts = TRIP_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});

  results.forEach((result) => {
    if (result.data) {
      counts[result.data.status] = result.data.total;
    }
  });

  const isLoading = results.some((r) => r.isLoading);

  return { counts, isLoading };
};