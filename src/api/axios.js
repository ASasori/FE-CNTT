import axios from "axios";
import NProgress from "nprogress";
import { API_URL } from "./apiConfig";
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
});
const instance = axios.create({
  //baseURL: "https://smart-q-and-a-about-medicine.onrender.com/",
  //baseURL: "http://localhost:3000/",
  baseURL: API_URL,
});

export default instance;
