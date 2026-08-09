import {
    useParams,
    useNavigate
}
    from "react-router-dom";

import {
    User,
    Car,
    Shield,
    PhoneCall
} from "lucide-react";

import { format } from "date-fns";

import useUser from "../hooks/useUser";

const UserViewPage = () => {

    const { slug } = useParams();
    const navigate = useNavigate();

    const {
        data,
        isLoading
    } = useUser(slug);

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    if (!data) {
        return <div>
            User not found.
        </div>
    }

    const user = data;
    const role = user?.role?.slug;

    // Small helper so we don't repeat the same JSX everywhere
    const Field = ({ label, value }) => (
        <div>
            <label className="form-label">
                {label}
            </label>
            <p className="form-input bg-gray-50 text-gray-600">
                {value || "—"}
            </p>
        </div>
    );

    return (

        <div>
            <h1 className="
                    text-3xl
                    font-bold
                    text-gray-800
                    mb-6
                    ">
                User Details
            </h1>

            <div className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        shadow-sm
                        p-6
                        space-y-8
                        ">

                {/* PERSONAL INFORMATION */}
                <div>

                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <User size={22} />
                        Personal Information
                    </h2>

                    <div className="
                                grid
                                grid-cols-1
                                md:grid-cols-2
                                gap-5
                                ">

                        <Field label="Full Name" value={user.name} />
                        <Field label="Email Address" value={user.email} />
                        <Field label="Phone Number" value={user.phone} />

                        <Field
                            label="Date of Birth"
                            value={
                                user?.profile?.date_of_birth
                                    ? format(new Date(user.profile.date_of_birth), "PPP")
                                    : ""
                            }
                        />

                        <Field
                            label="Gender"
                            value={
                                user?.profile?.gender
                                    ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1)
                                    : ""
                            }
                        />

                        <Field label="Nationality" value={user?.profile?.nationality} />
                        <Field label="Country" value={user?.profile?.country} />
                        <Field label="State" value={user?.profile?.state} />
                        <Field label="City" value={user?.profile?.city} />
                        <Field label="Postal Code" value={user?.profile?.postal_code} />

                        <div className="md:col-span-2">
                            <Field label="Address" value={user?.profile?.address} />
                        </div>

                        <Field label="Role" value={user.role?.name} />
                        <Field label="Branch" value={user.branch?.name} />

                        <Field
                            label="Status"
                            value={
                                user.status
                                    ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                                    : ""
                            }
                        />

                    </div>

                </div>

                {/* DRIVER INFORMATION */}
                {
                    role === "driver" && (

                        <div>

                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Car size={22} />
                                Driver Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-5">

                                <Field
                                    label="Driving License No"
                                    value={user?.profile?.driving_license_no}
                                />

                                <Field
                                    label="License Expiry"
                                    value={
                                        user?.profile?.license_expiry
                                            ? format(new Date(user.profile.license_expiry), "PPP")
                                            : ""
                                    }
                                />

                                <Field
                                    label="Citizenship No"
                                    value={user?.profile?.citizenship_no}
                                />

                                <Field
                                    label="Passport No"
                                    value={user?.profile?.passport_no}
                                />

                            </div>

                        </div>

                    )
                }

                {/* EMERGENCY CONTACT */}
                <div>

                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <PhoneCall size={22} />
                        Emergency Contact
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        <Field
                            label="Emergency Contact Name"
                            value={user?.profile?.emergency_contact_name}
                        />

                        <Field
                            label="Emergency Contact Phone"
                            value={user?.profile?.emergency_contact_phone}
                        />

                    </div>

                </div>

                {/* ADMIN / STAFF INFO */}
                {
                    [
                        "super-admin",
                        "admin",
                        "branch-manager",
                        "staff"
                    ].includes(role) &&

                    <div>

                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Shield size={22} />
                            Additional Information
                        </h2>

                        <Field label="Bio" value={user?.profile?.bio} />

                    </div>
                }

                <div className="
                        flex
                        justify-end
                        pt-5
                        border-t
                        ">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="
                            px-5
                            py-2.5
                            rounded-lg
                            border
                            cursor-pointer
                            hover:bg-gray-50
                            ">
                        Back
                    </button>
                </div>

            </div>
        </div>
    )
};


export default UserViewPage;