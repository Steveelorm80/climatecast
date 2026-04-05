
"use client";

import { useEffect, useState } from "react";
import { getWeather, getBestDay, getForecast, createEventWithRisk } from "@/services/api";
import WeatherChart from "@/components/WeatherChart";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MobileWeather from "@/components/MobileWeather";
import RiskAssessment from "@/components/RiskAssessment";
import BestDayCard from "@/components/BestDayCard";
import AIInsight from "@/components/AIInsight";
import StatsCards from "@/components/StatsCards";
import Footer from "@/components/Footer";
import { estimateWindFromCondition } from "@/utils/riskUtils";

export default function Dashboard() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [score, setScore] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const w = await getWeather(city);
        const s = await getBestDay(city);
        const f = await getForecast(city);
        
        setWeather(w.data);
        setScore(s.data);
        setForecast(f.data);
      } catch (err) {
        console.error("ERROR:", err);
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
        date: new Date().toISOString().split('T')[0],
        description: `Weather risk assessment for ${eventName} in ${city}`
      });
      
      setRiskAssessment(result);
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

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <Header city={city} setCity={setCity} />

      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar 
          city={city} 
          weather={weather} 
          score={score} 
          formattedDate={formattedDate} 
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
            loadingRisk={loadingRisk}
            riskAssessment={riskAssessment}
            assessEventRisk={assessEventRisk}
            city={city}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BestDayCard score={score} formattedDate={formattedDate} />
            <AIInsight score={score} />

            <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow overflow-x-auto">
              {forecast && <WeatherChart data={chartData} />}
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