import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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

  // Obtener token de autenticación desde Redux
  const token = useSelector((state) => state.auth.token);

  // Ejecutar fetch cuando cambien las fechas, token o refreshKey
  useEffect(() => {
    // Validar que tengamos las fechas necesarias
    if (!startDate || !endDate) {
      return;
    }

    const fetchProcessedEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/day/processed-events-range`,
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

        console.log(
          "🔄 Respuesta del backend (eventos procesados):",
          response.data
        );
        console.log("📊 Total de eventos recibidos:", response.data.length);
        console.log("📅 Rango solicitado:", startDate, "a", endDate);

        // Log detallado de cada evento
        response.data.forEach((event, index) => {
          console.log(`📋 Evento ${index + 1}:`, {
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            freeSlot: event.freeSlot,
            admin_created: event.admin_created,
            backgroundColor: event.backgroundColor,
          });
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
  }, [startDate, endDate, token, refreshKey]);

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
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/day/processed-events-range`,
              {
                params: { startDate, endDate },
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            console.log("🔄 Re-fetch - Respuesta del backend:", response.data);
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
