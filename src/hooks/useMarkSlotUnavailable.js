import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const useMarkSlotUnavailable = () => {
  const token = useSelector((state) => state.auth.token);
  const markSlot = useCallback(
    async ({ date, slot }) => {
      console.log(slot);
      try {
        // Enviar slot en formato 24h directamente (sin conversión AM/PM)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/day/add-slot`,
          { date, slot },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Slot marcado como no disponible exitosamente");
        return true;
      } catch (error) {
        console.log("ERROR MARCANDO NO DISPONIBLE:", error);
        toast.error("Error al marcar el slot como no disponible");
        return false;
      }
    },
    [token]
  );

  return { markSlot };
};

export default useMarkSlotUnavailable;
