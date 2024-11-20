import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", 
  headers: {
    "Content-Type": "application/json",
  },
});

// if there is token the config has header authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("config with token");

    }
    console.log("config returned");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor (for handling 401 errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - Redirecting");
      window.location.href = "/unauthorized"; // Redirect to the unauthorized page
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
