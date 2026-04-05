// components/Sidebar.jsx
export default function Sidebar({ city, weather, score, formattedDate }) {
  return (
    <div className="hidden md:block w-64 bg-blue-500 text-white p-6">
      <h2 className="text-2xl font-bold mb-2">ClimateCast</h2>
      <p className="text-sm opacity-80">{city}</p>
      <p className="text-lg mt-4">{weather?.temperature}°C</p>
      <p className="capitalize">{weather?.description}</p>
      <div className="mt-6 text-sm">
        <p>{score?.bestDayName}</p>
        <p>{formattedDate}</p>
      </div>
    </div>
  );
}