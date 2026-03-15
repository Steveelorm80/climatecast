package com.climatecast.weather_service.service;

import org.springframework.beans.factory.annotation.Value;
import com.climatecast.weather_service.model.WeatherResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    private final WebClient webClient = WebClient.create("https://api.openweathermap.org");

   //private final String API_KEY = "";
   @Value("${openweather.api.key}")
    private String apiKey;

    public WeatherResponse getWeather(String city){

        Map response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/data/2.5/weather")
                        .queryParam("q", city)
                        .queryParam("units", "metric")
                        .queryParam("appid", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(Map.class)
                .block();

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
}

 