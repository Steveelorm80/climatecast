import axios from "axios";

// Single unified backend (climatecast-api)
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

// Attach Clerk session token (JWT) to every request when signed in
API.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined" && window.Clerk?.session) {
    const token = await window.Clerk.session.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Weather
export const getWeather = (city) => API.get(`/weather?city=${city}`);
export const getBestDay = (city) => API.get(`/weather/best-day?city=${city}`);
export const getForecast = (city) => API.get(`/weather/forecast?city=${city}`);
export const getRiskForDate = (city, date) =>
  API.get(`/weather/risk?city=${city}&date=${date}`);

// Events with risk assessment
export const createEventWithRisk = async (eventData) => {
  const response = await API.post("/events", eventData);
  return response.data; // { event, eventRisk, recommendation, weather }
};

export const getAllEvents = async () => {
  const response = await API.get("/events");
  return response.data;
};

export const getEventRisk = async (eventId) => {
  const response = await API.get(`/events/${eventId}`);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await API.put(`/events/${eventId}`, eventData);
  return response.data; // { success, event } or { success: false, message }
};

export const deleteEvent = async (eventId) => {
  const response = await API.delete(`/events/${eventId}`);
  return response.data;
};
