import axios from "axios";

const API = axios.create({
  //baseURL: "http://localhost:8081",
  baseURL: "http://127.0.0.1:8081",
});

export const getWeather = (city) => API.get(`/weather?city=${city}`);
export const getBestDay = (city) => API.get(`/weather/best-day?city=${city}`);
export const getForecast = (city) => API.get(`/weather/forecast?city=${city}`);