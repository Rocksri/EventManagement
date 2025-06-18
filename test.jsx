// src/context/AuthContext.jsx
// ... (existing imports and code)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ... (setAuthToken function)

    const fetchUser = async () => {
        try {
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

    // Expose a function to refresh the user profile
    const refreshProfile = async () => {
        setLoading(true); // Indicate loading while refetching
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        // ... (existing login logic)
        // After successful login, refresh profile
        await refreshProfile(); // Call refreshProfile after login
        return data;
    };

    const register = async (userData) => {
        // ... (existing register logic)
        // After successful registration, refresh profile
        await refreshProfile(); // Call refreshProfile after registration
        return data;
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
        refreshProfile, // Expose refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// ... (useAuth hook)
