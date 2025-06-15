// src/components/OrganizerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch organizer's events
                const eventsRes = await axios.get("/events?organizer=me");
                setEvents(eventsRes.data);

                // Fetch organizer analytics
                const analyticsRes = await axios.get("/analytics/organizer");
                setAnalytics(analyticsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteEvent = async (eventId) => {
        try {
            await axios.delete(`/events/${eventId}`);
            setEvents(events.filter((event) => event._id !== eventId));
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Prepare data for chart
    const revenueData = {
        labels: ["Total Revenue", "Avg Per Event"],
        datasets: [
            {
                label: "Revenue ($)",
                data: [
                    analytics?.totalRevenue || 0,
                    analytics?.avgRevenuePerEvent || 0,
                ],
                backgroundColor: "rgba(79, 70, 229, 0.8)",
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-lg">
                            <svg
                                className="w-6 h-6 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-500">
                                Total Events
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.totalEvents || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-500">
                                Total Revenue
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                ${analytics?.totalRevenue?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                ></path>
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-500">
                                Total Attendees
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.totalAttendees || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Chart */}
            {analytics && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Revenue Overview
                    </h2>
                    <Bar
                        data={revenueData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: "top",
                                },
                                title: {
                                    display: true,
                                    text: "Revenue Breakdown",
                                },
                            },
                        }}
                    />
                </div>
            )}

            {/* Events Management */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Your Events
                    </h2>
                    <Link
                        to="/create-event"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">
                            You haven't created any events yet
                        </p>
                        <Link
                            to="/create-event"
                            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Create Your First Event
                        </Link>
                    </div>
                ) : (
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
                                            Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Status
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
                                                            src={
                                                                event.images[0]
                                                            }
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
                                                            {
                                                                event.location
                                                                    .city
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    event.date
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        event.status ===
                                                        "published"
                                                            ? "bg-green-100 text-green-800"
                                                            : event.status ===
                                                              "draft"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {event.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        event.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    to={`/events/${event._id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        deleteEvent(event._id)
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-indigo-900 mb-3">
                        Need to manage attendees?
                    </h3>
                    <p className="text-indigo-700 mb-4">
                        Export attendee lists, check in guests, and manage
                        registrations.
                    </p>
                    <Link
                        to="#"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Manage Attendees
                    </Link>
                </div>

                <div className="bg-green-50 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-green-900 mb-3">
                        Analyze event performance
                    </h3>
                    <p className="text-green-700 mb-4">
                        Track ticket sales, attendance rates, and revenue
                        metrics.
                    </p>
                    <Link
                        to="#"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                        View Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
