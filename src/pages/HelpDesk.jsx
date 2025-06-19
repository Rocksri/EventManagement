import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const HelpDesk = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [tickets, setTickets] = useState([]);

    const fetchMyTickets = async () => {
        const res = await axios.get("/helpdesk/my");
        setTickets(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(
            "/helpdesk",
            { subject, message },
            { withCredentials: true }
        );
        setSubject("");
        setMessage("");
        fetchMyTickets();
    };

    useEffect(() => {
        fetchMyTickets();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">
                Submit a HelpDesk Ticket
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Subject"
                    className="w-full p-2 border rounded"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Describe your issue..."
                    className="w-full p-2 border rounded"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Submit Ticket
                </button>
            </form>

            <h3 className="text-lg font-medium mb-2">Your Previous Tickets</h3>
            <ul className="space-y-2">
                {tickets.map((ticket) => (
                    <li
                        key={ticket._id}
                        className="border p-3 rounded shadow-sm"
                    >
                        <p>
                            <strong>Subject:</strong> {ticket.subject}
                        </p>
                        <p>
                            <strong>Status:</strong> {ticket.status}
                        </p>
                        <p>
                            <strong>Message:</strong> {ticket.message}
                        </p>
                        {ticket.response && (
                            <p className="text-green-700">
                                <strong>Admin Response:</strong>{" "}
                                {ticket.response}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HelpDesk;
