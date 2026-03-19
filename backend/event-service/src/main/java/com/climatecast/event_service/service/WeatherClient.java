package com.climatecast.event_service.service;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class WeatherClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map getWeather(String city) {

        String url = "http://localhost:8081/weather?city=" + city;
        // ⚠️ change port if your weather-service runs on 8080

        return restTemplate.getForObject(url, Map.class);
    }
}

