// ProfileManagementPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // Assuming AuthContext is here

const ProfileManagementPage = () => {
    const { currentUser, refreshProfile, updatePassword } = useAuth(); // Destructure refreshProfile and updatePassword
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: {
            fullAddress: "",
            zip: "",
        },
        dob: "",
        phone: "",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [loading, setLoading] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || "",
                email: currentUser.email || "",
                address: {
                    fullAddress: currentUser.address?.fullAddress || "",
                    zip: currentUser.address?.zip || "",
                },
                // Format DOB for input type="date"
                dob: currentUser.dob
                    ? new Date(currentUser.dob).toISOString().split("T")[0]
                    : "",
                phone: currentUser.phone || "",
            });
            setLoading(false);
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name.split(".")[1]]: value,
                },
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatePayload = {
                name: formData.name,
                address: formData.address,
                dob: formData.dob,
                phone: formData.phone,
                // Email is often not directly editable or requires special handling
                // email: formData.email,
            };

            await axios.put(`/users/${currentUser._id}`, updatePayload);
            toast.success("Profile updated successfully!");
            await refreshProfile(); // Refresh currentUser in AuthContext
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(
                error.response?.data?.msg || "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error("New passwords do not match.");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            setPasswordLoading(false);
            return;
        }

        try {
            await updatePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            toast.success("Password updated successfully!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (error) {
            console.error("Password update failed:", error);
            toast.error(
                error.response?.data?.msg || "Failed to update password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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

                {/* New fields for profile update */}
                <div>
                    <label
                        htmlFor="fullAddress"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Full Address
                    </label>
                    <textarea
                        id="fullAddress"
                        name="address.fullAddress"
                        rows="3"
                        value={formData.address.fullAddress}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>
                <div>
                    <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Zip Code
                    </label>
                    <input
                        type="text"
                        id="zip"
                        name="address.zip"
                        value={formData.address.zip}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

            {/* Password Change Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmNewPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                        {passwordLoading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileManagementPage;
