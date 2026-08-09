import useProfile from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const ProfilePage = () => {
    const { data: user, isLoading } = useProfile();

   console.log("USER:", JSON.stringify(user, null, 2));

    const fields = [
        user?.name,
        user?.email,
        user?.phone,
        user?.role?.name,
        user?.status,
        user?.branch?.name,
        user?.profile?.address,
        user?.profile?.avatar,
    ];

    const completed = fields.filter(Boolean).length;

    const percentage = Math.round(
        (completed / fields.length) * 100
    );

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
         <div>
            <h1 className="
                    text-3xl
                    font-bold
                    text-gray-800
                    mb-6
                    ">
                User Profile
            </h1>

            <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-sm
                        p-6
                        space-y-6
                        ">

                <div className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-5
                            ">

                    <div>
                        <label className="form-label">
                            Full Name
                        </label>
                        <p className="form-input bg-gray-50 text-gray-600">
                            {user.name}
                        </p>
                    </div>


                    <div>
                        <label className="form-label">
                            Email Address
                        </label>
                        <p className="form-input bg-gray-50 text-gray-600">
                            {user.email}
                        </p>
                    </div>


                    <div>
                        <label className="form-label">
                            Phone Number
                        </label>
                        <p className="form-input bg-gray-50 text-gray-600">
                            {user.phone}
                        </p>
                    </div>


                    <div>
                        <label className="form-label">
                            Role
                        </label>
                        <p className="form-input bg-gray-50 text-gray-600">
                            {user.role?.name}
                        </p>
                    </div>


                    <div>
                        <label className="form-label">
                            Status
                        </label>
                        <p className="form-input bg-gray-50 text-gray-600 capitalize">
                            {user.status}
                        </p>
                    </div>
                </div>


               <div className="bg-white rounded-xl border shadow-sm p-6">

                        <div className="flex justify-between items-start">

                            <div className="flex gap-4">

                                <div className="
                                    h-20
                                    w-20
                                    rounded-full
                                    bg-blue-100
                                    flex
                                    items-center
                                    justify-center
                                    text-3xl
                                    font-bold
                                    text-blue-700
                                ">
                                    {user.name.charAt(0)}
                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        {user.name}
                                    </h2>

                                    <p className="text-gray-500">
                                        {user.role?.name}
                                    </p>

                                    <p className="text-gray-500">
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => navigate("/profile/edit")}
                                className="
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    px-4
                                    py-2
                                    rounded-lg
                                    transition
                                "
                            >
                                Edit Profile
                            </button>

                        </div>

                        <div className="mt-8">

                            <div className="flex justify-between mb-2">

                                <span className="font-medium">
                                    Profile Completion
                                </span>

                                <span className="font-bold text-blue-600">
                                    {percentage}%
                                </span>

                            </div>

                            <div className="bg-gray-200 h-3 rounded-full">

                                <div
                                    className="bg-blue-600 h-3 rounded-full"
                                    style={{
                                        width: `${percentage}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

            </div>
        </div>
    );
};

export default ProfilePage;