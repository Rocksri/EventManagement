// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminEventsPanel from "../components/AdminEventsPanel";
import AdminUsersPanel from "../components/AdminUsersPanel";
import AdminAnalyticsPanel from "../components/AdminAnalyticsPanel";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, usersRes] = await Promise.all([
                    axios.get("/events?status=draft"),
                    axios.get("/users"),
                ]);
                setEvents(eventsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const approveEvent = async (eventId) => {
        try {
            await axios.put(`/events/${eventId}`, { status: "published" });
            setEvents(events.filter((event) => event._id !== eventId));
            toast.success("Event approved successfully");
        } catch (error) {
            console.error("Error approving event:", error);
            toast.error("Failed to approve event");
        }
    };

    const rejectEvent = async (eventId) => {
        try {
            await axios.delete(`/events/${eventId}`);
            setEvents(events.filter((event) => event._id !== eventId));
            toast.success("Event rejected successfully");
        } catch (error) {
            console.error("Error rejecting event:", error);
            toast.error("Failed to reject event");
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`/users/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Admin Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
                    <h1 className="text-2xl font-bold text-white">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Admin Tabs */}
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
                            Pending Events
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === "users"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                activeTab === "analytics"
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            Platform Analytics
                        </button>
                    </nav>
                </div>

                {/* Admin Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === "events" && (
                                <AdminEventsPanel
                                    events={events}
                                    onApprove={approveEvent}
                                    onReject={rejectEvent}
                                />
                            )}

                            {activeTab === "users" && (
                                <AdminUsersPanel
                                    users={users}
                                    onDelete={deleteUser}
                                />
                            )}

                            {activeTab === "analytics" && (
                                <AdminAnalyticsPanel />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
