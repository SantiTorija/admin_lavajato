import { useState } from "react";
import api from "../utils/axiosConfig";

const useCreateClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClient = async (clientData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/client", clientData);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al crear cliente";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createClient,
    loading,
    error,
  };
};

export default useCreateClient;
