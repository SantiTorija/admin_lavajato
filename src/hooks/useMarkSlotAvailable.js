import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function to12HourFormat(time24) {
  const [hour, minute] = time24.split(":");
  let h = parseInt(hour, 10);
  const suffix = h >= 12 ? "p.m." : "a.m.";
  h = h % 12 || 12;
  return `${h}:${minute} ${suffix}`;
}

const useMarkSlotAvailable = () => {
  const markSlotAvailable = useCallback(async ({ date, slot }) => {
    try {
      const slot12 = to12HourFormat(slot);
      await axios.post(`${import.meta.env.VITE_API_URL}/day/remove-slot`, {
        date,
        slot: slot12,
      });
      toast.success("Slot marcado como disponible exitosamente");
      return true;
    } catch (error) {
      toast.error("Error al marcar el slot como disponible");
      return false;
    }
  }, []);

  return { markSlotAvailable };
};

export default useMarkSlotAvailable;
