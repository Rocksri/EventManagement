// src/pages/CreateEventPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "",
        location: {
            // Changed to nested object
            venue: "",
            address: "",
            city: "",
            country: "",
        },
        images: [],
        videos: [],
        ticketTypes: [
            {
                name: "General Admission",
                type: "general",
                price: 0,
                quantity: 100,
            },
        ],
    });
    const [loading, setLoading] = useState(false);

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
        ticketTypes[index] = { ...ticketTypes[index], [name]: value };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                category: formData.category,
                location: {
                    venue: formData.venue,
                    address: formData.address,
                    city: formData.city,
                    country: formData.country,
                },
                images: formData.images,
                videos: formData.videos,
                ticketTypes: formData.ticketTypes,
            };

            await axios.post("/events", eventData);
            toast.success("Event created successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Create New Event
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
                                    value={formData.venue}
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
                                    value={formData.address}
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
                                    value={formData.city}
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
                                    value={formData.country}
                                    onChange={handleLocationChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        </div>
                    </div>

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
                            {loading ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;
