import {
        useForm,
        Controller
    } from "react-hook-form";
import { toast } from "sonner";
import {
        zodResolver
    } from "@hookform/resolvers/zod";

import {
        Eye,
        EyeOff,
        User,
        Car,
        Shield,
        PhoneCall,
        CalendarIcon
    } from "lucide-react";

import {
        useEffect,
        useState
    } from "react";

import { format } from "date-fns";

import { userSchema } from "../validation/userSchema";
// console.log("SCHEMA TYPE:", typeof userSchema);
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
        Popover,
        PopoverContent,
        PopoverTrigger,
    } from "@/components/ui/popover";

import useAuthStore from "../../auth/store/authStore";
import useBranches from "@/modules/branches/hooks/useBranches";

// Map role_id -> role slug so we know which extra sections to show.
// Update this if your real role IDs differ (e.g. branch-manager, staff).
const ROLE_SLUG_BY_ID = {
    "1": "super-admin",
    "2": "admin",
    "5": "customer",
    "6": "driver",
};

const UserForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isLoading = false
}) => {

    // console.log("RAW defaultValues FROM API:", defaultValues);
    // console.log("Does it have a profile key?", defaultValues?.profile);

    const [showPassword, setShowPassword] = useState(false);
    const currentUser = useAuthStore((state) => state.user);
    const isSuperAdmin = currentUser?.role?.slug === "super-admin";

    const {
        data: branches = [],
        isLoading: branchLoading
    } = useBranches();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        control,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm({

        resolver: zodResolver(userSchema(Boolean(defaultValues))),

        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role_id: "",
            branch_id: "",
            status: "active",
            password: "",
            password_confirmation: "",

            profile: {
                date_of_birth: "",
                gender: "",
                nationality: "",
                country: "",
                state: "",
                city: "",
                postal_code: "",
                address: "",

                driving_license_no: "",
                license_expiry: "",
                citizenship_no: "",
                passport_no: "",

                emergency_contact_name: "",
                emergency_contact_phone: "",

                bio: "",
            }
        }

    });

    const roleId = watch("role_id");
    const status = watch("status");
    const roleSlug = ROLE_SLUG_BY_ID[roleId] ?? "";
    const showDriverSection = roleSlug === "driver";
    const showAdminSection = [
            "super-admin",
            "admin",
            "branch-manager",
            "staff"
        ].includes(roleSlug);


    // EDIT DATA LOAD
    useEffect(() => {

        if (defaultValues) {

            const editRoleId = String(
                defaultValues.role?.id ?? ""
            );

            reset({
                name: defaultValues.name ?? "",
                email: defaultValues.email ?? "",
                phone: defaultValues.phone ?? "",
                role_id: editRoleId,
                branch_id: String(
                    defaultValues.branch?.id ?? ""
                ),
                status: defaultValues.status ?? "active",
                password: "",
                password_confirmation: "",

                profile: {
                    date_of_birth: defaultValues.profile?.date_of_birth ?? "",
                    gender: defaultValues.profile?.gender ?? "",
                    nationality: defaultValues.profile?.nationality ?? "",
                    country: defaultValues.profile?.country ?? "",
                    state: defaultValues.profile?.state ?? "",
                    city: defaultValues.profile?.city ?? "",
                    postal_code: defaultValues.profile?.postal_code ?? "",
                    address: defaultValues.profile?.address ?? "",

                    driving_license_no: defaultValues.profile?.driving_license_no ?? "",
                    license_expiry: defaultValues.profile?.license_expiry ?? "",
                    citizenship_no: defaultValues.profile?.citizenship_no ?? "",
                    passport_no: defaultValues.profile?.passport_no ?? "",

                    emergency_contact_name: defaultValues.profile?.emergency_contact_name ?? "",
                    emergency_contact_phone: defaultValues.profile?.emergency_contact_phone ?? "",

                    bio: defaultValues.profile?.bio ?? "",
                }
            });

        }

    }, [defaultValues, reset]);


    const handleRoleChange = (value) => {
        setValue("role_id", value, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleStatusChange = (value) => {
        setValue("status", value, {
            shouldValidate: true,
            shouldDirty: true
        });
    };


    return (

        <form
            onSubmit={handleSubmit(onSubmit, (formErrors) => {
                const dobError = formErrors.profile?.date_of_birth?.message;
                if (dobError) {
                    toast.error(dobError);
                }
            })}
            className="space-y-8"
        >

            {/* ACCOUNT INFO */}
            <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    p-6
                    space-y-6"
                >

                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User size={22} />
                    Account Information
                </h2>

                <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-5"
                    >

                    {/* Name */}
                    <div>
                        <label className="form-label">Full Name</label>
                        <input {...register("name")} className="form-input" />
                        <p className="error-text">{errors.name?.message}</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="form-label">Email Address</label>
                        <input {...register("email")} className="form-input" />
                        <p className="error-text">{errors.email?.message}</p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="form-label">Phone Number</label>
                        <input {...register("phone")} className="form-input" />
                        <p className="error-text">{errors.phone?.message}</p>
                    </div>

                    {/* ROLE */}
                    <div>
                        <label className="form-label">
                            Role
                            {!isSuperAdmin && (
                                <span className="text-xs text-gray-400 ml-2">
                                    (Super Admin only)
                                </span>
                            )}
                        </label>

                        <Select
                            key={roleId || "empty"}
                            value={roleId || ""}
                            onValueChange={handleRoleChange}
                            disabled={!isSuperAdmin}
                        >
                            <SelectTrigger
                                className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border-gray-300
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed"
                                >
                                   <SelectValue placeholder="Select role" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="1">Super Admin</SelectItem>
                                <SelectItem value="2">Admin</SelectItem>
                                <SelectItem value="5">Customer</SelectItem>
                                <SelectItem value="6">Driver</SelectItem>
                            </SelectContent>
                        </Select>

                        <p className="error-text">{errors.role_id?.message}</p>
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="form-label">Status</label>

                        <Select
                            key={status || "empty"}
                            value={status || ""}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger 
                               className="
                                    h-11
                                    w-full
                                    rounded-lg
                                    border-gray-300"
                                >
                                   <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem
                                    value="suspended"
                                    disabled={!isSuperAdmin}
                                >
                                    Suspended
                                    {!isSuperAdmin && " (Super Admin only)"}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <p className="error-text">{errors.status?.message}</p>
                    </div>

                                    
                    {/* BRANCH */}
                    <div>
                        <label className="form-label">Branch</label>

                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || "empty"}
                                    value={field.value || ""}
                                    onValueChange={field.onChange}
                                    disabled={branchLoading}
                                >
                                    <SelectTrigger 
                                        className="
                                            h-11
                                            w-full
                                            rounded-lg
                                            border-gray-300
                                            disabled:opacity-60
                                            disabled:cursor-not-allowed"
                                        >
                                        <SelectValue
                                            placeholder={
                                                branchLoading ? "Loading branches..." : "Select Branch"
                                            }
                                        />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={String(branch.id)}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <p className="error-text">{errors.branch_id?.message}</p>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="form-label">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                    placeholder={
                                        defaultValues
                                            ? "Leave empty to keep old password"
                                            : "Enter password"
                                    }
                                    className="form-input pr-12"
                                />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <p className="error-text">{errors.password?.message}</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="form-label">Confirm Password</label>

                        <input
                            type="password"
                            {...register("password_confirmation")}
                            placeholder="Confirm password"
                            className="form-input"
                        />

                        <p className="error-text">
                            {errors.password_confirmation?.message}
                        </p>
                    </div>

                </div>
            </div>


            {/* PERSONAL / PROFILE INFO */}
            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6
                "
            >

                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User size={22} />
                    Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Date of Birth */}
                    <div>
                        <label className="form-label">Date of Birth</label>

                        <Controller
                            name="profile.date_of_birth"
                            control={control}
                            render={({ field }) => {

                                const dobValue = field.value ? new Date(field.value) : undefined;

                                return (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="
                                                    form-input
                                                    flex
                                                    items-center
                                                    justify-start
                                                    text-left
                                                    font-normal
                                                    "
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                {dobValue ? format(dobValue, "PPP") : "Select date of birth"}
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent align="start" className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dobValue}
                                                onSelect={(date) =>
                                                    field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                                                }
                                                captionLayout="dropdown"
                                                fromYear={1950}
                                                toYear={new Date().getFullYear()}
                                                disabled={(date) => date > new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                );
                            }}
                        />

                        <p className="error-text">{errors.profile?.date_of_birth?.message}</p>
                    </div>

                    {/* Gender */}
                   <div>
                        <label className="form-label">Gender</label>

                        <Controller
                            name="profile.gender"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    key={field.value || "empty"}
                                    value={field.value || ""}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger className="h-11 w-full rounded-lg border-gray-300">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <p className="error-text">{errors.profile?.gender?.message}</p>
                    </div>
                    
                    <div>
                        <label className="form-label">Nationality</label>
                        <input {...register("profile.nationality")} className="form-input" />
                        <p className="error-text">{errors.profile?.nationality?.message}</p>
                    </div>

                    <div>
                        <label className="form-label">Country</label>
                        <input {...register("profile.country")} className="form-input" />
                        <p className="error-text">{errors.profile?.country?.message}</p>
                    </div>

                    <div>
                        <label className="form-label">State</label>
                        <input {...register("profile.state")} className="form-input" />
                        <p className="error-text">{errors.profile?.state?.message}</p>
                    </div>

                    <div>
                        <label className="form-label">City</label>
                        <input {...register("profile.city")} className="form-input" />
                        <p className="error-text">{errors.profile?.city?.message}</p>
                    </div>

                    <div>
                        <label className="form-label">Postal Code</label>
                        <input {...register("profile.postal_code")} className="form-input" />
                        <p className="error-text">{errors.profile?.postal_code?.message}</p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="form-label">Address</label>
                        <textarea
                            {...register("profile.address")}
                            rows="3"
                            className="form-input resize-none"
                        />
                        <p className="error-text">{errors.profile?.address?.message}</p>
                    </div>

                </div>
            </div>


            {/* DRIVER INFO */}
            {showDriverSection && (
                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    p-6
                    space-y-6
                    "
                >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Car size={22} />
                        Driver Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="form-label">Driving License No</label>
                            <input {...register("profile.driving_license_no")} className="form-input" />
                            <p className="error-text">{errors.profile?.driving_license_no?.message}</p>
                        </div>

                        <div>
                            <label className="form-label">License Expiry</label>

                            <Controller
                                name="profile.license_expiry"
                                control={control}
                                render={({ field }) => {

                                    const expiryValue = field.value ? new Date(field.value) : undefined;

                                    return (
                                       <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="
                                                        form-input
                                                        flex
                                                        items-center
                                                        justify-start
                                                        text-left
                                                        font-normal
                                                        "
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                    {expiryValue ? format(expiryValue, "PPP") : "Select expiry date"}
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent align="start" className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={expiryValue}
                                                    onSelect={(date) =>
                                                        field.onChange(
                                                            date ? format(date, "yyyy-MM-dd") : ""
                                                        )
                                                    }
                                                    captionLayout="dropdown"
                                                    fromYear={new Date().getFullYear() - 5}
                                                    toYear={new Date().getFullYear() + 20}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    );
                                }}
                            />

                            <p className="error-text">{errors.profile?.license_expiry?.message}</p>
                        </div>

                        <div>
                            <label className="form-label">Citizenship No</label>
                            <input {...register("profile.citizenship_no")} className="form-input" />
                            <p className="error-text">{errors.profile?.citizenship_no?.message}</p>
                        </div>

                        <div>
                            <label className="form-label">Passport No</label>
                            <input {...register("profile.passport_no")} className="form-input" />
                            <p className="error-text">{errors.profile?.passport_no?.message}</p>
                        </div>

                    </div>
                </div>
            )}


            {/* EMERGENCY CONTACT */}
            <div className="
                bg-white
                border
                border-gray-200
                rounded-xl
                shadow-sm
                p-6
                space-y-6
                "
            >
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <PhoneCall size={22} />
                    Emergency Contact
                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                    <div>
                        <label className="form-label">Emergency Contact Name</label>
                        <input {...register("profile.emergency_contact_name")} className="form-input" />
                        <p className="error-text">
                            {errors.profile?.emergency_contact_name?.message}
                        </p>
                    </div>

                    <div>
                        <label className="form-label">Emergency Contact Phone</label>
                        <input {...register("profile.emergency_contact_phone")} className="form-input" />
                        <p className="error-text">
                            {errors.profile?.emergency_contact_phone?.message}
                        </p>
                    </div>

                </div>
            </div>


            {/* ADMIN / STAFF INFO */}
            {showAdminSection && (
                <div className="
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    p-6
                    space-y-6"
                >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Shield size={22} />
                        Additional Information
                    </h2>

                    <label className="form-label">Bio</label>
                    <textarea {...register("profile.bio")} className="form-input" rows="3" />
                    <p className="error-text">{errors.profile?.bio?.message}</p>
                </div>
            )}


            {/* ACTIONS */}
            <div 
                className="
                    flex
                    justify-end
                    gap-3
                    bg-white
                    border
                    border-gray-200
                    rounded-xl
                    shadow-sm
                    p-6"
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-lg border hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="
                            px-5
                            py-2.5
                            rounded-lg
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            disabled:opacity-50
                            "
                    >
                        {isSubmitting || isLoading
                            ? "Saving..."
                            : defaultValues
                                ? "Update User"
                                : "Create User"}
                    </button>
            </div>

        </form>

    );

};


export default UserForm;