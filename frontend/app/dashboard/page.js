
// "use client";

// import { useEffect, useState } from "react";
// import { getWeather, getBestDay, getForecast, createEventWithRisk } from "@/services/api";
// import WeatherChart from "@/components/WeatherChart";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
// import MobileWeather from "@/components/MobileWeather";
// import RiskAssessment from "@/components/RiskAssessment";
// import BestDayCard from "@/components/BestDayCard";
// import AIInsight from "@/components/AIInsight";
// import StatsCards from "@/components/StatsCards";
// import Footer from "@/components/Footer";
// import { estimateWindFromCondition } from "@/utils/riskUtils";

// export default function Dashboard() {
//   const [city, setCity] = useState("London");
//   const [weather, setWeather] = useState(null);
//   const [score, setScore] = useState(null);
//   const [forecast, setForecast] = useState(null);
//   const [riskAssessment, setRiskAssessment] = useState(null);
//   const [loadingRisk, setLoadingRisk] = useState(false);
//   const [eventName, setEventName] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const w = await getWeather(city);
//         const s = await getBestDay(city);
//         const f = await getForecast(city);
        
//         setWeather(w.data);
//         setScore(s.data);
//         setForecast(f.data);
//       } catch (err) {
//         console.error("ERROR:", err);
//       }
//     }

//     fetchData();
//   }, [city]);

//   const assessEventRisk = async () => {
//     if (!eventName.trim()) {
//       alert("Please enter an event name");
//       return;
//     }
    
//     if (!city || city.trim() === "") {
//       alert("Please enter a city");
//       return;
//     }
    
//     setLoadingRisk(true);
    
//     try {
//       console.log("Assessing weather risk for:", eventName, "in", city);
      
//       const result = await createEventWithRisk({
//         name: eventName,
//         city: city,
//         date: new Date().toISOString().split('T')[0],
//         description: `Weather risk assessment for ${eventName} in ${city}`
//       });
      
//       setRiskAssessment(result);
//       console.log("Risk Assessment Result:", result);
//       console.log(`Risk level: ${result.eventRisk} - ${result.recommendation}`);
      
//     } catch (err) {
//       console.error("Risk assessment error details:", err);
      
//       if (err.code === 'ECONNABORTED') {
//         alert("Request timeout. Please check your network and try again.");
//       } else if (err.response) {
//         alert(`Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`);
//       } else if (err.request) {
//         alert("Cannot connect to event service. Please check if the backend is running.");
//       } else {
//         alert(`Failed to assess risk: ${err.message}`);
//       }
//     } finally {
//       setLoadingRisk(false);
//     }
//   };

//   const chartData = forecast?.list?.slice(0, 10).map((item) => ({
//     time: item.dt_txt,
//     temp: item.main.temp,
//   })) || [];
    
//   const formattedDate = score
//     ? new Date(score.bestDay).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       })
//     : "";

//   return (
//     <div className="min-h-screen bg-gray-100 text-black flex flex-col">
//       <Header city={city} setCity={setCity} />

//       <div className="flex flex-1 flex-col md:flex-row">
//         <Sidebar 
//           city={city} 
//           weather={weather} 
//           score={score} 
//           formattedDate={formattedDate} 
//         />

//         <div className="flex-1 p-4 md:p-6 w-full">
//           <MobileWeather 
//             city={city} 
//             weather={weather} 
//             score={score} 
//             formattedDate={formattedDate} 
//           />

//           <RiskAssessment
//             eventName={eventName}
//             setEventName={setEventName}
//             loadingRisk={loadingRisk}
//             riskAssessment={riskAssessment}
//             assessEventRisk={assessEventRisk}
//             city={city}
//           />

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <BestDayCard score={score} formattedDate={formattedDate} />
//             <AIInsight score={score} />

//             <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow overflow-x-auto">
//               {forecast && <WeatherChart data={chartData} />}
//             </div>

