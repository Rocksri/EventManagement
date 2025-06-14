// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set auth token for axios requests
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Only fetch if we have a token in memory
                if (axios.defaults.headers.common["Authorization"]) {
                    const { data } = await axios.get("/auth/profile");
                    setCurrentUser(data);
                }
            } catch (err) {
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post("/auth/login", {
                email,
                password,
            });

            // Set token in axios headers
            setAuthToken(data.token);

            // Fetch user profile
            const profileResponse = await axios.get("/auth/profile");
            setCurrentUser(profileResponse.data);

            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post("/auth/register", userData);

            // Set token in axios headers
            setAuthToken(data.token);

            // Fetch user profile
            const profileResponse = await axios.get("/auth/profile");
            setCurrentUser(profileResponse.data);

            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setAuthToken(null);
            setCurrentUser(null);
        }
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        loading,
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
