import { useState } from "react";
import api from "../utils/axiosConfig";

const useUpdateClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateClient = async (clientId, clientData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/client/${clientId}`, clientData);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al actualizar cliente";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateClient,
    loading,
    error,
  };
};

export default useUpdateClient;
