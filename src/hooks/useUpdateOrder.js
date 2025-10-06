import { useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";

/**
 * Hook para actualizar una orden
 * - Soporta updates parciales (p. ej., solo CarTypeId)
 * - Ya no requiere enviar date/slot cuando no cambian
 * @returns {object} - Objeto con updateOrder, loading y error
 */
export const useUpdateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Actualiza una orden
   * @param {number|string} orderId - ID de la orden
   * @param {object} orderData - Datos a actualizar (parciales). Ej: { CarTypeId: 2 }
   * @param {string} [dateToEdit] - Obsoleto: ya no se usa
   * @param {string} [slotToEdit] - Obsoleto: ya no se usa
   * @param {number} [carTypeId] - Opcional: si se pasa, se forzará en el payload como CarTypeId
   */
  const updateOrder = async (
    orderId,
    orderData = {},
    dateToEdit,
    slotToEdit,
    carTypeId
  ) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { ...orderData };
      if (typeof carTypeId !== "undefined" && carTypeId !== null) {
        payload.CarTypeId = carTypeId;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/order/${orderId}`,
        payload
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
