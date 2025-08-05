import { useState } from "react";
import api from "../utils/axiosConfig";

const useDeleteClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteClient = async (clientId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(`/client/${clientId}`);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al eliminar cliente";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteClient,
    loading,
    error,
  };
};

export default useDeleteClient;
