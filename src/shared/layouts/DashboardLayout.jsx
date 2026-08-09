import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">

            <Sidebar />

            <div className="flex flex-col flex-1">

                <Header />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;