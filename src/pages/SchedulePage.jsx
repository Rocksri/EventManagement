// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ScheduleEditor from "../components/ScheduleEditor";

const SchedulePage = () => {
    const { eventId } = useParams();
    const { currentUser, logout } = useAuth();
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const { data } = await axios.get(`/schedules/${eventId}`);
                setSchedule(data || { event: eventId, sessions: [] });
            } catch (error) {
                console.error("Error fetching schedule:", error);
                toast.error("Failed to load schedule");
                setSchedule(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [eventId]);

    const handleSave = async (sessions) => {
        try {
            const response = await axios.post("/schedules", {
                event: eventId,
                sessions,
            });
            toast.success("Schedule updated successfully!");
            setIsEditing(false);
            setSchedule(response.data);
        } catch (error) {
            console.error("Error updating schedule:", error);
            toast.error("Failed to update schedule");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Fixed: Check if schedule exists and has sessions
    const hasSessions =
        schedule && schedule.sessions && schedule.sessions.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Event Schedule
                    </h1>
                    <Link
                        to={`/events/${eventId}`}
                        className="text-indigo-600 font-semibold text-xl"
                    >
                        Back to event
                    </Link>
                </div>
                {/* Fixed button rendering logic */}
                {!isEditing &&
                    (currentUser?.role === "admin" ||
                        currentUser?.role === "organizer") && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            {hasSessions ? "Edit Schedule" : "Create Schedule"}
                        </button>
                    )}
            </div>

            {isEditing ? (
                <ScheduleEditor
                    sessions={schedule ? schedule.sessions : []}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : hasSessions ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="space-y-4">
                            {schedule.sessions.map((session, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {session.title}
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            {new Date(
                                                session.startTime
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -
                                            {new Date(
                                                session.endTime
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    {session.speaker && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Speaker: {session.speaker}
                                        </p>
                                    )}
                                    {session.location && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Location: {session.location}
                                        </p>
                                    )}
                                    <p className="mt-2 text-gray-600">
                                        {session.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-500">
                        No schedule available
                    </h3>
                    {(currentUser?.role === "admin" ||
                        currentUser?.role === "organizer") && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Create Schedule
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SchedulePage;
