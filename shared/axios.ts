import axios from "axios";
import authenticationSession from "./authenticationSession";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

request.interceptors.request.use(async function (config) {
  let userInfo = authenticationSession.getAuthentication();
  config.headers["Accept"] = "application/json";
  if (userInfo?.access_token) {
    config.headers["Authorization"] = `Bearer ${userInfo.access_token}`;
  }

  return config;
});

request.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    return Promise.reject(error);
  }
);
