import { useState } from "react";
import api from "../utils/axiosConfig";

const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/order/admin", orderData);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al crear la orden";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

export default useCreateOrder;
