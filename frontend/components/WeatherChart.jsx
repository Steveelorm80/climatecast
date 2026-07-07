// "use client";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export default function WeatherChart({ data }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow">
//       <h2 className="font-bold mb-2">📈 Temperature Trend</h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <XAxis dataKey="time" hide />
//           <YAxis />
//           <Tooltip />
//           <Line type="monotone" dataKey="temp" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// components/WeatherCharts.jsx
"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function WeatherCharts({ forecast }) {
  if (!forecast || !forecast.list) return null;

  // Prepare data for the next 24 hours (8 readings, 3-hour intervals)
  const chartData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt_txt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    temperature: Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind: Math.round(item.wind.speed),
    day: new Date(item.dt_txt).toLocaleDateString([], { weekday: 'short' })
  }));

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🌡️</span> Temperature Trend (°C)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              fill="#fecaca"
              fillOpacity={0.3}
              name="Temperature (°C)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>💧</span> Humidity Trend (%)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wind Speed Chart */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>💨</span> Wind Speed Trend (m/s)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wind"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              name="Wind Speed (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}