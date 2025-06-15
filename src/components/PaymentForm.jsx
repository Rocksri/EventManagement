// src/components/PaymentForm.jsx
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import axios from "axios";

const PaymentForm = ({ onSuccess, amount, clientSecret }) => {
    // Add clientSecret prop
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [billingDetails, setBillingDetails] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const handleBillingChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            toast.error("Payment system is not ready. Please try again.");
            setLoading(false);
            return;
        }

        if (!billingDetails.name || !billingDetails.email) {
            toast.error("Please fill in all required billing details");
            setLoading(false);
            return;
        }

        try {
            // Confirm the payment with the client secret
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret, // Use the clientSecret from props
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: billingDetails.name,
                            email: billingDetails.email,
                            address: {
                                line1: billingDetails.address,
                                city: billingDetails.city,
                                postal_code: billingDetails.postalCode,
                            },
                        },
                    },
                }
            );

            if (error) {
                console.error("Payment error:", error);
                toast.error(error.message || "Payment failed");
            } else if (paymentIntent.status === "succeeded") {
                toast.success("Payment successful!");
                onSuccess();
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Billing Information
                </h3>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={billingDetails.name}
                            onChange={handleBillingChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={billingDetails.email}
                            onChange={handleBillingChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={billingDetails.address}
                            onChange={handleBillingChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                            id="city"
                            name="city"
                            value={billingDetails.city}
                            onChange={handleBillingChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={billingDetails.postalCode}
                            onChange={handleBillingChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Payment Details
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Information
                        </label>
                        <div className="border border-gray-300 rounded-md p-3">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            "::placeholder": {
                                                color: "#aab7c4",
                                            },
                                        },
                                        invalid: {
                                            color: "#9e2146",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                        <span className="text-gray-700 font-medium">
                            Total:
                        </span>
                        <span className="text-xl font-bold">
                            ${(amount * 1.09).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Processing Payment..."
                        : `Pay ${(amount * 1.09).toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

export default PaymentForm;
