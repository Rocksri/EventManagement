// src/components/AdminUsersPanel.jsx
import React, { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

const AdminUsersPanel = ({ users, onDelete, onRoleChange }) => {
    const [editingRole, setEditingRole] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false); // Track update loading state
    const roleOptions = ["attendee", "organizer", "admin"];

    const handleRoleUpdate = async (userId, newRole) => {
        setIsUpdating(true);
        try {
            await onRoleChange(userId, newRole);
            // After successful update, reset editing state
            setEditingRole(null);

            // Refresh the page to reflect changes
            window.location.reload();
        } catch (error) {
            console.error("Role update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (!users || users.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500">
                    No users found
                </h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* Table header remains the same */}
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                User
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Role
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Joined
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {user.profileImage ? (
                                            <img
                                                src={`${API_URL}${user.profileImage}`}
                                                alt="Profile"
                                                className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10"
                                            />
                                        ) : (
                                            <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                                                <span className="text-xs font-bold text-gray-600">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <select
                                            value={
                                                editingRole &&
                                                editingRole.userId === user._id
                                                    ? editingRole.role
                                                    : user.role
                                            }
                                            onChange={(e) =>
                                                setEditingRole({
                                                    userId: user._id,
                                                    role: e.target.value,
                                                })
                                            }
                                            className={`
                                                mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                                                ${
                                                    user.role === "admin"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : user.role ===
                                                          "organizer"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-green-100 text-green-800"
                                                }
                                            `}
                                            disabled={
                                                user.role === "admin" &&
                                                !onRoleChange
                                            }
                                        >
                                            {roleOptions.map((role) => (
                                                <option key={role} value={role}>
                                                    {role
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        {editingRole &&
                                            editingRole.userId === user._id &&
                                            editingRole.role !== user.role && (
                                                <button
                                                    onClick={() =>
                                                        handleRoleUpdate(
                                                            user._id,
                                                            editingRole.role
                                                        )
                                                    }
                                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    disabled={isUpdating}
                                                >
                                                    {isUpdating
                                                        ? "Updating..."
                                                        : "Update"}
                                                </button>
                                            )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onDelete(user._id)}
                                        className="text-red-600 hover:text-red-900"
                                        disabled={user.role === "admin"}
                                    >
                                        {user.role === "admin"
                                            ? "Cannot delete admin"
                                            : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPanel;
