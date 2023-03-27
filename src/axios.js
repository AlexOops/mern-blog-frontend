import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444"
});

//middleware - при любом запросе проверяй, есть ли в localStorage что то
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
