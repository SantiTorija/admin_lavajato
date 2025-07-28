import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function useFetchCalendarEvents(refreshKey) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchEvents = async () => {
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
    };

    fetchEvents();
  }, [token, refreshKey]);

  return {
    events,
    loading,
    error,
    refetch: () => {
      const fetchData = async () => {
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
      };
      fetchData();
    },
  };
}
