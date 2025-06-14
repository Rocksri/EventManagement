// src/components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's events
                const eventsRes = await axios.get("/tickets/orders");
                const now = new Date();

                const upcoming = [];
                const past = [];

                eventsRes.data.forEach((order) => {
                    const eventDate = new Date(order.event.date);
                    if (eventDate > now) {
                        upcoming.push(order);
                    } else {
                        past.push(order);
                    }
                });

                setUpcomingEvents(upcoming);
                setPastEvents(past);

                // Fetch tickets
                const ticketsRes = await axios.get("/tickets/orders");
                setTickets(ticketsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const cancelTicket = async (ticketId) => {
        try {
            await axios.delete(`/tickets/${ticketId}`);
            setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
            toast.success("Ticket cancelled successfully");
        } catch (error) {
            console.error("Error cancelling ticket:", error);
            toast.error("Failed to cancel ticket");
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
        <div className="space-y-8">
            {/* Upcoming Events */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Upcoming Events
                    </h2>
                    <Link
                        to="/events"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        Browse more events
                    </Link>
                </div>

                {upcomingEvents.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">
                            You don't have any upcoming events
                        </p>
                        <Link
                            to="/events"
                            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingEvents.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow overflow-hidden"
                            >
                                {order.event.images.length > 0 ? (
                                    <img
                                        src={order.event.images[0]}
                                        alt={order.event.title}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 border-2 border-dashed w-full h-40" />
                                )}

                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900">
                                        {order.event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(
                                            order.event.date
                                        ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>

                                    <div className="mt-4">
                                        <Link
                                            to={`/events/${order.event._id}`}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Event
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tickets */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Your Tickets
                </h2>

                {tickets.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500">
                            You don't have any tickets yet
                        </p>
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
                                            Ticket
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Quantity
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
                                    {tickets.map((order) =>
                                        order.tickets.map((ticket, index) => (
                                            <tr key={`${order._id}-${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.event.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {ticket.ticketId.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        $
                                                        {ticket.price.toFixed(
                                                            2
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {ticket.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Confirmed
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            cancelTicket(
                                                                order._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Past Events
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastEvents.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow overflow-hidden"
                            >
                                {order.event.images.length > 0 ? (
                                    <img
                                        src={order.event.images[0]}
                                        alt={order.event.title}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="bg-gray-200 border-2 border-dashed w-full h-40" />
                                )}

                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900">
                                        {order.event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(
                                            order.event.date
                                        ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>

                                    <div className="mt-4 flex space-x-2">
                                        <Link
                                            to={`/events/${order.event._id}`}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Event
                                        </Link>
                                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                                            Download Ticket
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
