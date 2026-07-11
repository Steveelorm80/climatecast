// components/MobileWeather.jsx
export default function MobileWeather({ city, weather, currentDate }) {
  const date = currentDate || new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="md:hidden bg-navy-900 border border-navy-700 text-ink-100 p-5 rounded-2xl mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-ink-500">📍 Current Location</p>
          <p className="font-bold text-xl">{city}</p>
          <p className="text-4xl font-bold mt-2 text-emerald-400">
            {weather?.temperature}°C
          </p>
          <p className="capitalize text-sm text-ink-300">{weather?.description}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl mb-2">🌤️</div>
          <p className="text-xs text-ink-500">Today</p>
          <p className="text-sm font-semibold">{date}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-navy-700">
        <div>
          <p className="text-xs text-ink-500">💧 Humidity</p>
          <p className="font-semibold">{weather?.humidity}%</p>
        </div>
        <div>
          <p className="text-xs text-ink-500">💨 Wind</p>
          <p className="font-semibold">
            {weather?.wind ? `${weather.wind} m/s` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-500">🌡️ Feels Like</p>
          <p className="font-semibold">
            {weather?.feelsLike != null ? Math.round(weather.feelsLike) : weather?.temperature}°C
          </p>
        </div>
      </div>
    </div>
  );
}
