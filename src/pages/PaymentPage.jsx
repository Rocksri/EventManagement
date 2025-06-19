// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
    const { state } = useLocation();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL; // Or process.env.REACT_APP_API_URL for CRA

    // Add billingDetails state here
    const [billingDetails, setBillingDetails] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
    });

    // Function to handle changes in billing details (optional, if you want to manage them here)
    // If PaymentForm manages them internally and passes them back, this might not be strictly needed for changes.
    // However, it's good practice to have them managed in the parent if you need to access them before PaymentForm submits.
    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (
            !state ||
            !state.eventId ||
            !state.tickets ||
            state.tickets.length === 0
        ) {
            toast.error("Invalid payment request");
            navigate("/");
            return;
        }

        if (!currentUser) {
            toast.error("Please login to complete payment");
            navigate("/login");
            return;
        }

        const fetchEventAndTickets = async () => {
            try {
                // Fetch event
                const { data: eventData } = await axios.get(
                    `/events/${state.eventId}`
                );
                setEvent(eventData);

                // Fetch tickets for this event
                const { data: ticketsData } = await axios.get(
                    `/tickets/event/${state.eventId}`
                );
                setTickets(ticketsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load event details");
            }
        };

        const createPaymentIntent = async () => {
            try {
                const { data } = await axios.post("/tickets/purchase", {
                    eventId: state.eventId,
                    tickets: state.tickets,
                });
                setClientSecret(data.clientSecret);
                setPaymentIntent({
                    id: data.paymentIntentId, // Now using correct property
                    amount: data.totalAmount,
                });
            } catch (error) {
                console.error("Error creating payment intent:", error);
                toast.error("Failed to initialize payment");
                navigate(`/events/${state.eventId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchEventAndTickets();
        createPaymentIntent();
    }, [state, currentUser, navigate]);

    // Modify handlePaymentSuccess to accept billingDetails
    const handlePaymentSuccess = async (collectedBillingDetails) => {
        // Accept billingDetails here
        try {
            await axios.post("/tickets/confirm", {
                paymentIntentId: paymentIntent.id,
                eventId: state.eventId,
                tickets: state.tickets,
                billingDetails: collectedBillingDetails, // Pass billingDetails received from PaymentForm
            });

            toast.success("Payment successful! Tickets purchased.");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error confirming payment:", error);
            toast.error("Failed to confirm payment");
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        {event && (
                            <div className="mb-8">
                                <div className="flex items-start">
                                    {event.images.length > 0 ? (
                                        <img
                                            src={`${API_URL}${event.images[0]}`}
                                            alt={event.title}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />
                                    )}
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {event.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Tickets
                            </h3>
                            <ul className="divide-y divide-gray-200">
                                {state.tickets.map((ticket, index) => {
                                    const ticketType = tickets.find(
                                        (t) => t._id === ticket.ticketId
                                    );
                                    if (!ticketType) return null;

                                    return (
                                        <li
                                            key={index}
                                            className="py-3 flex justify-between"
                                        >
                                            <div>
                                                <p className="text-gray-900">
                                                    {ticketType.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    Quantity: {ticket.quantity}
                                                </p>
                                            </div>
                                            <p className="text-gray-900">
                                                $
                                                {(
                                                    ticketType.price *
                                                    ticket.quantity
                                                ).toFixed(2)}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <p className="text-gray-600">Subtotal</p>
                                <p className="text-gray-900">
                                    ${paymentIntent?.amount?.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex justify-between mt-2">
                                <p className="text-gray-600">Fees</p>
                                <p className="text-gray-900">
                                    $
                                    {(paymentIntent?.amount * 0.09)?.toFixed(2)}
                                </p>
                            </div>
                            <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                                <p className="text-lg font-medium text-gray-900">
                                    Total
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    $
                                    {(paymentIntent?.amount * 1.09)?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Payment Information
                        </h2>

                        {clientSecret && (
                            <Elements
                                stripe={stripePromise}
                                options={{ clientSecret }}
                            >
                                {/* Only pass needed props to PaymentForm */}
                                <PaymentForm
                                    amount={paymentIntent.amount}
                                    onSuccess={handlePaymentSuccess}
                                    clientSecret={clientSecret}
                                    // Pass initial billing details if you want PaymentForm to pre-fill
                                    // and then handle updates internally
                                    // billingDetails={billingDetails}
                                    // onBillingChange={handleBillingChange} // If parent manages changes
                                />
                            </Elements>
                        )}

                        <div className="mt-6 flex items-center">
                            <svg
                                className="w-5 h-5 text-gray-400 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                ></path>
                            </svg>
                            <p className="text-gray-500 text-sm">
                                Your payment is securely processed by Stripe. We
                                do not store your card details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
