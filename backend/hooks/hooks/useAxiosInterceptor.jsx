import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403 && error.response.data.restricted) {
        navigate("/ip-restricted");
      }
      return Promise.reject(error);
    }
  );
};
