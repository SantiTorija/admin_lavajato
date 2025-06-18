import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const SERVICE_URL = `${import.meta.env.VITE_API_URL}/service`;
const CARTYPE_URL = `${import.meta.env.VITE_API_URL}/car-type`;
const SERVICEPRICE_URL = `${import.meta.env.VITE_API_URL}/service-price`;

export default function useFetchServicesData() {
  const [services, setServices] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [servicePrices, setServicePrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, carTypesRes, servicePricesRes] = await Promise.all([
        axios.get(SERVICE_URL),
        axios.get(CARTYPE_URL),
        axios.get(SERVICEPRICE_URL),
      ]);
      console.log(servicesRes.data);
      setServices(servicesRes.data);
      setCarTypes(carTypesRes.data);
      setServicePrices(servicePricesRes.data);
    } catch (err) {
      setError(err);
      setServices([]);
      setCarTypes([]);
      setServicePrices([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
