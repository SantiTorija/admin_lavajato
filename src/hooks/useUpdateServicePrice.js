import axios from "axios";
import { useSelector } from "react-redux";

const useUpdateServicePrice = () => {
  const token = useSelector((state) => state.auth.token);
  const updateServicePrice = async ({ id, price }) => {
    // id = id del servicePrice (no del service ni del carType)
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/service-price/${id}`,
      { price },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };
  return { updateServicePrice };
};

export default useUpdateServicePrice;
