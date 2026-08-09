import { useState } from "react";

import {
    User,
    Car,
    Shield,
    UserRound,
    PhoneCall
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


import { CalendarIcon } from "lucide-react";

import { format } from "date-fns";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const ProfileForm = ({
    user
}) => {


const role = user?.role?.slug;

const [dob, setDob] = useState(
    user?.profile?.date_of_birth
        ? new Date(user.profile.date_of_birth)
        : undefined
);


return (

<form className="space-y-8">


{/* PERSONAL INFORMATION */}

<div>

<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">

<User size={22}/>

Personal Information

</h2>



<div className="grid grid-cols-1 md:grid-cols-2 gap-5">



<div>
<label className="form-label">
Full Name
</label>

<input
value={user?.name ?? ""}
className="form-input"
/>
</div>



<div>
<label className="form-label">
Email
</label>

<input
value={user?.email ?? ""}
className="form-input"
/>
</div>




<div>
<label className="form-label">
Phone
</label>

<input
value={user?.phone ?? ""}
className="form-input"
/>
</div>



<div>

<label className="form-label">
    Date of Birth
</label>


<Popover>

<PopoverTrigger asChild>

<Button

variant="outline"

className="
h-11
w-full
justify-start
text-left
font-normal
rounded-lg
border-gray-300
"

>


<CalendarIcon className="mr-2 h-4 w-4" />


{
dob
?
format(
    dob,
    "PPP"
)
:
"Select date of birth"
}


</Button>


</PopoverTrigger>



<PopoverContent
align="start"
className="w-auto p-0"
>


<Calendar

mode="single"

selected={dob}

onSelect={setDob}

captionLayout="dropdown"

fromYear={1950}

toYear={new Date().getFullYear()}

disabled={(date)=> 
    date > new Date()
}

/>


</PopoverContent>


</Popover>


</div>





<div>

    <label className="form-label">
        Gender
    </label>


    <Select
        defaultValue={
            user.profile?.gender ?? ""
        }
    >

        <SelectTrigger
            className="
                h-11
                w-full
                rounded-lg
                border-gray-300
            "
        >

            <SelectValue
                placeholder="Select gender"
            />

        </SelectTrigger>


        <SelectContent>


            <SelectItem value="male">
                Male
            </SelectItem>


            <SelectItem value="female">
                Female
            </SelectItem>


            <SelectItem value="other">
                Other
            </SelectItem>


        </SelectContent>


    </Select>

</div>





<div>

<label className="form-label">
Nationality
</label>


<input

defaultValue={
user?.profile?.nationality ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
Country
</label>


<input

defaultValue={
user?.profile?.country ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
State
</label>


<input

defaultValue={
user?.profile?.state ?? ""
}

className="form-input"

/>

</div>





<div>

<label className="form-label">
City
</label>


<input

defaultValue={
user?.profile?.city ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
Postal Code
</label>


<input

defaultValue={
user?.profile?.postal_code ?? ""
}

className="form-input"

/>

</div>




<div className="md:col-span-2">

<label className="form-label">
    Address
</label>


<textarea

defaultValue={
    user.profile?.address ?? ""
}

rows="3"

className="
    form-input
    resize-none
"

/>

</div>


</div>


</div>






{/* DRIVER INFORMATION */}


{
role === "driver" && (

<div>


<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">

<Car size={22}/>

Driver Information

</h2>



<div className="grid md:grid-cols-2 gap-5">



<div>

<label className="form-label">
Driving License No
</label>


<input

defaultValue={
user?.profile?.driving_license_no ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
License Expiry
</label>


<input

type="date"

defaultValue={
user?.profile?.license_expiry ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
Citizenship No
</label>


<input

defaultValue={
user?.profile?.citizenship_no ?? ""
}

className="form-input"

/>

</div>



<div>

<label className="form-label">
Passport No
</label>


<input

defaultValue={
user?.profile?.passport_no ?? ""
}

className="form-input"

/>

</div>



</div>


</div>

)

}







{/* EMERGENCY CONTACT */}

<div>


<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">

<PhoneCall size={22}/>

Emergency Contact

</h2>



<div className="grid md:grid-cols-2 gap-5">


<div>

<label className="form-label">
Emergency Contact Name
</label>


<input

defaultValue={
user?.profile?.emergency_contact_name ?? ""
}

className="form-input"

/>

</div>




<div>

<label className="form-label">
Emergency Contact Phone
</label>


<input

defaultValue={
user?.profile?.emergency_contact_phone ?? ""
}

className="form-input"

/>

</div>


</div>


</div>







{/* ADMIN / STAFF INFO */}


{
[
"super-admin",
"admin",
"branch-manager",
"staff"

].includes(role)

&&

<div>


<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">

<Shield size={22}/>

Additional Information

</h2>



<label className="form-label">

Bio

</label>


<textarea

defaultValue={
user?.profile?.bio ?? ""
}

className="form-input"

/>


</div>

}







<button

type="submit"

className="
bg-blue-600
hover:bg-blue-700
text-white
px-6
py-2.5
rounded-lg
"

>

Save Changes

</button>



</form>

);

};


export default ProfileForm;