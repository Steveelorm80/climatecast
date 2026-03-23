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

    {/* ✅ HEADER (FULL WIDTH) */}
    <div className="bg-white p-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">📊 Climate Dashboard</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city..."
          className="border px-3 py-2 rounded-lg"
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

    {/* ✅ BODY (SIDEBAR + MAIN) */}
    <div className="flex flex-1">

      {/* SIDEBAR */}
      <div className="w-64 bg-blue-500 text-white p-6">
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
      <div className="flex-1 p-6">

  {/* GRID SYSTEM */}
  <div className="grid grid-cols-3 gap-6">

    {/* BEST DAY (FULL WIDTH) */}
    <div className="col-span-3 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold">
        🌟 Best Day: {score?.bestDayName} ({formattedDate})
      </h2>
      <p>Score: {Math.round(score?.score || 0)}</p>
    </div>

    {/* AI INSIGHT (FULL WIDTH) */}
    {score && (
      <div className="col-span-3 bg-green-100 p-4 rounded-xl">
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

    {/* CHART (LEFT BIG) */}
    <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
      {forecast && <WeatherChart data={chartData} />}
    </div>

    {/* RIGHT SIDE STATS */}
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

    {/* ✅ FOOTER (FULL WIDTH) */}
    <div className="bg-white text-center p-4 text-sm text-gray-500 shadow">
      © 2026 ClimateCast • AI Weather Intelligence Platform
    </div>

  </div>
);
}