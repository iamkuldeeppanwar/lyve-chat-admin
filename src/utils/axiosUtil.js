import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://yash-lyve.onrender.com",
});

export default axiosInstance;
