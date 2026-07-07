// // components/MobileWeather.jsx
// export default function MobileWeather({ city, weather, score, formattedDate }) {
//   const currentDate = new Date().toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
  
//   return (
//     <div className="md:hidden bg-blue-500 text-white p-4 rounded-xl mb-4">
//       <div className="flex justify-between items-center">
//         <div>
//           <p className="font-bold text-lg">{city}</p>
//           <p className="text-2xl font-bold">{weather?.temperature}°C</p>
//           <p className="capitalize">{weather?.description}</p>
//         </div>
//         <div className="text-right">
//           <p className="text-sm opacity-75">Today</p>
//           <p className="text-sm font-semibold">{currentDate}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
// components/MobileWeather.jsx
export default function MobileWeather({ city, weather, currentDate }) {
  const date = currentDate || new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  
  return (
    <div className="md:hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl mb-4 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">📍 Current Location</p>
          <p className="font-bold text-xl">{city}</p>
          <p className="text-4xl font-bold mt-2">{weather?.temperature}°C</p>
          <p className="capitalize text-sm opacity-90">{weather?.description}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl mb-2">🌤️</div>
          <p className="text-xs opacity-80">Today</p>
          <p className="text-sm font-semibold">{date}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-white/20">
        <div>
          <p className="text-xs opacity-80">💧 Humidity</p>
          <p className="font-semibold">{weather?.humidity}%</p>
        </div>
        <div>
          <p className="text-xs opacity-80">💨 Wind</p>
          <p className="font-semibold">{weather?.wind ? `${weather.wind} m/s` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs opacity-80">🌡️ Feels Like</p>
          <p className="font-semibold">{weather?.temperature}°C</p>
        </div>
      </div>
    </div>
  );
}