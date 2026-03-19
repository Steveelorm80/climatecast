package com.climatecast.weather_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import com.climatecast.weather_service.model.WeatherResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openweather.api.key}")
    private String apiKey;

    @Cacheable(value = "weather", key = "#city.toLowerCase()")
    public WeatherResponse getWeather(String city){

        String url = "https://api.openweathermap.org/data/2.5/weather?q="
                + city + "&units=metric&appid=" + apiKey;
               
        System.out.println("Calling external API...");

        Map response = restTemplate.getForObject(url, Map.class);

        Map main = (Map) response.get("main");
        Map wind = (Map) response.get("wind");
        List weatherList = (List) response.get("weather");
        Map weather = (Map) weatherList.get(0);

        return new WeatherResponse(
                (String) response.get("name"),
                ((Number) main.get("temp")).doubleValue(),
                ((Number) main.get("humidity")).intValue(),
                ((Number) wind.get("speed")).doubleValue(),
                (String) weather.get("description")
        );
    }
    public Map getForecast(String city) {

    String url = "https://api.openweathermap.org/data/2.5/forecast?q="
            + city + "&units=metric&appid=" + apiKey;

    return restTemplate.getForObject(url, Map.class);
}
    
    public Map<String, Object> calculateRisk(String city, String date) {

    Map forecast = getForecast(city);
    List<Map> list = (List<Map>) forecast.get("list");

    double totalRain = 0;
    double avgTemp = 0;
    double maxWind = 0;
    int count = 0;

    for (Map item : list) {

        String dtTxt = (String) item.get("dt_txt");

        if (dtTxt.startsWith(date)) {

            Map main = (Map) item.get("main");
            Map wind = (Map) item.get("wind");

            avgTemp += ((Number) main.get("temp")).doubleValue();
            maxWind = Math.max(maxWind, ((Number) wind.get("speed")).doubleValue());

            if (item.containsKey("rain")) {
                Map rain = (Map) item.get("rain");
                totalRain += ((Number) rain.getOrDefault("3h", 0)).doubleValue();
            }

            count++;
        }
    }

    avgTemp = count > 0 ? avgTemp / count : 0;

    double rainProbability = Math.min(100, totalRain * 10); // simple estimate
     double comfortScore = 100;

// Temperature comfort (ideal ~20°C)
if (avgTemp < 10) comfortScore -= 30;
else if (avgTemp > 30) comfortScore -= 20;

// Wind penalty
if (maxWind > 8) comfortScore -= 20;

// Rain penalty
if (totalRain > 3) comfortScore -= 30;

comfortScore = Math.max(0, comfortScore);

    // 🔥 Risk logic (simple but powerful)
    String risk;
String recommendation;

if (comfortScore < 40) {
    risk = "HIGH";
    recommendation = "High risk: reschedule event";
} else if (comfortScore < 70) {
    risk = "MEDIUM";
    recommendation = "Moderate risk: consider indoor backup";
} else {
    risk = "LOW";
    recommendation = "Great conditions for outdoor event";
}

    Map<String, Object> result = new java.util.HashMap<>();
    result.put("city", city);
    result.put("eventRisk", risk);
    result.put("rainAmount", totalRain);
    result.put("avgTemp", avgTemp);
    result.put("maxWind", maxWind);
    result.put("recommendation", recommendation);
    result.put("rainProbability", rainProbability);
    result.put("comfortScore", comfortScore);

    return result;
}

    public Map<String, Object> findBestDay(String city) {

    Map forecast = getForecast(city);
    List<Map> list = (List<Map>) forecast.get("list");

    Map<String, Double> dayScores = new HashMap<>();

    for (Map item : list) {

        String dtTxt = (String) item.get("dt_txt");
        String date = dtTxt.split(" ")[0];

        Map main = (Map) item.get("main");
        Map wind = (Map) item.get("wind");

        double temp = ((Number) main.get("temp")).doubleValue();
        double windSpeed = ((Number) wind.get("speed")).doubleValue();

        double rain = 0;
        if (item.containsKey("rain")) {
            Map rainMap = (Map) item.get("rain");
            rain = ((Number) rainMap.getOrDefault("3h", 0)).doubleValue();
        }

        // simple score per time slot
        double score = 100;

        if (temp < 10) score -= 20;
        if (windSpeed > 8) score -= 20;
        if (rain > 2) score -= 40;

        dayScores.put(date, dayScores.getOrDefault(date, 0.0) + score);
    }

    // find best day
    String bestDay = null;
    double bestScore = -1;

    for (String day : dayScores.keySet()) {
        double avgScore = dayScores.get(day);

        if (avgScore > bestScore) {
            bestScore = avgScore;
            bestDay = day;
        }
    }
    LocalDate dateObj = LocalDate.parse(bestDay);
    String dayName = dateObj.getDayOfWeek().toString();
    dayName = dayName.substring(0,1) + dayName.substring(1).toLowerCase();

    Map<String, Object> result = new HashMap<>();
    result.put("city", city);
    result.put("bestDay", bestDay);
    result.put("score", bestScore);
    result.put("bestDayName", dayName);

    return result;
}
}
