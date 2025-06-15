import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ScheduleEditor from "../components/ScheduleEditor"; // Import ScheduleEditor

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "",
        location: {
            venue: "",
            address: "",
            city: "",
            country: "",
        },
        images: [],
        videos: [],
        ticketTypes: [],
        schedule: { sessions: [] }, // Initialize schedule with an empty sessions array
        status: "draft",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventAndSchedule = async () => {
            // Renamed to fetch both
            try {
                const eventRes = await axios.get(`/events/${id}`);
                const eventData = eventRes.data;

                // Verify current user is the organizer
                if (
                    eventData.organizer._id !== currentUser.id &&
                    currentUser.role !== "admin"
                ) {
                    toast.error("You are not authorized to edit this event");
                    navigate("/");
                    return;
                }

                // Fetch schedule
                let scheduleSessions = [];
                try {
                    const scheduleRes = await axios.get(`/schedules/${id}`);
                    if (scheduleRes.data && scheduleRes.data.sessions) {
                        scheduleSessions = scheduleRes.data.sessions;
                        // For display in ScheduleEditor, ensure startTime/endTime are "HH:MM"
                        // Mongoose stores as Date objects, so we need to convert back
                        scheduleSessions = scheduleSessions.map((session) => ({
                            ...session,
                            startTime: new Date(session.startTime)
                                .toTimeString()
                                .slice(0, 5),
                            endTime: new Date(session.endTime)
                                .toTimeString()
                                .slice(0, 5),
                        }));
                    }
                } catch (scheduleError) {
                    // It's okay if schedule doesn't exist yet, initialize with empty
                    if (
                        scheduleError.response &&
                        scheduleError.response.status === 404
                    ) {
                        console.log(
                            "No schedule found for this event, initializing empty."
                        );
                        scheduleSessions = [];
                    } else {
                        console.error(
                            "Error fetching schedule:",
                            scheduleError
                        );
                        toast.error("Failed to load schedule data");
                    }
                }

                setFormData({
                    title: eventData.title,
                    description: eventData.description,
                    date: new Date(eventData.date).toISOString().split("T")[0],
                    time: eventData.time,
                    category: eventData.category,
                    location: eventData.location,
                    images: eventData.images,
                    videos: eventData.videos,
                    ticketTypes: eventData.ticketTypes,
                    schedule: { sessions: scheduleSessions }, // Set fetched sessions
                    status: eventData.status || "draft",
                });
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event data");
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndSchedule();
    }, [id, currentUser, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            location: { ...prev.location, [name]: value },
        }));
    };

    const handleTicketChange = (index, e) => {
        const { name, value } = e.target;
        const ticketTypes = [...formData.ticketTypes];
        ticketTypes[index] = {
            ...ticketTypes[index],
            // Convert price and quantity to numbers
            [name]: ["price", "quantity"].includes(name)
                ? Number(value)
                : value,
        };
        setFormData((prev) => ({ ...prev, ticketTypes }));
    };

    const addTicketType = () => {
        setFormData((prev) => ({
            ...prev,
            ticketTypes: [
                ...prev.ticketTypes,
                { name: "", type: "general", price: 0, quantity: 100 },
            ],
        }));
    };

    const removeTicketType = (index) => {
        const ticketTypes = formData.ticketTypes.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, ticketTypes }));
    };

    // New function to handle saving the schedule received from ScheduleEditor
    const handleSaveSchedule = async (updatedSessions) => {
        setLoading(true); // Indicate loading while saving schedule
        try {
            // The scheduleController expects 'event' and 'sessions'
            await axios.post("/api/schedules", {
                event: id, // Pass the event ID
                sessions: updatedSessions.map((session) => ({
                    ...session,
                    // Convert "HH:MM" strings to Date objects for the backend
                    // Assuming the event's date is relevant, otherwise use a dummy date like "2000-01-01"
                    startTime: new Date(
                        `${formData.date}T${session.startTime}:00`
                    ),
                    endTime: new Date(`${formData.date}T${session.endTime}:00`),
                })),
            });
            toast.success("Schedule updated successfully!");
            // Update formData to reflect the saved schedule
            setFormData((prev) => ({
                ...prev,
                schedule: { sessions: updatedSessions },
            }));
        } catch (error) {
            console.error(
                "Error updating schedule:",
                error.response ? error.response.data : error.message
            );
            toast.error("Failed to update schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Ensure the data sent matches your backend's expected schema for update
            const eventDataToUpdate = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                category: formData.category,
                location: formData.location,
                images: formData.images,
                videos: formData.videos,
                ticketTypes: formData.ticketTypes.map((ticket) => ({
                    ...ticket,
                    price: Number(ticket.price), // Ensure numbers are sent as numbers
                    quantity: Number(ticket.quantity), // Ensure numbers are sent as numbers
                })),
                status: formData.status, // Include status in update
            };

            await axios.put(`/events/${id}`, eventDataToUpdate);
            toast.success("Event updated successfully!");
            // No need to navigate away, just confirm update
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Failed to update event");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Edit Event: {formData.title}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Event Information */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Event Information
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Technology">
                                        Technology
                                    </option>
                                    <option value="Business">Business</option>
                                    <option value="Music">Music</option>
                                    <option value="Food & Drink">
                                        Food & Drink
                                    </option>
                                    <option value="Health & Wellness">
                                        Health & Wellness
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="date"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="time"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Time
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    id="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            {/* New: Status Field for Edit Page */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Event Status
                                </label>
                                <select
                                    name="status"
                                    id="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Location
                        </h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="venue"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Venue Name
                                </label>
                                <input
                                    type="text"
                                    name="venue"
                                    id="venue"
                                    value={formData.location.venue}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={formData.location.address}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    id="city"
                                    value={formData.location.city}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    id="country"
                                    value={formData.location.country}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Schedule Editor Component */}
                    <ScheduleEditor
                        sessions={formData.schedule.sessions}
                        onSave={handleSaveSchedule}
                        onCancel={() => {
                            /* Implement cancel logic if needed */
                        }}
                        eventId={id} // Pass the event ID to ScheduleEditor
                    />

                    {/* Ticket Information */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                Ticket Types
                            </h2>
                            <button
                                type="button"
                                onClick={addTicketType}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Add Ticket Type
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.ticketTypes.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Ticket Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={ticket.name}
                                                onChange={(e) =>
                                                    handleTicketChange(index, e)
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Price ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={ticket.price}
                                                onChange={(e) =>
                                                    handleTicketChange(index, e)
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={ticket.quantity}
                                                onChange={(e) =>
                                                    handleTicketChange(index, e)
                                                }
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTicketType(index)
                                            }
                                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            {loading ? "Updating..." : "Update Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventPage;
