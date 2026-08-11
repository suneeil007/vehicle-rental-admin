import api from "@/app/services/api";
export const getBranches = () => api.get("/branches");
export const getBranch = (slug) => api.get(`/branches/${slug}`);
export const createBranch = (payload) => api.post("/branches", payload);
export const updateBranch = ({ slug, ...payload }) =>
    api.put(`/branches/${slug}`, payload);
export const deleteBranch = (slug) => api.delete(`/branches/${slug}`);