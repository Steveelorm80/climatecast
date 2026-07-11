// components/Sidebar.jsx
export default function Sidebar({ city, weather, currentDate }) {
  const date = currentDate || new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hidden md:block w-80 bg-navy-900 border-r border-navy-700 text-ink-100 p-6">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌤️</div>
        <h2 className="text-2xl font-bold">ClimateCast</h2>
        <p className="text-sm text-ink-500 mt-1">AI Weather Intelligence</p>
      </div>

      {/* Location */}
      <div className="border-t border-b border-navy-700 py-4 mb-4">
        <p className="text-sm text-ink-500">Location</p>
        <p className="text-xl font-semibold">{city}</p>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-6">
        <p className="text-6xl font-bold mb-2 text-emerald-400">
          {weather?.temperature}°C
        </p>
        <p className="text-xl capitalize mb-1 text-ink-300">{weather?.description}</p>
        <p className="text-sm text-ink-500">
          Feels like {weather?.feelsLike != null ? Math.round(weather.feelsLike) : Math.round(weather?.temperature)}°C
        </p>
      </div>

      {/* Current Date */}
      <div className="bg-navy-800 border border-navy-700 rounded-lg p-3 text-center">
        <p className="text-sm text-ink-500">Today's Date</p>
        <p className="font-semibold">{date}</p>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-500">💧 Humidity</span>
          <span className="font-semibold">{weather?.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-500">💨 Wind</span>
          <span className="font-semibold">
            {weather?.wind ? `${weather.wind} m/s` : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-500">🌡️ Pressure</span>
          <span className="font-semibold">
            {weather?.pressure != null ? `${weather.pressure} hPa` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
