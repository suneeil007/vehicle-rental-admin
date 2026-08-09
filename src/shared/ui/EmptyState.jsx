const EmptyState = ({
    message="No data available"
}) => {

    return (

        <div className="
            bg-white
            border
            rounded-xl
            p-10
            text-center
            text-gray-500
        ">

            {message}

        </div>

    );

};


export default EmptyState;