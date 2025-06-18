import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/client`;

export default function useFetchClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setClients(response.data);
    } catch (err) {
      setError(err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
}
