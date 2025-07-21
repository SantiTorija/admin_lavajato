import axios from "axios";
import { useSelector } from "react-redux";

const useUpdateService = () => {
  const token = useSelector((state) => state.auth.token);
  const updateService = async ({ id, name, description }) => {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/service/${id}`,
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  };
  return { updateService };
};

export default useUpdateService;
