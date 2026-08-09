import api from "@/app/services/api";


const profileService = {


    get(){

        return api.get(
            "/profile"
        )
        .then(res=>res.data.data);

    },


    update(data){

        return api.put(
            "/profile",
            data
        )
        .then(res=>res.data);

    }


};


export default profileService;