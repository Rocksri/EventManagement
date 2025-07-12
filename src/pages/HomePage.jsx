// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import SearchFilters from "../components/SearchFilters";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get("/events");
                // Ensure events have ticketTypes
                const eventsWithTickets = await Promise.all(
                    data.map(async (event) => {
                        if (
                            !event.ticketTypes ||
                            event.ticketTypes.length === 0
                        ) {
                            const ticketsRes = await axios.get(
                                `/tickets/event/${event._id}`
                            );
                            return { ...event, ticketTypes: ticketsRes.data };
                        }
                        return event;
                    })
                );

                // ... rest of category/location extraction ...
                const uniqueCategories = [
                    ...new Set(data.map((event) => event.category)),
                ];
                const uniqueLocations = [
                    ...new Set(data.map((event) => event.location.city)),
                ];
                setCategories(uniqueCategories);
                setLocations(uniqueLocations);
                setEvents(eventsWithTickets);
                setFilteredEvents(eventsWithTickets);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [setFilteredEvents, setEvents, setCategories, setLocations]);

    const handleSearch = (filters) => {
        let result = [...events];

        if (filters.search) {
            result = result.filter(
                (event) =>
                    event.title
                        .toLowerCase()
                        .includes(filters.search.toLowerCase()) ||
                    event.description
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())
            );
        }

        if (filters.category) {
            result = result.filter(
                (event) => event.category === filters.category
            );
        }

        if (filters.location) {
            result = result.filter(
                (event) => event.location.city === filters.location
            );
        }

        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            result = result.filter((event) => new Date(event.date) >= fromDate);
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            result = result.filter((event) => new Date(event.date) <= toDate);
        }

        if (filters.minPrice) {
            result = result.filter((event) => {
                const minTicketPrice = Math.min(
                    ...event.ticketTypes.map((t) => t.price)
                );
                return minTicketPrice >= filters.minPrice;
            });
        }

        if (filters.maxPrice) {
            result = result.filter((event) => {
                const maxTicketPrice = Math.max(
                    ...event.ticketTypes.map((t) => t.price)
                );
                return maxTicketPrice <= filters.maxPrice;
            });
        }

        setFilteredEvents(result);
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="bg-indigo-700 rounded-xl p-8 mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Discover Amazing Events
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                    Find, create, and manage events with our powerful event
                    management platform
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/events"
                        className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium"
                    >
                        Browse Events
                    </Link>
                    <Link
                        to="/create-event"
                        className="bg-indigo-600 text-white hover:bg-indigo-800 px-6 py-3 rounded-lg font-medium"
                    >
                        Create Event
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <SearchFilters
                categories={categories}
                locations={locations}
                onSearch={handleSearch}
            />

            {/* Featured Events */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Upcoming Events
                </h2>
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-500">
                            No events match your search criteria
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Try adjusting your filters
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Browse by Category
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.slice(0, 8).map((category) => (
                        <Link
                            to={`/events?category=${category}`}
                            key={category}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 text-center"
                        >
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
                            <h3 className="mt-3 font-medium text-gray-900">
                                {category}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
