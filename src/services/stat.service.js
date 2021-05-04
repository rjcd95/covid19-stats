import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/"

const syncStats = () => {
    return axios.get(API_URL + "stats/sync", { headers: authHeader() });
};
  
const getStats = (params) => {
  return axios.get(API_URL + "stats", { params: params, headers: authHeader() });
};

const getStatItem = (id) => {
  return axios.get(API_URL + "stats/" + id, { headers: authHeader() });
};

const updateStatItem = (data) => {
    return axios.post(API_URL + "stats/" + data.id, data);
};

const statService = {
  syncStats,
  getStats,
  getStatItem,
  updateStatItem,
};

export default statService;