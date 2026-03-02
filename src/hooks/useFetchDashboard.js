import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API = import.meta.env.VITE_API_URL;

const useFetchDashboard = () => {
  const [data, setData] = useState({
    kpis: null,
    revenueByMonth: null,
    ordersByStatus: null,
    topServices: null,
    popularSlots: null,
    clientsByMonth: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [kpis, revenue, orders, services, slots, clients] = await Promise.all([
          axios.get(`${API}/analytics/dashboard/kpis`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/analytics/dashboard/revenue-by-month`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/analytics/dashboard/orders-by-status`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/analytics/dashboard/top-services`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/analytics/dashboard/popular-slots`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/analytics/clients/client-quantity-by-month`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setData({
          kpis: kpis.data,
          revenueByMonth: revenue.data,
          ordersByStatus: orders.data,
          topServices: services.data,
          popularSlots: slots.data,
          clientsByMonth: clients.data,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  return { data, loading, error };
};

export default useFetchDashboard;
