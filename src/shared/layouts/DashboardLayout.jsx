import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* Main Area */}
            <div
                className={`
                    min-h-screen
                    flex
                    flex-col
                    transition-all
                    duration-300
                    ease-in-out
                    ${
                        collapsed
                            ? "ml-20"
                            : "ml-72"
                    }
                `}
            >
                <Header />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;