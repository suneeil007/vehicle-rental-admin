import api from "@/app/services/api";


const branchService = {

    getAll: async () => {

        const response = await api.get("/branches");

        return response.data.data;

    }

};


export default branchService;