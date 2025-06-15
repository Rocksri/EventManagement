// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "../components/UserDashboard";
import OrganizerDashboard from "../components/OrganizerDashboard";

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("events");

    if (!currentUser) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                    <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, {currentUser.name}
                            </h1>
                            <p className="text-indigo-200">
                                {currentUser.role === "organizer"
                                    ? "Organizer"
                                    : "Attendee"}{" "}
                                Dashboard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab("events")}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === "events"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            My Events
                        </button>
                        <Link
                            to="/events"
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === "events"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Browse more events
                        </Link>
                        {currentUser.role === "organizer" && (
                            <button
                                onClick={() => setActiveTab("organizer")}
                                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                    activeTab === "organizer"
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Organizer Tools
                            </button>
                        )}
                    </nav>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                    {activeTab === "events" && <UserDashboard />}
                    {activeTab === "tickets" && <div>Tickets View</div>}
                    {activeTab === "organizer" &&
                        currentUser.role === "organizer" && (
                            <OrganizerDashboard />
                        )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
