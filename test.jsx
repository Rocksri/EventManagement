// src/components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import DownloadTicketButton from "./DownloadTicketButton";

const UserDashboard = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL; // Or process.env.REACT_APP_API_URL for CRA

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersRes = await axios.get("/tickets/orders");
                const now = new Date();

                const upcomingOrders = [];
                const pastOrders = [];

                ordersRes.data.forEach((order) => {
                    if (order.event && order.event.date) {
                        const eventDate = new Date(order.event.date);
                        if (eventDate > now) {
                            upcomingOrders.push(order);
                        } else {
                            pastOrders.push(order);
                        }
                    }
                });

                setUpcomingEvents(upcomingOrders);
                setPastEvents(pastOrders);
                setTickets(ordersRes.data); // Keep this if 'tickets' state is intentionally for all orders
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error(
                    error.response?.data?.msg ||
                        "Failed to fetch dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500">
                    Loading dashboard...
                </h3>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                My Dashboard
            </h1>

            {/* Upcoming Events Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Upcoming Events
                </h2>
                {upcomingEvents.length === 0 ? (
                    <p className="text-gray-600">
                        You have no upcoming events.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <Link to={`/events/${order.event._id}`}>
                                    {order.event.images &&
                                    order.event.images.length > 0 ? (
                                        <img
                                            className="h-48 w-full object-cover"
                                            src={`${API_URL}${order.event.images[0]}`}
                                            alt={order.event.title}
                                        />
                                    ) : (
                                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                        {order.event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        <span className="font-medium">
                                            Date:
                                        </span>{" "}
                                        {format(
                                            new Date(order.event.date),
                                            "MMM dd, yyyy"
                                        )}{" "}
                                        at {order.event.time}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">
                                            Location:
                                        </span>{" "}
                                        {order.event.location.venue},{" "}
                                        {order.event.location.city}
                                    </p>
                                    {order.tickets &&
                                        order.tickets.length > 0 && (
                                            <div className="mt-3 text-sm text-gray-700">
                                                <p className="font-medium mb-1">
                                                    Your Tickets:
                                                </p>
                                                {order.tickets.map(
                                                    (ticket, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span>
                                                                {
                                                                    ticket.quantity
                                                                }{" "}
                                                                x{" "}
                                                                {ticket
                                                                    .ticketId
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </span>
                                                            <DownloadTicketButton
                                                                order={order}
                                                                ticket={
                                                                    ticket
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Events Section */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Past Events
                </h2>
                {pastEvents.length === 0 ? (
                    <p className="text-gray-600">
                        You have no past events.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastEvents.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <Link to={`/events/${order.event._id}`}>
                                    {order.event.images &&
                                    order.event.images.length > 0 ? (
                                        <img
                                            className="h-48 w-full object-cover"
                                            src={`${API_URL}${order.event.images[0]}`}
                                            alt={order.event.title}
                                        />
                                    ) : (
                                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                        {order.event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        <span className="font-medium">
                                            Date:
                                        </span>{" "}
                                        {format(
                                            new Date(order.event.date),
                                            "MMM dd, yyyy"
                                        )}{" "}
                                        at {order.event.time}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">
                                            Location:
                                        </span>{" "}
                                        {order.event.location.venue},{" "}
                                        {order.event.location.city}
                                    </p>
                                    {order.tickets &&
                                        order.tickets.length > 0 && (
                                            <div className="mt-3 text-sm text-gray-700">
                                                <p className="font-medium mb-1">
                                                    Your Tickets:
                                                </p>
                                                {order.tickets.map(
                                                    (ticket, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span>
                                                                {
                                                                    ticket.quantity
                                                                }{" "}
                                                                x{" "}
                                                                {ticket
                                                                    .ticketId
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </span>
                                                            <DownloadTicketButton
                                                                order={order}
                                                                ticket={
                                                                    ticket
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
