// src/components/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { format } from "date-fns"; // Import format for consistent date display
import DownloadTicketButton from "./DownloadTicketButton"; // Import the new component

const UserDashboard = () => {
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [tickets, setTickets] = useState([]); // This state seems to store all orders, potentially redundant with upcoming/past.
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's orders (which include basic event info)
                const ordersRes = await axios.get("/tickets/orders");
                const now = new Date();

                const upcomingOrders = [];
                const pastOrders = [];

                // Separate orders into upcoming and past based on event date
                ordersRes.data.forEach((order) => {
                    // Ensure order.event exists and has a date before processing
                    if (order.event && order.event.date) {
                        const eventDate = new Date(order.event.date);
                        if (eventDate > now) {
                            upcomingOrders.push(order);
                        } else {
                            pastOrders.push(order);
                        }
                    }
                });

                // Function to fetch full event details and attach them to each order
                const enrichOrdersWithEventDetails = async (ordersArray) => {
                    const enrichedOrders = await Promise.all(
                        ordersArray.map(async (order) => {
                            // Ensure order.event exists and has an _id before attempting to fetch
                            if (order.event && order.event._id) {
                                try {
                                    // Fetch full event details using the event ID from the order
                                    const eventDetailsRes = await axios.get(
                                        `/events/${order.event._id}`
                                    );
                                    // Return a new order object with the full event details replacing the basic one
                                    return {
                                        ...order,
                                        event: eventDetailsRes.data,
                                    };
                                } catch (eventFetchError) {
                                    console.error(
                                        `Error fetching full event details for ID ${order.event._id}:`,
                                        eventFetchError
                                    );
                                    // If fetching full event details fails, keep the order with its existing (basic) event data
                                    return order;
                                }
                            }
                            return order; // If order.event or order.event._id is missing, return order as is
                        })
                    );
                    return enrichedOrders;
                };

                // Enrich both upcoming and past orders with full event details
                const enrichedUpcomingEvents =
                    await enrichOrdersWithEventDetails(upcomingOrders);
                const enrichedPastEvents = await enrichOrdersWithEventDetails(
                    pastOrders
                );

                setUpcomingEvents(enrichedUpcomingEvents);
                setPastEvents(enrichedPastEvents);
                // Set tickets state (if it's intended to hold all orders, otherwise reconsider this line)
                setTickets(ordersRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once after initial render

    const cancelTicket = async (orderId, ticketIndex) => {
        try {
            await axios.put(`/tickets/orders/${orderId}/cancel-ticket`, {
                ticketIndex,
            });
            // Update state to remove the ticket
            // This logic assumes `tickets` state holds all orders and is being used
            // for the "Your Tickets" table. You might need to update upcoming/pastEvents as well
            setTickets(
                tickets.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              tickets: order.tickets.filter(
                                  (_, i) => i !== ticketIndex
                              ),
                          }
                        : order
                )
            );
            toast.success("Ticket cancelled successfully");
            // Consider refetching or updating upcoming/pastEvents states here if needed
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
        <div className="space-y-8 p-4">
            {" "}
            {/* Added padding to the main container */}
            {/* Upcoming Events */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Upcoming Events
                    </h2>
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
                                {/* Display event image from order.event.images */}
                                {order.event?.images &&
                                order.event.images.length > 0 ? (
                                    <img
                                        src={`${API_URL}${order.event.images[0]}`}
                                        alt={order.event.title || "Event Image"}
                                        className="w-full h-40 object-contain"
                                    />
                                ) : (
                                    <div className="bg-gray-200 border-2 border-dashed w-full h-40 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900">
                                        {order.event?.title ||
                                            "Event Title N/A"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.event?.date
                                            ? format(
                                                  new Date(order.event.date),
                                                  "MMM dd, yyyy"
                                              )
                                            : "Date N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.event?.time || "Time N/A"}
                                    </p>

                                    <div className="mt-4">
                                        <Link
                                            to={
                                                order.event?._id
                                                    ? `/events/${order.event._id}`
                                                    : "#"
                                            }
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Event
                                        </Link>
                                    </div>

                                    {/* Display tickets for download */}
                                    {order.tickets &&
                                        order.tickets.length > 0 && (
                                            <div className="mt-4 border-t pt-4">
                                                <h4 className="font-medium text-gray-800 mb-2">
                                                    Your Tickets:
                                                </h4>
                                                {order.tickets.map(
                                                    (ticket, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center text-sm mb-2"
                                                        >
                                                            <span>
                                                                {
                                                                    ticket.quantity
                                                                }{" "}
                                                                x{" "}
                                                                {ticket.ticketId
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </span>
                                                            <DownloadTicketButton
                                                                order={order}
                                                                ticket={ticket}
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
            {/* Tickets (consolidated view of all purchased tickets) */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Your Tickets (All Orders)
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
                                    {/* Flatten the orders to display each individual ticket in the table */}
                                    {tickets.flatMap((order) =>
                                        order.tickets.map((ticket, index) => (
                                            <tr key={`${order._id}-${index}`}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.event?.title ||
                                                            "Event Title N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.event?.date
                                                            ? format(
                                                                  new Date(
                                                                      order.event.date
                                                                  ),
                                                                  "MMM dd, yyyy"
                                                              )
                                                            : "Date N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {ticket.ticketId
                                                            ?.name || "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        $
                                                        {ticket.ticketId?.price?.toFixed(
                                                            2
                                                        ) || "0.00"}
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2 items-center">
                                                    <button
                                                        onClick={() =>
                                                            cancelTicket(
                                                                order._id,
                                                                index
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                    {/* Download button for each ticket in the table */}
                                                    <DownloadTicketButton
                                                        order={order}
                                                        ticket={ticket}
                                                    />
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
                                {/* Display event image from order.event.images */}
                                {order.event?.images &&
                                order.event.images.length > 0 ? (
                                    <img
                                        src={`${API_URL}${order.event.images[0]}`}
                                        alt={order.event.title || "Event Image"}
                                        className="w-full h-40 object-contain"
                                    />
                                ) : (
                                    <div className="bg-gray-200 border-2 border-dashed w-full h-40 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}

                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900">
                                        {order.event?.title ||
                                            "Event Title N/A"}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.event?.date
                                            ? format(
                                                  new Date(order.event.date),
                                                  "MMM dd, yyyy"
                                              )
                                            : "Date N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {order.event?.time || "Time N/A"}
                                    </p>

                                    <div className="mt-4 flex space-x-2">
                                        <Link
                                            to={
                                                order.event?._id
                                                    ? `/events/${order.event._id}`
                                                    : "#"
                                            }
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Event
                                        </Link>
                                    </div>

                                    {/* Display tickets for download in Past Events section */}
                                    {order.tickets &&
                                        order.tickets.length > 0 && (
                                            <div className="mt-4 border-t pt-4">
                                                <h4 className="font-medium text-gray-800 mb-2">
                                                    Your Tickets:
                                                </h4>
                                                {order.tickets.map(
                                                    (ticket, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex justify-between items-center text-sm mb-2"
                                                        >
                                                            <span>
                                                                {
                                                                    ticket.quantity
                                                                }{" "}
                                                                x{" "}
                                                                {ticket.ticketId
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </span>
                                                            {/* Corrected: Pass individual ticket to DownloadTicketButton */}
                                                            <DownloadTicketButton
                                                                order={order}
                                                                ticket={ticket}
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
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
