// src/components/AdminEventsPanel.jsx
import React from "react";

const AdminEventsPanel = ({ events, onApprove, onReject }) => {
    if (!events || events.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500">
                    No pending events
                </h3>
                <p className="mt-2 text-gray-500">
                    All events have been reviewed
                </p>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Event
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Organizer
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Category
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
                        {events.map((event) => (
                            <tr key={event._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {event.images.length > 0 ? (
                                            <img
                                                className="h-10 w-10 rounded-md object-cover"
                                                src={event.images[0]}
                                                alt={event.title}
                                            />
                                        ) : (
                                            <div className="bg-gray-200 border-2 border-dashed rounded-md w-10 h-10" />
                                        )}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {event.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {event.location.city}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {event.organizer.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {event.organizer.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                        {event.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onApprove(event._id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        disabled={event.status === "published"}
                                    >
                                        {event.status === "published"
                                            ? "Approved"
                                            : "Approve"}
                                    </button>
                                    <button
                                        onClick={() => onReject(event._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Reject
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

export default AdminEventsPanel;
