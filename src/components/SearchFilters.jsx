// src/components/SearchFilters.jsx
import React, { useState } from "react";

const SearchFilters = ({ categories, locations, onSearch }) => {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        location: "",
        dateFrom: "",
        dateTo: "",
        minPrice: "",
        maxPrice: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleReset = () => {
        setFilters({
            search: "",
            category: "",
            location: "",
            dateFrom: "",
            dateTo: "",
            minPrice: "",
            maxPrice: "",
        });
        onSearch({});
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4.5">
                    <div>
                        <label
                            htmlFor="search"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Search
                        </label>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            value={filters.search}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Event name or description"
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
                            value={filters.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Location
                        </label>
                        <select
                            name="location"
                            id="location"
                            value={filters.location}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">All Locations</option>
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="dateFrom"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Date Range
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="date"
                                name="dateFrom"
                                id="dateFrom"
                                value={filters.dateFrom}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <input
                                type="date"
                                name="dateTo"
                                id="dateTo"
                                value={filters.dateTo}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="minPrice"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Price Range
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="number"
                                name="minPrice"
                                id="minPrice"
                                value={filters.minPrice}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Min price"
                                min="0"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                id="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Max price"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchFilters;
