// src/pages/PasswordPage.jsx - Create this new file
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post("/auth/generate-password", {
                email,
            });
            setNewPassword(data.newPassword);
            toast.success("New password generated!");
        } catch (error) {
            console.error("Password generation failed:", error);
            toast.error(
                error.response?.data?.msg || "Failed to generate new password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Generate New Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Back to login
                        </Link>
                    </p>
                </div>

                {newPassword ? (
                    <div className="bg-green-50 p-4 rounded-md">
                        <h3 className="text-lg font-medium text-green-800">
                            Success!
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-green-700">
                                Your new password is:
                                <span className="font-mono bg-green-100 p-1 rounded ml-1">
                                    {newPassword}
                                </span>
                            </p>
                            <p className="mt-2 text-sm text-green-700">
                                Please use this to login and change your
                                password immediately.
                            </p>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label
                                    htmlFor="email-address"
                                    className="sr-only"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading
                                    ? "Generating..."
                                    : "Generate New Password"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordPage;
