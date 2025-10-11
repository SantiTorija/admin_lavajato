import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

const useFetchClients = (searchTerm = "") => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async (search = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = search ? { search } : {};
      const response = await api.get("/client", { params });
      setClients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(searchTerm);
  }, [searchTerm]);

  return { clients, loading, error, refetch: () => fetchClients(searchTerm) };
};

export default useFetchClients;
