import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

const useFetchClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/client");
      setClients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return { clients, loading, error, refetch: fetchClients };
};

export default useFetchClients;
