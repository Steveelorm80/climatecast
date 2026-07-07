// components/StatsCards.jsx
// export default function StatsCards({ weather, estimateWindFromCondition }) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-bold">💨 Wind</h3>
//         <p>{weather?.wind ? `${weather.wind} m/s` : estimateWindFromCondition(weather?.condition)}</p>
//       </div>
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-bold">💧 Humidity</h3>
//         <p>{weather?.humidity}%</p>
//       </div>
//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="font-bold">🌡 Temperature</h3>
//         <p>{weather?.temperature}°C</p>
//       </div>
//     </div>
//   );
// }
// components/StatsCards.jsx
export default function StatsCards({ weather, estimateWindFromCondition }) {
  const stats = [
    { 
      title: "UV Index", 
      value: "Moderate", 
      icon: "☀️", 
      detail: "4-6",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      title: "Wind Status", 
      value: weather?.wind ? `${weather.wind} m/s` : estimateWindFromCondition(weather?.condition), 
      icon: "💨", 
      detail: "WSW",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      title: "Humidity", 
      value: `${weather?.humidity}%`, 
      icon: "💧", 
      detail: "Normal",
      color: "from-blue-400 to-blue-600"
    },
    { 
      title: "Visibility", 
      value: "10 km", 
      icon: "👁️", 
      detail: "Good",
      color: "from-green-400 to-green-600"
    },
    { 
      title: "Air Quality", 
      value: "Moderate", 
      icon: "🌫️", 
      detail: "AQI 42",
      color: "from-yellow-400 to-orange-500"
    },
    { 
      title: "Sunrise/Sunset", 
      value: "6:45 AM", 
      icon: "🌅", 
      detail: "Sunset 6:45 PM",
      color: "from-orange-400 to-red-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      <h3 className="text-lg font-bold text-gray-700 col-span-full">TODAY'S HIGHLIGHTS</h3>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg text-white`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xs opacity-80">{stat.detail}</span>
          </div>
          <p className="text-sm opacity-90">{stat.title}</p>
          <p className="text-xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}