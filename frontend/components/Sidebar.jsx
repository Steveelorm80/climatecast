// //components/Sidebar.jsx
// export default function Sidebar({ city, weather, score, formattedDate, currentDate }) {
//   return (
//     <div className="hidden md:block w-64 bg-blue-500 text-white p-6">
//       <h2 className="text-2xl font-bold mb-2">ClimateCast</h2>
//       <p className="text-sm opacity-80">{city}</p>
//       <p className="text-lg mt-4">{weather?.temperature}°C</p>
//       <p className="capitalize">{weather?.description}</p>
//       <div className="mt-6 text-sm">
//         <p className="opacity-75">Current Date</p>
//         <p className="font-semibold">{currentDate}</p>
//       </div>
//     </div>
//   );
// }
// components/Sidebar.jsx
export default function Sidebar({ city, weather, currentDate }) {
  // Get current date
  const date = currentDate || new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  return (
    <div className="hidden md:block w-80 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white p-6 shadow-xl">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌤️</div>
        <h2 className="text-2xl font-bold">ClimateCast</h2>
        <p className="text-sm opacity-80 mt-1">AI Weather Intelligence</p>
      </div>

      {/* Location */}
      <div className="border-t border-b border-white/20 py-4 mb-4">
        <p className="text-sm opacity-75">Location</p>
        <p className="text-xl font-semibold">{city}</p>
      </div>

      {/* Current Weather */}
      <div className="text-center mb-6">
        <p className="text-6xl font-bold mb-2">{weather?.temperature}°C</p>
        <p className="text-xl capitalize mb-1">{weather?.description}</p>
        <p className="text-sm opacity-75">Feels like {Math.round(weather?.temperature)}°C</p>
      </div>

      {/* Current Date */}
      <div className="bg-white/10 rounded-lg p-3 text-center">
        <p className="text-sm opacity-75">Today's Date</p>
        <p className="font-semibold">{date}</p>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="opacity-75">💧 Humidity</span>
          <span className="font-semibold">{weather?.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-75">💨 Wind</span>
          <span className="font-semibold">{weather?.wind ? `${weather.wind} m/s` : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-75">🌡️ Pressure</span>
          <span className="font-semibold">1013 hPa</span>
        </div>
      </div>
    </div>
  );
}