import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Hook para obtener el precio de un servicio por carTypeId y serviceId
 * @param {number} carTypeId - ID del tipo de auto
 * @param {number} serviceId - ID del servicio
 * @param {boolean} shouldFetch - Si debe hacer la llamada (ej: cuando el modal está abierto)
 * @returns {object} - Objeto con servicePrice, loading y error
 */
export const useServicePrice = (carTypeId, serviceId, shouldFetch = false) => {
  const [servicePrice, setServicePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicePrice = async () => {
      // Solo hacer la llamada si tenemos los IDs y shouldFetch es true
      if (carTypeId && serviceId && shouldFetch) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/service-price/car-type/${carTypeId}/service/${serviceId}`
          );
          console.log("💰 Precio obtenido:", response.data);
          setServicePrice(response.data);
        } catch (err) {
          console.error("❌ Error obteniendo precio:", err);
          setError(err);
          setServicePrice(null);
        } finally {
          setLoading(false);
        }
      } else {
        setServicePrice(null);
        setError(null);
      }
    };

    fetchServicePrice();
  }, [carTypeId, serviceId, shouldFetch]);

  return {
    servicePrice,
    loading,
    error,
  };
};
