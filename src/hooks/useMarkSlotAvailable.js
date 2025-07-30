import { useState } from "react";

import api from "../utils/axiosConfig";

const useMarkSlotAvailable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markSlotAvailable = async ({ date, slot }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/day/remove-slot", {
        date,
        slot,
      });

      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error al marcar slot como disponible";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { markSlotAvailable, loading, error };
};

export default useMarkSlotAvailable;
