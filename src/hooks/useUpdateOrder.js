import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

/**
 * Hook para actualizar una orden
 * @returns {object} - Objeto con updateOrder, loading y error
 */
export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrder = async (orderId, orderData, dateToEdit, slotToEdit) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/order/${orderId}`,
        orderData,
        {
          params: {
            dateToEdit,
            slotToEdit,
          },
        }
      );

      console.log("✏️ Orden actualizada exitosamente:", response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("❌ Error actualizando orden:", err);
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateOrder,
    loading,
    error,
  };
};
