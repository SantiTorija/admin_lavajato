import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const SERVICE_URL = `${import.meta.env.VITE_API_URL}/service`;
const CARTYPE_URL = `${import.meta.env.VITE_API_URL}/car-type`;
const SERVICEPRICE_URL = `${import.meta.env.VITE_API_URL}/service-price`;

export default function useFetchServicesData() {
  const [services, setServices] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [servicePrices, setServicePrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, carTypesRes, servicePricesRes] = await Promise.all([
        axios.get(SERVICE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(CARTYPE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(SERVICEPRICE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setServices(servicesRes.data);
      setCarTypes(carTypesRes.data);
      setServicePrices(servicePricesRes.data);
      console.log(servicesRes.data, "ss");
      console.log(carTypesRes.data, "ct");
      console.log(servicePricesRes.data, "sp");
    } catch (err) {
      setError(err);
      setServices([]);
      setCarTypes([]);
      setServicePrices([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    services,
    carTypes,
    servicePrices,
    loading,
    error,
    refetch: fetchAll,
  };
}
