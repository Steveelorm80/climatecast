// components/MobileWeather.jsx
export default function MobileWeather({ city, weather, score, formattedDate }) {
  return (
    <div className="md:hidden bg-blue-500 text-white p-4 rounded-xl mb-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">{city}</p>
          <p className="text-2xl font-bold">{weather?.temperature}°C</p>
          <p className="capitalize">{weather?.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">{score?.bestDayName}</p>
          <p className="text-sm">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}