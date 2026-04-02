
package com.climatecast.weather_service.service;

import com.climatecast.weather_service.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openweather.api.key}")
    private String apiKey;

    private static final double IDEAL_TEMP = 20.0;
    private static final double WIND_THRESHOLD = 8.0;
    private static final double RAIN_THRESHOLD = 2.0;

    @Cacheable(value = "weather", key = "#city.toLowerCase()")
    // public WeatherResponse getWeather(String city) {
    //     String url = buildWeatherUrl(city);
    //     System.out.println("Calling external API for: " + city);

    //     Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
    //     Map<String, Object> main = (Map<String, Object>) response.get("main");
    //     Map<String, Object> wind = (Map<String, Object>) response.get("wind");
    //     List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
    //     Map<String, Object> weather = weatherList.get(0);

    //     return new WeatherResponse(
    //             (String) response.get("name"),
    //             ((Number) main.get("temp")).doubleValue(),
    //             ((Number) main.get("humidity")).intValue(),
    //             ((Number) wind.get("speed")).doubleValue(),
    //             (String) weather.get("description")
    //     );
    // }

    public Map<String, Object> getWeather(String city) {
    String url = buildWeatherUrl(city);

    Map<String, Object> response = restTemplate.getForObject(url, Map.class);

    Map<String, Object> main = (Map<String, Object>) response.get("main");
    Map<String, Object> wind = (Map<String, Object>) response.get("wind");
    List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
    Map<String, Object> weather = weatherList.get(0);

    Map<String, Object> result = new HashMap<>();

    result.put("city", response.get("name"));
    result.put("temperature", ((Number) main.get("temp")).doubleValue());
    result.put("humidity", ((Number) main.get("humidity")).intValue());

    // ✅ IMPORTANT FIXES
    result.put("wind", ((Number) wind.get("speed")).doubleValue());

    // OpenWeather current API doesn't give probability → simulate
    result.put("rainProbability", 0.0);

    result.put("condition", weather.get("description"));

    return result;
}

    public Map<String, Object> getForecast(String city) {
        String url = String.format(
            "https://api.openweathermap.org/data/2.5/forecast?q=%s&units=metric&appid=%s",
            city, apiKey
        );
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> calculateRisk(String city, String date) {
        Map<String, Object> forecast = getForecast(city);
        List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecast.get("list");

        WeatherMetrics metrics = aggregateMetricsForDate(forecastList, date);
        double comfortScore = calculateComfortScore(metrics);
        RiskAssessment risk = assessRisk(comfortScore);

        Map<String, Object> result = new HashMap<>();
        result.put("city", city);
        result.put("eventRisk", risk.level);
        result.put("rainAmount", metrics.totalRain);
        result.put("avgTemp", metrics.avgTemp);
        result.put("maxWind", metrics.maxWind);
        result.put("recommendation", risk.recommendation);
        result.put("rainProbability", Math.min(100, metrics.totalRain * 10));
        result.put("comfortScore", comfortScore);
        
        return result;
    }

    public Map<String, Object> findBestDay(String city) {
        Map<String, Object> forecast = getForecast(city);
        List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecast.get("list");

        Map<String, Double> dayScores = new HashMap<>();

        for (Map<String, Object> item : forecastList) {
            String dtTxt = (String) item.get("dt_txt");
            String date = dtTxt.split(" ")[0];
            
            double score = calculateScoreForTimeSlot(item);
            dayScores.merge(date, score, Double::sum);
        }

        String bestDay = findBestDayFromScores(dayScores);
        
        Map<String, Object> result = new HashMap<>();
        result.put("city", city);
        result.put("bestDay", bestDay);
        result.put("score", dayScores.get(bestDay));
        result.put("bestDayName", formatDayName(bestDay));
        
        return result;
    }

    // Private helper methods

    private String buildWeatherUrl(String city) {
        return String.format(
            "https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s",
            city, apiKey
        );
    }

    private WeatherMetrics aggregateMetricsForDate(List<Map<String, Object>> forecastList, String date) {
        WeatherMetrics metrics = new WeatherMetrics();
        int count = 0;

        for (Map<String, Object> item : forecastList) {
            String dtTxt = (String) item.get("dt_txt");
            
            if (dtTxt.startsWith(date)) {
                Map<String, Object> main = (Map<String, Object>) item.get("main");
                Map<String, Object> wind = (Map<String, Object>) item.get("wind");
                
                metrics.avgTemp += ((Number) main.get("temp")).doubleValue();
                metrics.maxWind = Math.max(metrics.maxWind, ((Number) wind.get("speed")).doubleValue());
                metrics.totalRain += extractRainAmount(item);
                count++;
            }
        }

        if (count > 0) {
            metrics.avgTemp /= count;
        }
        
        return metrics;
    }

    private double extractRainAmount(Map<String, Object> item) {
        if (item.containsKey("rain")) {
            Map<String, Object> rain = (Map<String, Object>) item.get("rain");
            return ((Number) rain.getOrDefault("3h", 0)).doubleValue();
        }
        return 0.0;
    }

    private double calculateComfortScore(WeatherMetrics metrics) {
        double score = 100.0;
        
        // Temperature penalty
        if (metrics.avgTemp < 10) score -= 30;
        else if (metrics.avgTemp > 30) score -= 20;
        
        // Wind penalty
        if (metrics.maxWind > WIND_THRESHOLD) score -= 20;
        
        // Rain penalty
        if (metrics.totalRain > 3) score -= 30;
        
        return Math.max(0, score);
    }

    private RiskAssessment assessRisk(double comfortScore) {
        if (comfortScore < 40) {
            return new RiskAssessment("HIGH", "High risk: reschedule event");
        } else if (comfortScore < 70) {
            return new RiskAssessment("MEDIUM", "Moderate risk: consider indoor backup");
        } else {
            return new RiskAssessment("LOW", "Great conditions for outdoor event");
        }
    }

    private double calculateScoreForTimeSlot(Map<String, Object> item) {
        Map<String, Object> main = (Map<String, Object>) item.get("main");
        Map<String, Object> wind = (Map<String, Object>) item.get("wind");
        
        double temp = ((Number) main.get("temp")).doubleValue();
        double windSpeed = ((Number) wind.get("speed")).doubleValue();
        double rain = extractRainAmount(item);
        
        double score = 100.0;
        
        if (temp < 10) score -= 20;
        if (windSpeed > WIND_THRESHOLD) score -= 20;
        if (rain > RAIN_THRESHOLD) score -= 40;
        
        return score;
    }

    private String findBestDayFromScores(Map<String, Double> dayScores) {
        return dayScores.entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
    }

    private String formatDayName(String date) {
        LocalDate dateObj = LocalDate.parse(date);
        String dayName = dateObj.getDayOfWeek().toString();
        return dayName.substring(0, 1) + dayName.substring(1).toLowerCase();
    }

    // Inner classes for data grouping
    private static class WeatherMetrics {
        double totalRain = 0;
        double avgTemp = 0;
        double maxWind = 0;
    }

    private static class RiskAssessment {
        final String level;
        final String recommendation;
        
        RiskAssessment(String level, String recommendation) {
            this.level = level;
            this.recommendation = recommendation;
        }
    }
}