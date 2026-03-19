"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeatherChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-bold mb-2">📈 Temperature Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temp" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}