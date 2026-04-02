// import axios from "axios";

// const API = axios.create({
//   //baseURL: "http://localhost:8081",
//   baseURL: "http://127.0.0.1:8081",
// });

// export const getWeather = (city) => API.get(`/weather?city=${city}`);
// export const getBestDay = (city) => API.get(`/weather/best-day?city=${city}`);
// export const getForecast = (city) => API.get(`/weather/forecast?city=${city}`);

import axios from "axios";

// Event Service URL (your backend on Render)
const EVENT_API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EVENT_API_URL || "https://climatecast-event.onrender.com",
});

// Weather Service URL (for forecast data only)
const WEATHER_API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEATHER_API_URL || "https://climatecast-6lun.onrender.com",
});

// Keep existing weather service calls (for forecast and best day)
export const getWeather = (city) => WEATHER_API.get(`/weather?city=${city}`);
export const getBestDay = (city) => WEATHER_API.get(`/weather/best-day?city=${city}`);
export const getForecast = (city) => WEATHER_API.get(`/weather/forecast?city=${city}`);

// NEW: Event service calls with risk assessment
export const createEventWithRisk = async (eventData) => {
  const response = await EVENT_API.post('/events', eventData);
  return response.data; // Returns { event, eventRisk, recommendation, weather }
};

export const getAllEvents = async () => {
  const response = await EVENT_API.get('/events');
  return response.data;
};

export const getEventRisk = async (eventId) => {
  const response = await EVENT_API.get(`/events/${eventId}`);
  return response.data;
};