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
    const { currentUser, logout } = useAuth(); // Assuming currentUser has the admin's ID

    // Function to fetch all admin data (events and users)
    const fetchData = async () => {
        setLoading(true); // Set loading to true at the start of fetch
        try {
            const [eventsRes, usersRes] = await Promise.all([
                axios.get("/events?status=draft"),
                axios.get("/users"), // Ensure this endpoint is protected by auth + admin middleware
            ]);
            setEvents(eventsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Full error:", error);
            console.log("Response data:", error.response?.data);
            toast.error(
                `Failed to load data: ${
                    error.response?.data?.message || error.message
                }`
            );

            // If the error is 403 or 401, you might want to redirect
            if (
                error.response &&
                (error.response.status === 401 || error.response.status === 403)
            ) {
                logout(); // Log out if unauthorized
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this effect runs once after initial render

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
            // Assuming rejecting an event means deleting it
            await axios.delete(`/events/${eventId}`);
            setEvents(events.filter((event) => event._id !== eventId));
            toast.success("Event rejected successfully");
        } catch (error) {
            console.error("Error rejecting event:", error);
            toast.error("Failed to reject event");
        }
    };

    const deleteUser = async (userId) => {
        // Prevent admin from deleting themselves
        if (currentUser && currentUser.id === userId) {
            toast.error("You cannot delete your own admin account from here.");
            return;
        }
        try {
            await axios.delete(`/users/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            const errorMessage =
                error.response?.data?.msg || "Failed to delete user";
            toast.error(errorMessage);
        }
    };

    // New function to handle user role changes
    const updateUserRole = async (userId, newRole) => {
        // Prevent admin from changing their own role from here
        if (currentUser && currentUser.id === userId) {
            toast.error("You cannot change your own role from here.");
            return;
        }

        try {
            // Make PUT request to backend to update user's role
            // Your backend's userController.js (updateUser) should handle this
            await axios.put(`/users/${userId}`, { role: newRole });

            // Update the local state to reflect the change
            setUsers(
                users.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success(`User role updated to '${newRole}'`);
        } catch (error) {
            console.error("Error updating user role:", error);
            const errorMessage =
                error.response?.data?.msg || "Failed to update user role";
            toast.error(errorMessage);
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
                                    onRoleChange={updateUserRole} // Pass the new role change handler
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
