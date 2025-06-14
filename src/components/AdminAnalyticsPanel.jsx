// src/components/AdminAnalyticsPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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

const AdminAnalyticsPanel = () => {
    const [analytics, setAnalytics] = useState(null);
    const [timeRange, setTimeRange] = useState("month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(
                    `/analytics/admin?range=${timeRange}`
                );
                setAnalytics(data);
            } catch (error) {
                console.error("Error fetching admin analytics:", error);
                toast.error("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Prepare data for charts
    const eventsData = {
        labels: analytics?.eventsOverTime.map((item) => item.period) || [],
        datasets: [
            {
                label: "Events Created",
                data: analytics?.eventsOverTime.map((item) => item.count) || [],
                backgroundColor: "rgba(79, 70, 229, 0.8)",
            },
        ],
    };

    const revenueData = {
        labels: analytics?.revenueOverTime.map((item) => item.period) || [],
        datasets: [
            {
                label: "Revenue ($)",
                data:
                    analytics?.revenueOverTime.map((item) => item.amount) || [],
                backgroundColor: "rgba(16, 185, 129, 0.8)",
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Time Range Selector */}
            <div className="flex justify-end">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        onClick={() => setTimeRange("week")}
                        className={`px-4 py-2 text-sm font-medium ${
                            timeRange === "week"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } border border-gray-200 rounded-l-lg`}
                    >
                        Weekly
                    </button>
                    <button
                        type="button"
                        onClick={() => setTimeRange("month")}
                        className={`px-4 py-2 text-sm font-medium ${
                            timeRange === "month"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } border-t border-b border-gray-200`}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => setTimeRange("year")}
                        className={`px-4 py-2 text-sm font-medium ${
                            timeRange === "year"
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                        } border border-gray-200 rounded-r-md`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
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
                                Total Users
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.totalUsers || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Events Created
                    </h3>
                    <Bar
                        data={eventsData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: "top",
                                },
                                title: {
                                    display: true,
                                    text: `Events Over ${
                                        timeRange === "week"
                                            ? "the Last Week"
                                            : timeRange === "month"
                                            ? "the Last Month"
                                            : "the Last Year"
                                    }`,
                                },
                            },
                        }}
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Revenue
                    </h3>
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
                                    text: `Revenue Over ${
                                        timeRange === "week"
                                            ? "the Last Week"
                                            : timeRange === "month"
                                            ? "the Last Month"
                                            : "the Last Year"
                                    }`,
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Top Categories
                    </h3>
                    <div className="space-y-4">
                        {analytics?.topCategories.map((category, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <span className="text-gray-700">
                                    {category._id}
                                </span>
                                <div className="flex items-center">
                                    <span className="text-gray-900 font-medium mr-2">
                                        {category.count} events
                                    </span>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                                        {(
                                            (category.count /
                                                analytics.totalEvents) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        User Distribution
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Attendees</span>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-medium mr-2">
                                    {analytics?.attendeeCount || 0}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {analytics?.totalUsers
                                        ? (
                                              (analytics.attendeeCount /
                                                  analytics.totalUsers) *
                                              100
                                          ).toFixed(1)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Organizers</span>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-medium mr-2">
                                    {analytics?.organizerCount || 0}
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {analytics?.totalUsers
                                        ? (
                                              (analytics.organizerCount /
                                                  analytics.totalUsers) *
                                              100
                                          ).toFixed(1)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Admins</span>
                            <div className="flex items-center">
                                <span className="text-gray-900 font-medium mr-2">
                                    {analytics?.adminCount || 0}
                                </span>
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">
                                    {analytics?.totalUsers
                                        ? (
                                              (analytics.adminCount /
                                                  analytics.totalUsers) *
                                              100
                                          ).toFixed(1)
                                        : 0}
                                    %
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalyticsPanel;
