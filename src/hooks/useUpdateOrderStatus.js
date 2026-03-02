import { useState } from "react";
import api from "../utils/axiosConfig";

/**
 * Hook para actualizar el estado de una orden
 * @returns {object} - Objeto con updateOrderStatus, loading y error
 */
export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderStatus = async (orderId, orderStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/order/${orderId}/status`, {
        orderStatus,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Error al actualizar estado";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateOrderStatus,
    loading,
    error,
  };
};
