import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const useMarkSlotAvailable = () => {
  const token = useSelector((state) => state.auth.token);
  const markSlotAvailable = useCallback(
    async ({ date, slot }) => {
      try {
        console.log(slot);

        // Enviar slot en formato 24h directamente (sin conversión AM/PM)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/day/remove-slot`,
          { date, slot },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Slot marcado como disponible exitosamente");
        return true;
      } catch (error) {
        console.log("ERROR MARCANDO DISPONIBLE:", error);
        toast.error("Error al marcar el slot como disponible");
        return false;
      }
    },
    [token]
  );

  return { markSlotAvailable };
};

export default useMarkSlotAvailable;
