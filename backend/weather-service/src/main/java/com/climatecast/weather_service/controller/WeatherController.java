package com.climatecast.weather_service.controller;

import com.climatecast.weather_service.model.WeatherResponse;
import com.climatecast.weather_service.service.WeatherService;


import java.util.Map;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService){
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherResponse getWeather(@RequestParam String city){
        System.out.println("REQUEST HIT: " + city);
        return weatherService.getWeather(city);
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