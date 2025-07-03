import axios from "axios";

const useUpdateService = () => {
  const updateService = async ({ id, name, description }) => {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/service/${id}`,
      { name, description }
    );
    return res.data;
  };
  return { updateService };
};

export default useUpdateService;
