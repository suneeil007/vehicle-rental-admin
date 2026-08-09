import api from "@/app/services/api";

const userService = {

    getUser(slug) {
        return api.get(`/users/${slug}`)
            .then(res => res.data);
    },

    update(slug, data) {
        return api.put(`/users/${slug}`, data)
            .then(res => res.data);
    },

    delete(slug) {
        return api.delete(`/users/${slug}`)
            .then(res => res.data);
    }

};

export default userService;