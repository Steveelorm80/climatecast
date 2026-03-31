package com.climatecast.weather_service.controller;

import com.climatecast.weather_service.model.WeatherResponse;
import com.climatecast.weather_service.service.WeatherService;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService){
        this.weatherService = weatherService;
    }

    // @GetMapping
    // public WeatherResponse getWeather(@RequestParam String city){
    //     System.out.println("REQUEST HIT: " + city);
    //     return weatherService.getWeather(city);
    // }
@GetMapping
//public WeatherResponse getWeather(@RequestParam String city){
public Object getWeather(@RequestParam String city){
    try {
        return weatherService.getWeather(city);
    } catch (Exception e) {
        System.out.println("ERROR: " + e.getMessage());

        // 🔥 FALLBACK RESPONSE (IMPORTANT)
        WeatherResponse fallback = new WeatherResponse();
        fallback.setCity(city);
        fallback.setTemperature(20.0);
        fallback.setCondition("Unavailable (API error)");
        fallback.setHumidity(0);

        return fallback;
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



@Data
@NoArgsConstructor
public class WeatherResponse {
    private String city;
    private double temperature;
    private String condition;
    private int humidity;
}
}