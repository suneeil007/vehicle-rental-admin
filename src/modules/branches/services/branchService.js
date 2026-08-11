import {
    getBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch,
} from "../api/branchApi";

export const fetchBranches = async () => {
    const response = await getBranches();
    return response.data.data;
};

export const fetchBranch = async (slug) => {
    const response = await getBranch(slug);
    return response.data.data;
};

export const addBranch = async (payload) => {
    const response = await createBranch(payload);
    return response.data.data;
};

export const editBranch = async ({ slug, ...payload }) => {
    const response = await updateBranch({ slug, ...payload });
    return response.data.data;
};

export const removeBranch = async (slug) => {
    const response = await deleteBranch(slug);
    return response.data;   // ✅ delete responses usually have no nested .data.data
};