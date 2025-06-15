// src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
    const minPrice =
        event.ticketTypes?.length > 0
            ? Math.min(...event.ticketTypes.map((t) => t.price))
            : 0;

    return (
        <Link to={`/events/${event._id}`} className="group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                {event.images.length > 0 ? (
                    <img
                        src={event.images[0]}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                )}

                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {event.organizer.name}
                            </p>
                        </div>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            ${minPrice}
                        </span>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                        </svg>
                        {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>

                    <div className="mt-1 flex items-center text-sm text-gray-500">
                        <svg
                            className="w-4 h-4 mr-1"
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
                        {event.location.venue}, {event.location.city}
                    </div>

                    <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {event.category}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
