// src/pages/DashboardPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDashboard from "../components/UserDashboard";
import OrganizerDashboard from "../components/OrganizerDashboard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Or process.env.REACT_APP_API_URL for CRA

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState("events");

    if (!currentUser) return null;

    const [previewUrl, setPreviewUrl] = useState(
        currentUser?.profileImage || ""
    );
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            setUploading(true);
            const res = await axios.post(`/upload/profile`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = res.data;

            if (data.imageUrl) {
                setPreviewUrl(data.imageUrl); // this keeps the image visible
            }

        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Dashboard Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                    <div className="flex items-center">
                        <div className="relative w-16 h-16">
                            <label className="cursor-pointer block w-full h-full rounded-xl border-2 border-dashed bg-gray-200 hover:bg-gray-100">
                                {previewUrl ? (
                                    <img
                                        src={
                                            previewUrl.startsWith("http")
                                                ? previewUrl
                                                : `${API_URL}${previewUrl}`
                                        }
                                        alt="Profile"
                                        className="object-cover w-full h-full rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                        Upload
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        {/* #upload img */}
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-white">
                                Welcome back, {currentUser.name}
                            </h1>
                            <p className="text-indigo-200">Dashboard</p>
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
                                activeTab === "Browse more events"
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
