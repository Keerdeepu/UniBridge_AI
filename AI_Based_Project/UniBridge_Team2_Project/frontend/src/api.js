import axios from "axios";

const API_URL = "http://127.0.0.1:8000";


export const searchInternships = async (data) => {
  const response = await axios.post(`${API_URL}/search`, data);
  return response.data.results;
};
