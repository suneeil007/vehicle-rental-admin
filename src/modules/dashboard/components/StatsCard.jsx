const StatsCard = ({ title, value, color = "blue" }) => {
    return (
        <div className="bg-white rounded-xl shadow border p-6">

            <p className="text-gray-500 text-sm">
                {title}
            </p>

            <h2 className={`text-3xl font-bold mt-3 text-${color}-600`}>
                {value}
            </h2>

        </div>
    );
};

export default StatsCard;