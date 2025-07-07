import { useEffect, useState } from "react";
import axios from "axios";

const useFetchNewClientsByMonth = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/client/new-by-month`
        );
        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchNewClientsByMonth;
