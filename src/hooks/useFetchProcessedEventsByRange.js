import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

/**
 * Hook optimizado para obtener eventos procesados por rango de fechas
 * Utiliza la ruta /day/processed-events-range que procesa todo en el backend
 *
 * @param {string} startDate - Fecha de inicio en formato YYYY-MM-DD
 * @param {string} endDate - Fecha de fin en formato YYYY-MM-DD
 * @param {number} refreshKey - Clave para forzar refrescar datos
 * @returns {object} - Objeto con events, loading, error y refetch
 */
export default function useFetchProcessedEventsByRange(
  startDate,
  endDate,
  refreshKey
) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ejecutar fetch cuando cambien las fechas o refreshKey
  useEffect(() => {
    // Validar que tengamos las fechas necesarias
    if (!startDate || !endDate) {
      return;
    }

    const fetchProcessedEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get("/day/processed-events-range", {
          params: {
            startDate,
            endDate,
          },
        });
        setEvents(response.data);
      } catch (err) {
        console.error("❌ Error fetching processed events by range:", err);
        setError(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedEvents();
  }, [startDate, endDate, refreshKey]);

  return {
    events,
    loading,
    error,
    refetch: () => {
      // Re-fetch function for manual refresh
      if (startDate && endDate) {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const response = await api.get("/day/processed-events-range", {
              params: { startDate, endDate },
            });
            // Debug: Verificar datos en re-fetch
            console.log("🔄 Re-fetch - Verificando serviceId y carTypeId:");
            response.data.forEach((event, index) => {
              console.log(
                `📋 Re-fetch Evento ${index + 1} - extendedProps:`,
                event.extendedProps
              );
            });
            setEvents(response.data);
          } catch (err) {
            console.error("❌ Error en re-fetch:", err);
            setError(err);
            setEvents([]);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    },
  };
}
