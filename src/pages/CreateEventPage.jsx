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
            venue: "",
            address: "",
            city: "",
            country: "",
        },
        images: [], // This will store the URLs returned from the backend
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
    const [selectedFiles, setSelectedFiles] = useState([]); // State to hold File objects for upload
    const [imagePreviews, setImagePreviews] = useState([]); // State to hold image preview URLs

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

    // Handle file selection and generate previews
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Generate image previews
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let uploadedImageUrls = [];
            // Step 1: Upload images if any are selected
            if (selectedFiles.length > 0) {
                const uploadFormData = new FormData();
                selectedFiles.forEach((file) => {
                    uploadFormData.append("eventImages", file); // 'eventImages' must match the field name in upload.array()
                });

                try {
                    const uploadRes = await axios.post(
                        "/upload/event",
                        uploadFormData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    uploadedImageUrls = uploadRes.data.imageUrls;
                    toast.success("Images uploaded successfully!");
                } catch (uploadError) {
                    console.error("Error uploading images:", uploadError);
                    toast.error("Failed to upload images. Please try again.");
                    setLoading(false);
                    return; // Stop the process if image upload fails
                }
            }

            // Prepare event data with the received image URLs
            const eventData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                category: formData.category,
                location: formData.location, // Pass location directly as object
                images: uploadedImageUrls, // Use the URLs from the upload
                videos: formData.videos,
                // organizer will be set on the backend based on req.user.id
            };

            // Step 2: Create event with image URLs
            const response = await axios.post("/events", eventData);
            const eventId = response.data._id;

            // Step 3: Create tickets separately
            for (const ticket of formData.ticketTypes) {
                await axios.post("/tickets", {
                    event: eventId,
                    name: ticket.name,
                    type: ticket.type,
                    price: ticket.price,
                    quantity: ticket.quantity,
                });
            }

            toast.success("Event created successfully with tickets!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating event or tickets:", error);
            toast.error(
                error.response?.data?.msg || "Failed to create event or tickets"
            );
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

                    {/* Image Upload Section */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            Event Images (Max 5, up to 10MB each, will be
                            optimized to 4K max resolution)
                        </h2>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m-4-4l5.172 5.172a4 4 0 005.656 0L40 32M20 12h.01"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                        <span>Upload files</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            multiple // Allow multiple file selection
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB each
                                </p>
                            </div>
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imagePreviews.map((src, index) => (
                                    <div
                                        key={index}
                                        className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden group"
                                    >
                                        <img
                                            src={src}
                                            alt={`Event Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Optional: Add a remove button for individual previews */}
                                        {/* <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {/* remove logic here */}
                                        {/*}
                                            &times;
                                        </button> */}
                                    </div>
                                ))}
                            </div>
                        )}
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
