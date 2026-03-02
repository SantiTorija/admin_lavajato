import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

const useFetchClients = (searchTerm = "", page = 1, limit = 10) => {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async (search, pageNum, limitNum) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page: pageNum, limit: limitNum };
      if (search && search.trim()) params.search = search.trim();
      const response = await api.get("/client", { params });
      setClients(response.data.clients);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(searchTerm, page, limit);
  }, [searchTerm, page, limit]);

  return {
    clients,
    total,
    page,
    totalPages,
    loading,
    error,
    refetch: () => fetchClients(searchTerm, page, limit),
  };
};

export default useFetchClients;
