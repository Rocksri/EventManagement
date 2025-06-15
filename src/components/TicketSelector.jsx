import React, { useState, useEffect } from "react";

const TicketSelector = ({ ticketTypes, onSelectionChange }) => {
    const [selections, setSelections] = useState({});

    // Initialize selections when ticketTypes are available
    useEffect(() => {
        if (ticketTypes.length > 0) {
        const initialSelections = {};
        ticketTypes.forEach((ticket) => {
                initialSelections[ticket._id] = selections[ticket._id] || 0;
        });
        setSelections(initialSelections);
        }
    }, [ticketTypes]);

    const handleQuantityChange = (ticketId, newQuantity) => {
        const ticket = ticketTypes.find((t) => t._id === ticketId);
        if (!ticket) return;

        const quantity = Math.max(
            0,
            Math.min(newQuantity, ticket.quantity - ticket.sold)
        );
        const updatedSelections = { ...selections, [ticketId]: quantity };
        setSelections(updatedSelections);

        // Notify parent of the specific change
        onSelectionChange(ticketId, quantity);
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
                                    (selections[ticket._id] || 0) - 1
                                )
                            }
                            disabled={(selections[ticket._id] || 0) <= 0}
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                (selections[ticket._id] || 0) > 0
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

                        <input
                            type="number"
                            value={selections[ticket._id] || 0}
                            onChange={(e) =>
                                handleQuantityChange(
                                    ticket._id,
                                    e.target.value // The handleQuantityChange function will parse and validate
                                )
                            }
                            min="0" // Minimum value
                            max={ticket.quantity - ticket.sold} // Maximum value based on available tickets
                            className="mx-1 text-gray-900 w-12 text-center border rounded-md px-1 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" // Adjusted width and added basic styling
                        />

                        <button
                            type="button"
                            onClick={() =>
                                handleQuantityChange(
                                    ticket._id,
                                    (selections[ticket._id] || 0) + 1
                                )
                            }
                            disabled={
                                (selections[ticket._id] || 0) >=
                                ticket.quantity - ticket.sold
                            }
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                                (selections[ticket._id] || 0) <
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
