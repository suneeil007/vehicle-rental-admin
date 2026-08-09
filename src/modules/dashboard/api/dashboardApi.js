import api from "../../../app/services/api";

export const getDashboardSummary = () => {
    return api.get("/dashboard/summary");
};