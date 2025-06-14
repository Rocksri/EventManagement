// src/components/TicketSelector.jsx
import React, { useState } from "react";

const TicketSelector = ({ ticketTypes, onSelectionChange }) => {
    const [selections, setSelections] = useState(
        ticketTypes.reduce((acc, ticket) => {
            acc[ticket._id] = 0;
            return acc;
        }, {})
    );

    const handleQuantityChange = (ticketId, quantity) => {
        const newQuantity = Math.max(
            0,
            Math.min(
                quantity,
                ticketTypes.find((t) => t._id === ticketId).quantity
            )
        );
        const newSelections = { ...selections, [ticketId]: newQuantity };
        setSelections(newSelections);

        // Convert to array of {ticketId, quantity} for parent
        const selectedTickets = Object.entries(newSelections)
            .filter(([_, qty]) => qty > 0)
            .map(([id, qty]) => ({ ticketId: id, quantity: qty }));

        onSelectionChange(selectedTickets);
    };

    return (
        <div className="space-y-4">
            {ticketTypes.map((ticket) => (
                <div
                    key={ticket._id}
                    className="flex justify-between items-center border border-gray-200 rounded-lg p-4"
                >
                    <div>
                        <h4 className="font-medium text-gray-900">
                            {ticket.name}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                            {ticket.type} Ticket
                        </p>
                        <p className="mt-1 text-gray-900">
                            ${ticket.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                            {ticket.quantity - ticket.sold} of {ticket.quantity}{" "}
                            available
                        </p>
                    </div>

                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() =>
                                handleQuantityChange(
                                    ticket._id,
                                    selections[ticket._id] - 1
                                )
                            }
                            disabled={selections[ticket._id] <= 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selections[ticket._id] > 0
                                    ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                ></path>
                            </svg>
                        </button>

                        <span className="mx-3 text-gray-900 w-6 text-center">
                            {selections[ticket._id]}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                handleQuantityChange(
                                    ticket._id,
                                    selections[ticket._id] + 1
                                )
                            }
                            disabled={
                                selections[ticket._id] >=
                                ticket.quantity - ticket.sold
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selections[ticket._id] <
                                ticket.quantity - ticket.sold
                                    ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}

            {ticketTypes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No tickets available for this event
                </div>
            )}
        </div>
    );
};

export default TicketSelector;
