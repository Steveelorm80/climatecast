package com.climatecast.weather_service.controller;

import com.climatecast.weather_service.model.WeatherResponse;
import com.climatecast.weather_service.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService){
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherResponse getWeather(@RequestParam String city){
        return weatherService.getWeather(city);
    }
}