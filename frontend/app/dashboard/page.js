"use client";

import { useEffect, useState } from "react";
import { getWeather, getBestDay, getForecast } from "@/services/api";
import WeatherChart from "@/components/WeatherChart";


export default function Dashboard() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [score, setScore] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const w = await getWeather(city);
        const s = await getBestDay(city);
        const f = await getForecast(city);
        
        setWeather(w.data);
        setScore(s.data);
        setForecast(f.data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    }

    fetchData();
  }, [city]);

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
  <div className="min-h-screen bg-gray-100 text-black flex flex-col">

    {/* ✅ HEADER */}
    <div className="bg-white p-4 shadow flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <h1 className="text-xl font-bold">📊 Climate Dashboard</h1>

      <div className="flex gap-2 w-full md:w-auto">
        <input
          type="text"
          placeholder="Enter city..."
          className="border px-3 py-2 rounded-lg w-full md:w-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter") setCity(e.target.value);
          }}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            const input = document.querySelector("input").value;
            setCity(input);
          }}
        >
          Search
        </button>
      </div>
    </div>

    {/* ✅ BODY */}
    <div className="flex flex-1">

      {/* SIDEBAR (hidden on mobile) */}
      <div className="hidden md:block w-64 bg-blue-500 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">ClimateCast</h2>
        <p className="text-sm opacity-80">{city}</p>

        <p className="text-lg mt-4">{weather?.temperature}°C</p>
        <p className="capitalize">{weather?.description}</p>

        <div className="mt-6 text-sm">
          <p>{score?.bestDayName}</p>
          <p>{formattedDate}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6">

        {/* 📱 MOBILE WEATHER SUMMARY */}
        <div className="md:hidden bg-blue-500 text-white p-4 rounded-xl mb-4">
          <p className="font-bold">{city}</p>
          <p>
            {weather?.temperature}°C • {weather?.description}
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* BEST DAY */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold">
              🌟 Best Day: {score?.bestDayName} ({formattedDate})
            </h2>
            <p>Score: {Math.round(score?.score || 0)}</p>
          </div>

          {/* AI INSIGHT */}
          {score && (
            <div className="md:col-span-3 bg-green-100 p-4 rounded-xl">
              <h2 className="font-bold">🧠 AI Insight</h2>
              <p>
                {score.score > 700
                  ? "Perfect weather for outdoor events."
                  : score.score > 500
                  ? "Moderate conditions, plan carefully."
                  : "High risk, consider rescheduling."}
              </p>
            </div>
          )}

          {/* CHART */}
          <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow">
            {forecast && <WeatherChart data={chartData} />}
          </div>

          {/* STATS */}
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold">💨 Wind</h3>
              <p>{weather?.wind} m/s</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold">💧 Humidity</h3>
              <p>{weather?.humidity}%</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold">🌡 Temperature</h3>
              <p>{weather?.temperature}°C</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* ✅ FOOTER */}
<div className="bg-white text-center p-4 text-sm text-gray-500 shadow">
  © 2026 ClimateCast • Built by 
  <a
    href="https://github.com/steveelorm80"
    target="_blank"
    rel="noopener noreferrer"
    className="font-semibold text-blue-600 hover:underline"
  >
     @steveelorm80 (Stephen Kwaku Pometsey))
  </a> • AI Weather Intelligence Platform
</div>

  </div>
);
}