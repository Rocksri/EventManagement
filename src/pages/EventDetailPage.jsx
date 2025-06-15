// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import TicketSelector from "../components/TicketSelector";
import SchedulePreview from "../components/SchedulePreview";

const EventDetailPage = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`/events/${id}`);
                setEvent(data);

                // Check if current user is organizer
                if (currentUser && data.organizer._id === currentUser.id) {
                    setIsOrganizer(true);
                }
            } catch (error) {
                console.error("Error fetching event:", error);

                // Handle 404 specifically
                if (error.response?.status === 404) {
                    toast.error("Event not found or has been removed");
                    navigate("/events");
                } else {
                    toast.error("Failed to load event details");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, currentUser]);

    const handleTicketSelection = (ticketId, quantity) => {
        setSelectedTickets((prev) => {
            const existing = prev.find((t) => t.ticketId === ticketId);
            if (existing) {
                if (quantity === 0) {
                    return prev.filter((t) => t.ticketId !== ticketId);
                }
                return prev.map((t) =>
                    t.ticketId === ticketId ? { ...t, quantity } : t
                );
            } else if (quantity > 0) {
                return [...prev, { ticketId, quantity }];
            }
            return prev;
        });
    };

    const handlePurchase = () => {
        if (!currentUser) {
            toast.error("Please login to purchase tickets");
            navigate("/login");
            return;
        }

        if (selectedTickets.length === 0) {
            toast.error("Please select at least one ticket");
            return;
        }

        navigate("/payment", {
            state: {
                eventId: id,
                tickets: selectedTickets,
            },
        });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Event not found
                    </h1>
                    <p className="mt-4 text-gray-500">
                        The event you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <Link
                        to="/events"
                        className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
                    >
                        Browse Events
                    </Link>
                </div>
            </div>
        );
    }

    const totalPrice = selectedTickets.reduce((sum, item) => {
        const ticket = event.ticketTypes.find((t) => t._id === item.ticketId);
        return sum + (ticket ? ticket.price * item.quantity : 0);
    }, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Event Header */}
                <div className="relative">
                    {event.images.length > 0 ? (
                        <img
                            src={event.images[0]}
                            alt={event.title}
                            className="w-full h-96 object-cover"
                        />
                    ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <h1 className="text-3xl font-bold text-white">
                            {event.title}
                        </h1>
                        <p className="text-indigo-200 mt-2">
                            {event.organizer.name}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {event.category}
                                </div>
                                <div className="text-gray-500">
                                    <svg
                                        className="w-4 h-4 inline mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        ></path>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        ></path>
                                    </svg>
                                    {event.location.venue},{" "}
                                    {event.location.city}
                                </div>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {new Date(event.date).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                About This Event
                            </h2>
                            <p className="text-gray-700">{event.description}</p>
                        </div>

                        {/* Schedule Preview */}
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Event Schedule
                            </h2>
                            <SchedulePreview eventId={id} />
                            <Link
                                to={`/schedules/${id}`}
                                className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
                            >
                                View full schedule
                            </Link>
                        </div>

                        {/* Organizer Actions */}
                        {isOrganizer && (
                            <div className="mt-8 border-t pt-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Organizer Tools
                                </h2>
                                <div className="flex space-x-4">
                                    <Link
                                        to={`/analytics/${id}`}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        View Analytics
                                    </Link>
                                    <Link
                                        to={`/schedules/${id}`}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium"
                                    >
                                        Manage Schedule
                                    </Link>
                                    <Link
                                        to={`/events/${id}/edit`}
                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium"
                                    >
                                        Edit Event
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Ticket Purchase */}
                    <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Get Tickets
                        </h2>

                        <TicketSelector
                            ticketTypes={event.ticketTypes}
                            onSelectionChange={handleTicketSelection}
                        />

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Total</span>
                                <span className="text-xl font-bold">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handlePurchase}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
                                disabled={selectedTickets.length === 0}
                            >
                                Checkout
                            </button>

                            <p className="text-gray-500 text-sm mt-4 text-center">
                                Secure payment processing powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
