// src/App.jsx
import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";
import SchedulePage from "./pages/SchedulePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import EditEventPage from "./pages/EditEventPage";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Configure axios
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route
                                path="/events/:id"
                                element={<EventDetailPage />}
                            />
                            <Route
                                path="/create-event"
                                element={
                                    <ProtectedRoute>
                                        <CreateEventPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedAdminRoute>
                                        <AdminDashboard />
                                    </ProtectedAdminRoute>
                                }
                            />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/register"
                                element={<RegisterPage />}
                            />
                            <Route
                                path="/payment"
                                element={
                                    <ProtectedRoute>
                                        <PaymentPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/schedules/:eventId"
                                element={<SchedulePage />}
                            />
                            <Route
                                path="/analytics/:eventId"
                                element={
                                    <ProtectedRoute>
                                        <AnalyticsPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/events/:id/edit"
                                element={
                                    <ProtectedRoute>
                                        <EditEventPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                    <Toaster position="top-right" />
                </div>
            </Router>
        </AuthProvider>
    );
}

// Protected route component
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/login" />;
}

// Protected admin route
function ProtectedAdminRoute({ children }) {
    const { currentUser } = useAuth();
    return currentUser?.role === "admin" ? children : <Navigate to="/" />;
}

export default App;
