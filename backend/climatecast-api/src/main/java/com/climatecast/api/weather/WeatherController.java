package com.climatecast.api.weather;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWeather(@RequestParam String city) {
        try {
            return ResponseEntity.ok(weatherService.getWeather(city));
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch weather data");
            error.put("message", e.getMessage());
            error.put("city", city);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }
    }

    @GetMapping("/risk")
    public Map<String, Object> getRisk(@RequestParam String city, @RequestParam String date) {
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
