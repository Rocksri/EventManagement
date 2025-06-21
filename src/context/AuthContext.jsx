// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// This is crucial for sending cookies with Axios requests
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // This function is no longer setting a token in headers directly
    // as we are now using HTTP-only cookies.
    // Keeping it as a placeholder or if you decide to reintroduce header tokens
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    const fetchUser = async () => {
        try {
            // Add credentials: 'include' to ensure cookies are sent
            const { data } = await axios.get("/auth/profile", {
                withCredentials: true,
            });
            setCurrentUser(data);
        } catch (err) {
            console.error("Fetch user error:", err);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Expose a function to refresh the user profile
    const refreshProfile = async () => {
        setLoading(true); // Indicate loading while refetching
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            // Backend will set the HTTP-only cookie upon successful login
            const { data } = await axios.post("/auth/login", {
                email,
                password,
            });

            // Immediately fetch profile after login to update currentUser state
            await refreshProfile(); // Call refreshProfile after login
            return data; // Return backend response, e.g., { msg: "Logged in successfully" }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            // Backend will set the HTTP-only cookie upon successful registration
            const { data } = await axios.post("/auth/register", userData);

            // Immediately fetch profile after registration to update currentUser state
            await refreshProfile(); // Call refreshProfile after registration
            return data; // Return backend response, e.g., { msg: "Registration successful" }
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Backend will clear the HTTP-only cookie
            await axios.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAuthToken(null);
            setCurrentUser(null);
        }
    };

    const updatePassword = async (currentPassword, newPassword) => {
        try {
            const response = await axios.put("/auth/password", {
                currentPassword,
                newPassword,
            });
            return response.data;
        } catch (error) {
            console.error("Password update error:", error);
            throw error;
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading,
        refreshProfile, // Expose refreshProfile
        updatePassword, // Expose updatePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
