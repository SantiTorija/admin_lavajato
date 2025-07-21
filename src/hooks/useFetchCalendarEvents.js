import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useFetchCalendarEvents(refreshKey) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/day/calendar-events`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(res.data);
    } catch (err) {
      setError(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, refreshKey]);

  return { events, loading, error, refetch: fetchEvents };
}