//             <StatsCards 
//               weather={weather} 
//               estimateWindFromCondition={estimateWindFromCondition} 
//             />
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { getWeather, getBestDay, getForecast, createEventWithRisk } from "@/services/api";
import WeatherChart from "@/components/WeatherChart";
import WeatherCharts from "@/components/WeatherChart";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileWeather from "@/components/MobileWeather";
import RiskAssessment from "@/components/RiskAssessment";
import MyEvents from "@/components/MyEvents";
import BestDayCard from "@/components/BestDayCard";
import AIInsight from "@/components/AIInsight";
import StatsCards from "@/components/StatsCards";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { estimateWindFromCondition } from "@/utils/riskUtils";

export default function Dashboard() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [score, setScore] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // My Events only appears after the user actively picks a city
  const [hasSelectedCity, setHasSelectedCity] = useState(false);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setHasSelectedCity(true);
  };

  // ✅ Add loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        const [w, s, f] = await Promise.all([
          getWeather(city),
          getBestDay(city),
          getForecast(city)
        ]);
        
        setWeather(w.data);
        setScore(s.data);
        setForecast(f.data);
      } catch (err) {
        console.error("ERROR:", err);
        setError("Failed to load weather data. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [city]);

  const assessEventRisk = async () => {
    if (!eventName.trim()) {
      alert("Please enter an event name");
      return;
    }
    
    if (!city || city.trim() === "") {
      alert("Please enter a city");
      return;
    }
    
    setLoadingRisk(true);
    
    try {
      console.log("Assessing weather risk for:", eventName, "in", city);
      
      const result = await createEventWithRisk({
        name: eventName,
        city: city,
        date: eventDate,
        description: `Weather risk assessment for ${eventName} in ${city}`
      });
      
      setRiskAssessment(result);
      setHasSelectedCity(true); // creating an event also reveals the list
      console.log("Risk Assessment Result:", result);
      console.log(`Risk level: ${result.eventRisk} - ${result.recommendation}`);
      
    } catch (err) {
      console.error("Risk assessment error details:", err);
      
      if (err.code === 'ECONNABORTED') {
        alert("Request timeout. Please check your network and try again.");
      } else if (err.response) {
        alert(`Server error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`);
      } else if (err.request) {
        alert("Cannot connect to event service. Please check if the backend is running.");
      } else {
        alert(`Failed to assess risk: ${err.message}`);
      }
    } finally {
      setLoadingRisk(false);
    }
  };

  const chartData = forecast?.list?.slice(0, 10).map((item) => ({
    time: item.dt_txt,
    temp: item.main.temp,
  })) || [];
    
  const formattedDate = score
    ? new Date(score.bestDay).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const currentDate = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  });

  // ✅ Show loading skeleton while fetching data
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // ✅ Show error state if something went wrong
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <Header city={city} setCity={handleCitySelect} />

      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar 
          city={city} 
          weather={weather} 
          score={score} 
          formattedDate={formattedDate} 
          currentDate={currentDate}
        />

        <div className="flex-1 p-4 md:p-6 w-full">
          <MobileWeather 
            city={city} 
            weather={weather} 
            score={score} 
            formattedDate={formattedDate} 
          />

          <RiskAssessment
            eventName={eventName}
            setEventName={setEventName}
            eventDate={eventDate}
            setEventDate={setEventDate}
            loadingRisk={loadingRisk}
            riskAssessment={riskAssessment}
            assessEventRisk={assessEventRisk}
            city={city}
          />

          {hasSelectedCity && (
            <MyEvents city={city} refreshSignal={riskAssessment} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BestDayCard score={score} formattedDate={formattedDate} />
            <AIInsight score={score} />

            {/* <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow overflow-x-auto">
              {forecast ? <WeatherChart data={chartData} /> : <LoadingSpinner message="Loading chart..." />}
            </div> */}
            {/* WEATHER CHARTS - Takes 2/3 on desktop, full on mobile */}
            <div className="md:col-span-2 space-y-6">
           {forecast && <WeatherCharts forecast={forecast} />}
          </div>

            <StatsCards
              weather={weather}
              estimateWindFromCondition={estimateWindFromCondition}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}