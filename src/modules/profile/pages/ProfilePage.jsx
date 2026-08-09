import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useProfile from "../hooks/useProfile";

import {
    User,
    Mail,
    Phone,
    Camera,
    MapPin,
} from "lucide-react";


const ProfilePage = () => {


    const navigate = useNavigate();


    const {
        data: user,
        isLoading
    } = useProfile();



    const profile = user?.profile || {};



    const completion = useMemo(() => {


        const fields = [

            user?.name,

            user?.email,

            user?.phone,

            user?.role?.name,

            user?.status,


            profile.date_of_birth,

            profile.gender,

            profile.nationality,

            profile.address,

            profile.city,

            profile.country,

            profile.profile_photo,

            profile.bio

        ];



        const completed =
            fields.filter(Boolean).length;



        return Math.round(
            (completed / fields.length) * 100
        );


    }, [user]);




    if(isLoading || !user){

        return (

            <div className="p-8">

                Loading profile...

            </div>

        );

    }





return (

<div className="space-y-6">



{/* HEADER */}

<div className="flex justify-between items-center">


<div>

<h1 className="
text-3xl
font-bold
text-gray-800
">

My Profile

</h1>


<p className="text-gray-500 mt-1">

Manage your personal information

</p>


</div>



<button

onClick={() => navigate("/profile/edit")}

className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2.5
rounded-lg
"

>

Edit Profile

</button>


</div>






{/* COMPLETION */}

<div className="
bg-white
border
rounded-xl
shadow-sm
p-6
">


<div className="
flex
justify-between
mb-2
">


<span className="font-semibold">

Profile Completion

</span>



<span className="
font-bold
text-blue-600
">

{completion}%

</span>


</div>



<div className="
h-3
bg-gray-200
rounded-full
overflow-hidden
">


<div

className="
h-full
bg-blue-600
rounded-full
transition-all
"

style={{
    width:`${completion}%`
}}


/>


</div>


</div>






<div className="
grid
grid-cols-1
lg:grid-cols-3
gap-6
">






{/* LEFT CARD */}

<div className="
bg-white
border
rounded-xl
shadow-sm
p-6
">


<div className="
flex
flex-col
items-center
">


<div className="
relative
">


<div className="
w-32
h-32
rounded-full
bg-gray-100
flex
items-center
justify-center
overflow-hidden
">


{
profile.profile_photo ? (

<img

src={profile.profile_photo}

alt={user?.name}

className="
w-full
h-full
object-cover
"

/>

)

:

(

<User 
className="
w-14
h-14
text-gray-400
"
/>

)

}



</div>



<button

className="
absolute
bottom-1
right-1
bg-blue-600
text-white
rounded-full
p-2
"

>

<Camera size={16}/>

</button>



</div>




<h2 className="
mt-4
text-xl
font-bold
">

{user?.name}

</h2>



<p className="text-gray-500">

{user?.role?.name ?? "-"}

</p>



</div>





<hr className="my-6"/>





<div className="space-y-4">



<div className="
flex
gap-3
items-center
">


<Mail className="text-blue-600"/>


<div>

<p className="text-xs text-gray-500">

Email

</p>


<p>

{user?.email}

</p>


</div>


</div>





<div className="
flex
gap-3
items-center
">


<Phone className="text-green-600"/>


<div>

<p className="text-xs text-gray-500">

Phone

</p>


<p>

{user?.phone ?? "-"}

</p>


</div>


</div>






<div className="
flex
gap-3
items-center
">


<MapPin className="text-red-600"/>


<div>

<p className="text-xs text-gray-500">

Country

</p>


<p>

{profile.country ?? "-"}

</p>


</div>


</div>




</div>



</div>








{/* RIGHT CARD */}


<div className="
lg:col-span-2
bg-white
border
rounded-xl
shadow-sm
p-6
">


<h2 className="
text-xl
font-bold
mb-6
">

Basic Information

</h2>



<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
">



<InfoField
label="Full Name"
value={user?.name}
/>


<InfoField
label="Email"
value={user?.email}
/>


<InfoField
label="Phone"
value={user?.phone}
/>


<InfoField
label="Date of Birth"
value={profile.date_of_birth}
/>


<InfoField
label="Gender"
value={profile.gender}
/>


<InfoField
label="Nationality"
value={profile.nationality}
/>


<InfoField
label="City"
value={profile.city}
/>


<InfoField
label="Country"
value={profile.country}
/>



</div>


</div>






</div>


</div>


);


};






const InfoField = ({
    label,
    value
}) => {


return (

<div>

<label className="form-label">

{label}

</label>


<input

value={value ?? "-"}

readOnly

className="
form-input
bg-gray-50
"

/>


</div>


);


};




export default ProfilePage;