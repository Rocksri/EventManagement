// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AnalyticsPage = () => {
    const { eventId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get(
                    `/analytics/events/${eventId}`
                );
                setAnalytics(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [eventId]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Analytics not available
                    </h1>
                    <p className="mt-4 text-gray-500">
                        There is no analytics data for this event.
                    </p>
                </div>
            </div>
        );
    }

    // Prepare data for charts
    const ticketSalesData = {
        labels: analytics.ticketSales.map((t) => t.name),
        datasets: [
            {
                label: "Tickets Sold",
                data: analytics.ticketSales.map((t) => t.sold),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                ],
            },
        ],
    };

    const revenueData = {
        labels: analytics.ticketSales.map((t) => t.name),
        datasets: [
            {
                label: "Revenue ($)",
                data: analytics.ticketSales.map((t) => t.revenue),
                backgroundColor: "rgba(79, 70, 229, 0.8)",
            },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Event Analytics: {analytics.event}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Total Sales
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                        ${analytics.totalSales.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Tickets Sold
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.ticketsSold}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Attendance Rate
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.attendanceRate}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Ticket Sales
                    </h2>
                    <Pie data={ticketSalesData} />
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Revenue by Ticket Type
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
                                    text: "Revenue Distribution",
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
