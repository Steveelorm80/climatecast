// components/RiskAssessment.jsx
"use client";

import { getRiskColor } from "@/utils/riskUtils";

export default function RiskAssessment({
  eventName,
  setEventName,
  eventDate,
  setEventDate,
  loadingRisk,
  riskAssessment,
  assessEventRisk,
  city
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-navy-900 border border-navy-700 p-4 md:p-6 rounded-2xl mb-6">
      <h2 className="text-xl font-bold text-ink-100 mb-4">🎯 Event Risk Assessment</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Event name (e.g., Music Festival)"
          className="flex-1 bg-navy-800 border border-navy-700 text-ink-100 placeholder-ink-500 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <input
          type="date"
          className="bg-navy-800 border border-navy-700 text-ink-100 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
          value={eventDate}
          min={today}
          onChange={(e) => setEventDate(e.target.value)}
          title="Event date"
        />
        <button
          onClick={assessEventRisk}
          disabled={loadingRisk}
          className="bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-semibold px-6 py-2 rounded-lg disabled:bg-navy-700 disabled:text-ink-500 whitespace-nowrap"
        >
          {loadingRisk ? "Assessing..." : "Assess Risk"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loadingRisk && (
        <div className="mt-4 p-4 bg-navy-800 rounded-lg border border-navy-700">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-400"></div>
            <div>
              <p className="text-ink-100 font-medium">Analyzing weather data...</p>
              <p className="text-ink-500 text-sm">Checking conditions in {city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Display Risk Assessment Results */}
      {riskAssessment && (
        <div className={`p-4 rounded-lg mt-4 ${getRiskColor(riskAssessment.eventRisk)}`}>
          <h3 className="text-xl font-bold mb-2">
            Risk Level: {riskAssessment.eventRisk}
          </h3>
          <p className="mb-3 opacity-90">{riskAssessment.recommendation}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-white/10">
            <div>
              <p className="text-sm opacity-70">Temperature</p>
              <p className="font-bold">{riskAssessment.weather?.temperature}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Condition</p>
              <p className="font-bold capitalize">{riskAssessment.weather?.condition}</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Humidity</p>
              <p className="font-bold">{riskAssessment.weather?.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Wind</p>
              <p className="font-bold">{riskAssessment.weather?.wind} m/s</p>
            </div>
            <div>
              <p className="text-sm opacity-70">Rain</p>
              <p className="font-bold">{riskAssessment.weather?.rainProbability}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
