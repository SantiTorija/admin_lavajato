import axios from "axios";

const useUpdateServicePrice = () => {
  const updateServicePrice = async ({ id, price }) => {
    // id = id del servicePrice (no del service ni del carType)
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/service-price/${id}`,
      { price }
    );
    return res.data;
  };
  return { updateServicePrice };
};

export default useUpdateServicePrice;
