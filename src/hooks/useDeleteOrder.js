import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

/**
 * Hook para eliminar una orden
 * @returns {object} - Objeto con deleteOrder, loading y error
 */
export const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener token de autenticación desde Redux
  const token = useSelector((state) => state.auth.token);

  const deleteOrder = async (orderId, date, slot) => {
    setLoading(true);
    setError(null);
    console.log(slot);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/order/${orderId}/${date}/${slot}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🗑️ Orden eliminada exitosamente:", response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("❌ Error eliminando orden:", err);
      setError(err.response?.data?.message || err.message);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteOrder,
    loading,
    error,
  };
};
