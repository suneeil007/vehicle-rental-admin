import api from "../../../app/services/api";

export const getUsers = () => {
        return api.get("/users?per_page=1000");
    };

export const getUser = (slug) => {
        return api.get(`/users/${slug}`);
    };


export const createUser = async (payload) => {
    const response = await api.post(
        "/users",
        payload
    );
    return response.data;
};


export const updateUser = (slug, data) => {
    return api.put(
        `/users/${slug}`,
        data
    );
};


export const deleteUser = (slug) => {
    return api.delete(
        `/users/${slug}`
    );

};