import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/events');
            setEvents(data);
            setError(null);
        } catch (err) {
            setError('Failed to load events');
            console.error('Events fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return { events, loading, error, refetch: fetchEvents };
}