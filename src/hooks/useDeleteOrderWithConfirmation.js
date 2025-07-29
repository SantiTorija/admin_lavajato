import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * Hook para eliminar una orden con confirmación SweetAlert
 * @param {function} onSuccess - Callback que se ejecuta cuando la eliminación es exitosa
 * @returns {object} - Objeto con handleDeleteWithConfirmation y loading
 */
export const useDeleteOrderWithConfirmation = (onSuccess) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteWithConfirmation = async (orderId, date, slot) => {
    // Validar que tengamos los datos necesarios
    if (!orderId) {
      console.error("❌ No hay orderId disponible");
      return;
    }

    // Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD si es necesario
    let formattedDate = date;
    if (date && date.includes("/")) {
      const [day, month, year] = date.split("/");
      formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    }

    // Extraer solo la hora de inicio del slot si es un rango
    let formattedSlot = slot;
    if (slot && slot.includes(" - ")) {
      formattedSlot = slot.split(" - ")[0];
    }

    if (!formattedDate || !formattedSlot) {
      console.error("❌ Fecha o slot no disponibles");
      return;
    }

    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro que quieres eliminar la orden?",
      icon: "warning",
      background: "#000000",
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: false,
      focusCancel: false,
    });

    if (result.isConfirmed) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.delete(
          `${
            import.meta.env.VITE_API_URL
          }/order/${orderId}/${formattedDate}/${formattedSlot}`
        );

        console.log("✅ Orden eliminada exitosamente:", response.data);

        // Ejecutar callback de éxito si existe
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        }

        return { success: true, data: response.data };
      } catch (err) {
        console.error("❌ Error eliminando orden:", err);
        setError(err.response?.data?.message || err.message);
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    }

    return { success: false, cancelled: true };
  };

  return {
    handleDeleteWithConfirmation,
    loading,
    error,
  };
};
