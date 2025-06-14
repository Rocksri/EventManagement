// src/pages/EventsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import SearchFilters from "../components/SearchFilters";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get("/events");
                setEvents(data);
                setFilteredEvents(data);

                // Extract unique categories and locations
                const uniqueCategories = [
                    ...new Set(data.map((event) => event.category)),
                ];
                const uniqueLocations = [
                    ...new Set(data.map((event) => event.location.city)),
                ];

                setCategories(uniqueCategories);
                setLocations(uniqueLocations);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                All Events
            </h1>

            <SearchFilters
                categories={categories}
                locations={locations}
                onSearch={handleSearch}
            />

            <div className="mt-8">
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-500">
                            No events found
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Try adjusting your search filters
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
        </div>
    );
};

export default EventsPage;
