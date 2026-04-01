package com.climatecast.weather_service.controller;

import org.springframework.beans.factory.annotation.Value;
//import com.climatecast.weather_service.model.WeatherResponse;
import com.climatecast.weather_service.service.WeatherService;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import org.json.JSONArray;

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

    // ✅ FIXED: Added @GetMapping and @RequestParam
    @GetMapping
    public Object getWeather(@RequestParam String city) {
        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city + "&appid=" + apiKey + "&units=metric";

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            JSONObject json = new JSONObject(response);

            double temp = json.getJSONObject("main").getDouble("temp");
            int humidity = json.getJSONObject("main").getInt("humidity");
            String condition = json.getJSONArray("weather")
                                   .getJSONObject(0)
                                   .getString("main");

            Map<String, Object> result = new HashMap<>();
            result.put("city", city);
            result.put("temperature", temp);
            result.put("condition", condition);
            result.put("humidity", humidity);

            return result;

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace(); // This will help debug the actual error
            
            // Return a proper error response
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
    public Map getForecast(@RequestParam String city) {
        return weatherService.getForecast(city);
    }
}

@Data
@NoArgsConstructor
class WeatherResponse {
    private String city;
    private double temperature;
    private String condition;
    private int humidity;
}