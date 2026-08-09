import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import useProfile from "@/modules/auth/hooks/useProfile";
import ProfileForm from "../components/ProfileForm";


const ProfileEditPage = () => {


    const navigate = useNavigate();


    const {
        data: user,
        isLoading,
    } = useProfile();



    if (isLoading || !user) {

        return (

            <div className="p-8">

                Loading profile...

            </div>

        );

    }



    return (

        <div className="space-y-6">


            {/* Header */}

            <div className="flex items-center justify-between">


                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        Edit Profile

                    </h1>


                    <p className="text-gray-500 mt-1">

                        Update your personal information

                    </p>


                </div>



                <button

                    onClick={() => navigate("/profile")}

                    className="
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-lg
                        border
                        hover:bg-gray-50
                    "

                >

                    <ArrowLeft size={18}/>

                    Back

                </button>


            </div>





            {/* User Information Card */}


            <div
                className="
                    bg-blue-50
                    border
                    border-blue-100
                    rounded-xl
                    p-5
                "
            >

                <h2 className="font-semibold text-lg">

                    Editing Profile

                </h2>


                <p className="text-gray-600 mt-1">

                    {user.name} 
                    {" "} 
                    ({user.role?.name})

                </p>


            </div>






            {/* Form */}


            <div
                className="
                    bg-white
                    border
                    rounded-xl
                    shadow-sm
                    p-6
                "
            >


                <ProfileForm
                    user={user}
                    role={user.role?.slug}
                />


            </div>



        </div>

    );

};


export default ProfileEditPage;