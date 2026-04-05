// components/StatsCards.jsx
export default function StatsCards({ weather, estimateWindFromCondition }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-bold">💨 Wind</h3>
        <p>{weather?.wind ? `${weather.wind} m/s` : estimateWindFromCondition(weather?.condition)}</p>
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
  );
}