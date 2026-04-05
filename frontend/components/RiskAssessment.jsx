// components/RiskAssessment.jsx
"use client";

import { getRiskColor } from "@/utils/riskUtils";

export default function RiskAssessment({ 
  eventName, 
  setEventName, 
  loadingRisk, 
  riskAssessment, 
  assessEventRisk,
  city 
}) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4">🎯 Event Risk Assessment</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Event name (e.g., Music Festival)"
          className="flex-1 border px-3 py-2 rounded-lg"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
        <button
          onClick={assessEventRisk}
          disabled={loadingRisk}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 whitespace-nowrap"
        >
          {loadingRisk ? "Assessing..." : "Assess Risk"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loadingRisk && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-blue-800 font-medium">Analyzing weather data...</p>
              <p className="text-blue-600 text-sm">Checking conditions in {city}</p>
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
          <p className="mb-3">{riskAssessment.recommendation}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-3 pt-3 border-t border-white/20">
            <div>
              <p className="text-sm opacity-90">Temperature</p>
              <p className="font-bold">{riskAssessment.weather?.temperature}°C</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Condition</p>
              <p className="font-bold capitalize">{riskAssessment.weather?.condition}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Humidity</p>
              <p className="font-bold">{riskAssessment.weather?.humidity}%</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Wind</p>
              <p className="font-bold">{riskAssessment.weather?.wind} m/s</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Rain</p>
              <p className="font-bold">{riskAssessment.weather?.rainProbability}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}