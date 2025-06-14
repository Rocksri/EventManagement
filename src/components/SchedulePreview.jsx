// src/components/SchedulePreview.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const SchedulePreview = ({ eventId }) => {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const { data } = await axios.get(`/schedules/${eventId}`);
                setSchedule(data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
                // Not showing error toast since it's just a preview
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!schedule || !schedule.sessions || schedule.sessions.length === 0) {
        return (
            <div className="text-gray-500 text-sm">
                Schedule not available yet
            </div>
        );
    }

    // Sort sessions by start time
    const sortedSessions = [...schedule.sessions].sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    // Only show first 2 sessions in preview
    const sessionsToShow = showAll
        ? sortedSessions
        : sortedSessions.slice(0, 2);

    return (
        <div>
            <div className="space-y-3">
                {sessionsToShow.map((session, index) => (
                    <div key={index} className="flex">
                        <div className="flex-shrink-0 w-16">
                            <div className="text-sm font-medium text-gray-900">
                                {new Date(session.startTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                to{" "}
                                {new Date(session.endTime).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </div>
                        </div>
                        <div className="ml-4 flex-grow">
                            <h4 className="text-sm font-medium text-gray-900">
                                {session.title}
                            </h4>
                            {session.speaker && (
                                <p className="text-xs text-gray-500">
                                    Speaker: {session.speaker}
                                </p>
                            )}
                            {session.location && (
                                <p className="text-xs text-gray-500">
                                    Location: {session.location}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!showAll && sortedSessions.length > 2 && (
                <button
                    onClick={() => setShowAll(true)}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    Show all {sortedSessions.length} sessions
                </button>
            )}

            {showAll && (
                <button
                    onClick={() => setShowAll(false)}
                    className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    Show less
                </button>
            )}
        </div>
    );
};

export default SchedulePreview;
