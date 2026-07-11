// components/StatsCards.jsx
"use client";

function Gauge({ fraction, color, label }) {
  const clamped = Math.max(0, Math.min(1, fraction || 0));
  const semi = Math.PI * 50; // semicircle length for r=50
  return (
    <svg viewBox="0 0 120 70" className="w-28 mx-auto" role="img" aria-label={label}>
      <path
        d="M 10 65 A 50 50 0 0 1 110 65"
        fill="none"
        stroke="#1e2a45"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 10 65 A 50 50 0 0 1 110 65"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${semi * clamped} ${semi}`}
      />
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fill="#f0f4fa"
        fontSize="17"
        fontWeight="600"
      >
        {label}
      </text>
    </svg>
  );
}

// Format a unix timestamp in the city's local time
function cityTime(unix, tzOffsetSeconds) {
  if (!unix) return "—";
  return new Date((unix + (tzOffsetSeconds || 0)) * 1000).toLocaleTimeString(
    "en-GB",
    { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }
  );
}

export default function StatsCards({ weather }) {
  const wind = weather?.wind ?? null;
  const humidity = weather?.humidity ?? null;

  // UV index (real, from Open-Meteo via backend)
  const uv = weather?.uvIndex ?? null;
  const uvLabel =
    uv == null ? "No data"
    : uv < 3 ? "Low"
    : uv < 6 ? "Moderate"
    : uv < 8 ? "High"
    : uv < 11 ? "Very high"
    : "Extreme";

  // Visibility (meters -> km)
  const visKm = weather?.visibility != null ? weather.visibility / 1000 : null;
  const visLabel =
    visKm == null ? "No data" : visKm >= 10 ? "Good" : visKm >= 4 ? "Moderate" : "Poor";

  // Air quality (OpenWeather AQI 1-5 + PM2.5)
  const aqi = weather?.aqi ?? null;
  const aqiColor =
    aqi == null ? "#6b7a93" : aqi <= 2 ? "#34d399" : aqi === 3 ? "#fbbf24" : "#f87171";

  // Daylight progress in the city's timezone
  const sunrise = weather?.sunrise;
  const sunset = weather?.sunset;
  const nowUnix = Date.now() / 1000;
  const dayFrac =
    sunrise && sunset && sunset > sunrise
      ? (nowUnix - sunrise) / (sunset - sunrise)
      : 0;

  const stats = [
    {
      title: "UV Index",
      icon: "☀️",
      detail: uvLabel,
      color: "#fbbf24",
      fraction: uv != null ? uv / 11 : 0,
      label: uv != null ? uv.toFixed(1) : "—",
    },
    {
      title: "Wind",
      icon: "💨",
      detail: "m/s",
      color: "#38bdf8",
      fraction: wind != null ? wind / 20 : 0,
      label: wind != null ? `${wind}` : "—",
    },
    {
      title: "Humidity",
      icon: "💧",
      detail: humidity != null && humidity > 70 ? "High" : "Normal",
      color: "#60a5fa",
      fraction: humidity != null ? humidity / 100 : 0,
      label: humidity != null ? `${humidity}%` : "—",
    },
    {
      title: "Visibility",
      icon: "👁️",
      detail: visLabel,
      color: "#34d399",
      fraction: visKm != null ? Math.min(visKm / 10, 1) : 0,
      label: visKm != null ? `${Math.round(visKm)} km` : "—",
    },
    {
      title: "Air Quality",
      icon: "🌫️",
      detail: weather?.pm25 != null
        ? `${weather.aqiLabel} · PM2.5 ${Math.round(weather.pm25)}`
        : weather?.aqiLabel || "No data",
      color: aqiColor,
      fraction: aqi != null ? aqi / 5 : 0,
      label: aqi != null ? `${aqi}/5` : "—",
    },
    {
      title: "Daylight",
      icon: "🌅",
      detail: `${cityTime(sunrise, weather?.timezone)} – ${cityTime(sunset, weather?.timezone)}`,
      color: "#fb923c",
      fraction: dayFrac,
      label:
        dayFrac <= 0 ? "Night" : dayFrac >= 1 ? "Night" : `${Math.round(dayFrac * 100)}%`,
    },
  ];

  return (
    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <h3 className="text-sm font-bold text-ink-500 tracking-widest col-span-full">
        TODAY'S HIGHLIGHTS
      </h3>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-navy-900 border border-navy-700 p-4 rounded-xl"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl">{stat.icon}</span>
            <span className="text-sm text-ink-500">{stat.title}</span>
          </div>
          <Gauge fraction={stat.fraction} color={stat.color} label={stat.label} />
          <p className="text-center text-xs text-ink-500 mt-1">{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}
