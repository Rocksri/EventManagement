// ProfileManagementPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // Assuming AuthContext is here

const ProfileManagementPage = () => {
    const { currentUser, refreshProfile } = useAuth(); // Destructure refreshProfile
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        // ... other profile fields you allow to update
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || "",
                email: currentUser.email || "",
                // ... set other fields
            });
            setLoading(false);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Use currentUser.id or currentUser._id for the PUT request
            // The error message implies `currentUser._id` might be the correct one based on your backend
            // If your backend uses `id`, stick to `currentUser.id`
            // From your userController.js, it uses `req.params.id`, so `currentUser._id` is likely correct
            await axios.put(`/users/${currentUser._id}`, formData);
            toast.success("Profile updated successfully!");
            await refreshProfile(); // Re-fetch the updated user profile
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (!currentUser) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className="container mx-auto p-4 w-120">
            <h2 className="text-2xl font-bold mb-4">Manage Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled // Email often not directly editable this way, or requires special handling
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default ProfileManagementPage;
