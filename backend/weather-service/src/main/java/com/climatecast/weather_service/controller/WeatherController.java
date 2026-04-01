package com.climatecast.weather_service.controller;

import com.climatecast.weather_service.model.WeatherResponse;
import com.climatecast.weather_service.service.WeatherService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @Value("${openweather.api.key}")
    private String apiKey;

    @GetMapping
    public Object getWeather(@RequestParam String city) {
        try {
            String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                city, apiKey
            );

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);
            JSONObject json = new JSONObject(response);

            Map<String, Object> result = new HashMap<>();
            result.put("city", json.getString("name"));
            result.put("temperature", json.getJSONObject("main").getDouble("temp"));
            result.put("condition", json.getJSONArray("weather")
                                        .getJSONObject(0)
                                        .getString("main"));
            result.put("humidity", json.getJSONObject("main").getInt("humidity"));

            return result;

        } catch (Exception e) {
            System.err.println("Weather API error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch weather data");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("city", city);
            return errorResponse;
        }
    }

    @GetMapping("/risk")
    public Map<String, Object> getRisk(
            @RequestParam String city,
            @RequestParam String date) {
        return weatherService.calculateRisk(city, date);
    }

    @GetMapping("/best-day")
    public Map<String, Object> getBestDay(@RequestParam String city) {
        return weatherService.findBestDay(city);
    }

    @GetMapping("/forecast")
    public Map<String, Object> getForecast(@RequestParam String city) {
        return weatherService.getForecast(city);
    }
}