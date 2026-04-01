package com.climatecast.event_service.service;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@Component
public class WeatherClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // public Map getWeather(String city) {

    //     String url = "https://climatecast-6lun.onrender.com/weather?city=" + city;
        

    //     return restTemplate.getForObject(url, Map.class);
    // }
         @Value("${weather.service.url}")
        private String weatherServiceUrl;

        public Map getWeather(String city) {
        String url = weatherServiceUrl + "/weather?city=" + city;
      return restTemplate.getForObject(url, Map.class);
}
}

