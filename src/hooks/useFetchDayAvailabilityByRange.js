import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

/**
 * Hook para obtener disponibilidad de días por rango de fechas
 * Utiliza la ruta protegida /day/availability-range para el admin
 *
 * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD
 * @param {number} refreshKey - Clave para forzar refrescar datos
 * @returns {object} - Objeto con daysAvailability, loading, error y refetch
 */
export default function useFetchDayAvailabilityByRange(
  startDate,
  endDate,
  refreshKey
) {
  const [daysAvailability, setDaysAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener token de autenticación desde Redux
  const token = useSelector((state) => state.auth.token);

  // Ejecutar fetch cuando cambien las fechas, token o refreshKey
  useEffect(() => {
    // Validar que tengamos las fechas necesarias
    if (!startDate || !endDate) {
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/day/availability-range`,
          {
            params: {
              startDate,
              endDate,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDaysAvailability(response.data);
      } catch (err) {
        console.error("Error fetching day availability by range:", err);
        setError(err);
        setDaysAvailability([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [startDate, endDate, token, refreshKey]);

  return {
    daysAvailability,
    loading,
    error,
    refetch: () => {
      // Re-fetch function for manual refresh
      if (startDate && endDate) {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/day/availability-range`,
              {
                params: { startDate, endDate },
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setDaysAvailability(response.data);
          } catch (err) {
            console.error("Error fetching day availability by range:", err);
            setError(err);
            setDaysAvailability([]);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    },
  };
}
