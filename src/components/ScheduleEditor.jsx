// src/components/ScheduleEditor.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const ScheduleEditor = ({ sessions, onSave, onCancel }) => {
    // Initialize component state with sessions passed from parent, or an empty array
    const [currentSessions, setCurrentSessions] = useState(sessions || []);
    const [newSession, setNewSession] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        speaker: "",
        location: "",
    });
    const [errors, setErrors] = useState({});

    // Update internal state if sessions prop changes (e.g., initial load or parent update)
    useEffect(() => {
        setCurrentSessions(sessions || []);
    }, [sessions]);

    const handleSessionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSessions = [...currentSessions];
        updatedSessions[index] = { ...updatedSessions[index], [name]: value };
        setCurrentSessions(updatedSessions);
    };

    const handleNewSessionChange = (e) => {
        const { name, value } = e.target;
        setNewSession((prev) => ({ ...prev, [name]: value }));
    };

    const validateSession = (session, sessionIndex) => {
        const currentErrors = {};

        if (!session.title) {
            currentErrors.title = "Title is required";
        }
        if (!session.startTime) {
            currentErrors.startTime = "Start time is required";
        }
        if (!session.endTime) {
            currentErrors.endTime = "End time is required";
        }

        if (session.startTime && session.endTime) {
            const start = new Date(`2000-01-01T${session.startTime}`);
            const end = new Date(`2000-01-01T${session.endTime}`);

            if (start.toString() === "Invalid Date") {
                currentErrors.startTime = "Invalid start time format";
            }
            if (end.toString() === "Invalid Date") {
                currentErrors.endTime = "Invalid end time format";
            }

            if (start >= end) {
                currentErrors.endTime = "End time must be after start time";
            }
        }
        return currentErrors;
    };

    const addSession = () => {
        const sessionErrors = validateSession(newSession);
        if (Object.keys(sessionErrors).length > 0) {
            setErrors({ newSession: sessionErrors });
            return;
        }

        setCurrentSessions((prev) => [...prev, newSession]);
        setNewSession({
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            speaker: "",
            location: "",
        });
        setErrors({}); // Clear errors after adding
    };

    const removeSession = (index) => {
        setCurrentSessions((prev) => prev.filter((_, i) => i !== index));
    };

    const saveSchedule = () => {
        const allSessions = newSession.title
            ? [...currentSessions, newSession]
            : currentSessions;
        let hasErrors = false;
        const newErrors = {};

        allSessions.forEach((session, index) => {
            const sessionErrors = validateSession(session, index);
            if (Object.keys(sessionErrors).length > 0) {
                newErrors[index] = sessionErrors;
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setErrors(newErrors);
            toast.error("Please correct the errors in the schedule.");
            return;
        }

        // --- START OF MODIFICATION ---
        const sessionsToSend = allSessions.map((session) => ({
            ...session,
            startTime: session.startTime
                ? `2000-01-01T${session.startTime}`
                : "",
            endTime: session.endTime ? `2000-01-01T${session.endTime}` : "",
        }));
        // --- END OF MODIFICATION ---

        onSave(sessionsToSend);
        toast.success("Schedule saved!");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Edit Schedule
            </h3>
            <div>
                {/* Existing Sessions */}
                <div className="space-y-6">
                    {currentSessions.map((session, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-200 rounded-md bg-gray-50"
                        >
                            <h4 className="text-lg font-medium text-gray-800 mb-2">
                                Session {index + 1}
                            </h4>
                            {/* Input fields for existing sessions */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor={`title-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id={`title-${index}`}
                                        value={session.title}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors[index]?.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].title}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor={`speaker-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Speaker
                                    </label>
                                    <input
                                        type="text"
                                        name="speaker"
                                        id={`speaker-${index}`}
                                        value={session.speaker}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`startTime-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        id={`startTime-${index}`}
                                        value={session.startTime}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors[index]?.startTime && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].startTime}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor={`endTime-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        id={`endTime-${index}`}
                                        value={session.endTime}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors[index]?.endTime && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].endTime}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor={`location-${index}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        id={`location-${index}`}
                                        value={session.location}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label
                                    htmlFor={`description-${index}`}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    id={`description-${index}`}
                                    rows="3"
                                    value={session.description}
                                    onChange={(e) =>
                                        handleSessionChange(index, e)
                                    }
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => removeSession(index)}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                    Remove Session
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Session */}
                <div className="mt-8 p-4 border border-gray-200 rounded-md bg-white">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Add New Session
                    </h4>
                    {/* Input fields for new session */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="new-title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="new-title"
                                value={newSession.title}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.newSession?.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.newSession.title}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="new-speaker"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Speaker
                            </label>
                            <input
                                type="text"
                                name="speaker"
                                id="new-speaker"
                                value={newSession.speaker}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="new-startTime"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                id="new-startTime"
                                value={newSession.startTime}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.newSession?.startTime && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.newSession.startTime}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="new-endTime"
                                className="block text-sm font-medium text-gray-700"
                            >
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                id="new-endTime"
                                value={newSession.endTime}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {errors.newSession?.endTime && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.newSession.endTime}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="new-location"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                id="new-location"
                                value={newSession.location}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            htmlFor="new-description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            name="description"
                            id="new-description"
                            rows="3"
                            value={newSession.description}
                            onChange={handleNewSessionChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={addSession}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Add Session
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={saveSchedule}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Save Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleEditor;
