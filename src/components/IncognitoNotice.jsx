// src/components/IncognitoNotice.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const IncognitoNotice = () => {
    const { currentUser, loading } = useAuth();
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        // Show notice if user is authenticated but profile fails to load
        if (!loading && !currentUser && document.cookie.includes("token")) {
            setShowNotice(true);
        }
    }, [currentUser, loading]);

    if (!showNotice) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md rounded shadow-lg z-50">
            <p className="font-bold">Incognito Mode Notice</p>
            <p>
                Please enable third-party cookies for this site in your browser
                settings to access all features.
            </p>
            <button
                onClick={() => setShowNotice(false)}
                className="mt-2 text-yellow-900 hover:text-yellow-800 font-medium"
            >
                Dismiss
            </button>
        </div>
    );
};

export default IncognitoNotice;
