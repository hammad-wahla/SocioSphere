import axios from "axios";

const baseURL =
  "https://69f218f0-915f-473f-9072-57a577b86780-00-1sjx3pcr451nc.pike.replit.dev";
// const baseURL = "http://localhost:4000";

// Create axios instance with default configuration
const API = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

export const getDataAPI = async (url, token) => {
  const res = await API.get(url, {
    headers: { Authorization: token },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await API.post(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await API.put(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await API.patch(url, post, {
    headers: { Authorization: token },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await API.delete(url, {
    headers: { Authorization: token },
  });
  return res;
};
