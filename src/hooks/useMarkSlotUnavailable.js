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

const useMarkSlotUnavailable = () => {
  const markSlot = useCallback(async ({ date, slot }) => {
    try {
      const slot12 = to12HourFormat(slot);
      await axios.post(`${import.meta.env.VITE_API_URL}/day/add-slot`, {
        date,
        slot: slot12,
      });
      toast.success("Slot marcado como no disponible exitosamente");
      return true;
    } catch (error) {
      toast.error("Error al marcar el slot como no disponible");
      return false;
    }
  }, []);

  return { markSlot };
};

export default useMarkSlotUnavailable;
