import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function useFetchDayAvailability(refreshKey) {
  const [daysAvailability, setDaysAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/day/availability/${year}/${month}`
      );
      setDaysAvailability(res.data);
    } catch (err) {
      setError(err);
      setDaysAvailability([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability, refreshKey]);

  return { daysAvailability, loading, error, refetch: fetchAvailability };
}
