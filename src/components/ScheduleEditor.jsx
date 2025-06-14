// src/components/ScheduleEditor.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";

const ScheduleEditor = ({ sessions, onSave, onCancel }) => {
    const [schedule, setSchedule] = useState(sessions || []);
    const [newSession, setNewSession] = useState({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        speaker: "",
        location: "",
    });
    const [errors, setErrors] = useState({});

    const handleSessionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSessions = [...schedule];
        updatedSessions[index] = { ...updatedSessions[index], [name]: value };
        setSchedule(updatedSessions);
    };

    const handleNewSessionChange = (e) => {
        const { name, value } = e.target;
        setNewSession((prev) => ({ ...prev, [name]: value }));
    };

    const validateSession = (session) => {
        const errors = {};

        if (!session.title) errors.title = "Title is required";
        if (!session.startTime) errors.startTime = "Start time is required";
        if (!session.endTime) errors.endTime = "End time is required";

        if (session.startTime && session.endTime) {
            const start = new Date(`2000-01-01T${session.startTime}`);
            const end = new Date(`2000-01-01T${session.endTime}`);

            if (start >= end) {
                errors.endTime = "End time must be after start time";
            }
        }

        return errors;
    };

    const addSession = () => {
        const errors = validateSession(newSession);

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        setSchedule([...schedule, newSession]);
        setNewSession({
            title: "",
            description: "",
            startTime: "",
            endTime: "",
            speaker: "",
            location: "",
        });
        setErrors({});
    };

    const removeSession = (index) => {
        const updatedSessions = schedule.filter((_, i) => i !== index);
        setSchedule(updatedSessions);
    };

    const saveSchedule = () => {
        // Validate all sessions
        let hasErrors = false;
        const sessionErrors = [];

        schedule.forEach((session, index) => {
            const errors = validateSession(session);
            sessionErrors[index] = errors;

            if (Object.keys(errors).length > 0) {
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setErrors(sessionErrors);
            toast.error("Please fix the errors in the schedule");
            return;
        }

        onSave(schedule);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Edit Event Schedule
                </h2>

                {/* Existing Sessions */}
                <div className="space-y-6 mb-8">
                    {schedule.map((session, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Session {index + 1}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => removeSession(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={session.title}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className={`mt-1 block w-full border ${
                                            errors[index]?.title
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md shadow-sm p-2`}
                                    />
                                    {errors[index]?.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Speaker
                                    </label>
                                    <input
                                        type="text"
                                        name="speaker"
                                        value={session.speaker}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={session.startTime}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className={`mt-1 block w-full border ${
                                            errors[index]?.startTime
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md shadow-sm p-2`}
                                    />
                                    {errors[index]?.startTime && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].startTime}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={session.endTime}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className={`mt-1 block w-full border ${
                                            errors[index]?.endTime
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        } rounded-md shadow-sm p-2`}
                                    />
                                    {errors[index]?.endTime && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors[index].endTime}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={session.location}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        value={session.description}
                                        onChange={(e) =>
                                            handleSessionChange(index, e)
                                        }
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add New Session */}
                <div className="border border-gray-200 rounded-lg p-4 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Add New Session
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newSession.title}
                                onChange={handleNewSessionChange}
                                className={`mt-1 block w-full border ${
                                    errors.title
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md shadow-sm p-2`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Speaker
                            </label>
                            <input
                                type="text"
                                name="speaker"
                                value={newSession.speaker}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={newSession.startTime}
                                onChange={handleNewSessionChange}
                                className={`mt-1 block w-full border ${
                                    errors.startTime
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md shadow-sm p-2`}
                            />
                            {errors.startTime && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.startTime}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Time *
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={newSession.endTime}
                                onChange={handleNewSessionChange}
                                className={`mt-1 block w-full border ${
                                    errors.endTime
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md shadow-sm p-2`}
                            />
                            {errors.endTime && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.endTime}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={newSession.location}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                value={newSession.description}
                                onChange={handleNewSessionChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
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
                <div className="flex justify-end space-x-3">
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
