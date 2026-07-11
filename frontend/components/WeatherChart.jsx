// components/WeatherCharts.jsx
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GRID = "#1e2a45";
const MUTED = "#6b7a93";
const tooltipStyle = {
  backgroundColor: "#16203a",
  border: "1px solid #1e2a45",
  borderRadius: "8px",
  color: "#f0f4fa",
};

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-navy-900 border border-navy-700 p-4 rounded-2xl">
      <h3 className="font-bold text-ink-300 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default function WeatherCharts({ forecast }) {
  if (!forecast || !forecast.list) return null;

  const chartData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: Math.round(item.wind.speed),
  }));

  return (
    <div className="space-y-6">
      <ChartCard title="Temperature Trend (°C)" icon="🌡️">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
          <XAxis dataKey="time" tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
          <YAxis tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#f87171"
            fill="#f87171"
            fillOpacity={0.15}
            strokeWidth={2}
            name="Temperature (°C)"
          />
        </AreaChart>
      </ChartCard>

    </div>
  );
}
