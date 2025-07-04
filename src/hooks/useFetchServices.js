import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/service`;

export default function useFetchServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setServices(response.data);
    } catch (err) {
      setError(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, error, refetch: fetchServices };
}
