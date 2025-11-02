import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Hook para obtener el precio de un servicio por carTypeId y serviceId
 * @param {number} carTypeId - ID del tipo de auto
 * @param {number} serviceId - ID del servicio
 * @param {boolean} shouldFetch - Si debe hacer la llamada (ej: cuando el modal está abierto)
 * @param {number} refreshKey - Key para forzar re-fetch
 * @returns {object} - Objeto con servicePrice, loading y error
 */
export const useServicePrice = (
  carTypeId,
  serviceId,
  shouldFetch = false,
  refreshKey = 0
) => {
  const [servicePrice, setServicePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset inmediato cuando shouldFetch es false o faltan datos
    if (!shouldFetch || !carTypeId || !serviceId) {
      setServicePrice(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Flag para cancelar el request si los parámetros cambian
    let isCancelled = false;

    const fetchServicePrice = async () => {
      console.log(
        "🔄 useServicePrice ejecutándose - carTypeId:",
        carTypeId,
        "serviceId:",
        serviceId,
        "shouldFetch:",
        shouldFetch,
        "refreshKey:",
        refreshKey
      );

      setLoading(true);
      setError(null);
      // Limpiar precio anterior antes de hacer el fetch para evitar mostrar precio incorrecto
      setServicePrice(null);

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/service-price/car-type/${carTypeId}/service/${serviceId}`
        );

        // Solo actualizar si el request no fue cancelado
        if (!isCancelled) {
          console.log("💰 Precio obtenido:", response.data);
          setServicePrice(response.data);
        }
      } catch (err) {
        // Solo actualizar error si el request no fue cancelado
        if (!isCancelled) {
          console.error("❌ Error obteniendo precio:", err);
          setError(err);
          setServicePrice(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchServicePrice();

    // Cleanup: marcar como cancelado cuando cambian los parámetros o se desmonta
    return () => {
      isCancelled = true;
    };
  }, [carTypeId, serviceId, shouldFetch, refreshKey]);

  return {
    servicePrice,
    loading,
    error,
  };
};
