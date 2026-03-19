"use client";

import { useEffect, useState } from "react";
import { getWeather, getBestDay, getForecast } from "@/services/api";
import WeatherChart from "@/components/WeatherChart";


export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [score, setScore] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const w = await getWeather("London");
        const s = await getBestDay("London");
        const f = await getForecast("London");
        
        setWeather(w.data);
        setScore(s.data);
        setForecast(f.data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    fetchData();
  }, []);

  const chartData =
    forecast?.list?.slice(0, 10).map((item) => ({
      time: item.dt_txt,
      temp: item.main.temp,
    })) || [];
    const formattedDate = score
  ? new Date(score.bestDay).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  : "";

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold">🌍 ClimateCast Dashboard</h1>

     {score && (
  <>
    {/* SCORE */}
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
      <h2 className="text-2xl font-bold">
        🌟 Best Day: {score.bestDayName} ({formattedDate})
      </h2>
      <p className="text-lg mt-2">
        Score: {Math.round(score.score)}
      </p>
    </div>

    {/* AI INSIGHT */}
    <div className="bg-green-100 text-black p-4 rounded-xl">
      <h2 className="font-bold">🧠 AI Insight</h2>
      <p>
        {score.score > 700
          ? "Perfect weather for outdoor events."
          : score.score > 500
          ? "Moderate conditions, plan carefully."
          : "High risk, consider rescheduling."}
      </p>
    </div>
  </>
)}

   

      {/* WEATHER */}
      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-white text-black p-4 rounded-xl shadow">
            <h2 className="font-bold">🌡 Temperature</h2>
            <p>{weather.temperature}°C</p>
          </div>

          <div className="bg-white text-black p-4 rounded-xl shadow">
            <h2 className="font-bold">💧 Humidity</h2>
            <p>{weather.humidity}%</p>
          </div>

          <div className="bg-white text-black p-4 rounded-xl shadow">
            <h2 className="font-bold">💨 Wind</h2>
            <p>{weather.wind} m/s</p>
          </div>

          <div className="bg-white text-black p-4 rounded-xl shadow md:col-span-3">
            <h2 className="font-bold">🌤 Condition</h2>
            <p>{weather.description}</p>
          </div>

        </div>
      )}
       {/* ✅ CHART */}
      {forecast && <WeatherChart data={chartData} />}
    </div>
  );
}