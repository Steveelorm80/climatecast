// package com.climatecast.event_service.service;

// import org.springframework.stereotype.Component;
// import org.springframework.web.client.RestTemplate;
// import org.springframework.beans.factory.annotation.Value;

// import java.util.Map;

// @Component
// public class WeatherClient {

//     private final RestTemplate restTemplate = new RestTemplate();

//     // public Map getWeather(String city) {

//     //     String url = "https://climatecast-6lun.onrender.com/weather?city=" + city;
        

//     //     return restTemplate.getForObject(url, Map.class);
//     // }
//          @Value("${weather.service.url}")
//         private String weatherServiceUrl;

//         public Map getWeather(String city) {
//         String url = weatherServiceUrl + "/weather?city=" + city;
//       return restTemplate.getForObject(url, Map.class);
// }
// }

package com.climatecast.event_service.service;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@Component
public class WeatherClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.service.url}")
    private String weatherServiceUrl;

    public Map<String, Object> getWeather(String city) {
        String url = weatherServiceUrl + "/weather?city=" + city;
        System.out.println("Calling weather service: " + url);
        
        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            // Ensure we have all required fields with defaults
            Map<String, Object> weatherData = new HashMap<>();
            weatherData.put("city", city);
            weatherData.put("temperature", response != null ? response.getOrDefault("temperature", 20.0) : 20.0);
            weatherData.put("condition", response != null ? response.getOrDefault("condition", "Unknown") : "Unknown");
            weatherData.put("humidity", response != null ? response.getOrDefault("humidity", 50) : 50);
            weatherData.put("wind", response != null ? response.getOrDefault("wind", 5.0) : 5.0);
            weatherData.put("rainProbability", response != null ? response.getOrDefault("rainProbability", 0.0) : 0.0);
            
            return weatherData;
        } catch (Exception e) {
            System.err.println("Error calling weather service: " + e.getMessage());
            // Return fallback data
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("city", city);
            fallback.put("temperature", 20.0);
            fallback.put("condition", "Unknown (API error)");
            fallback.put("humidity", 50);
            fallback.put("wind", 5.0);
            fallback.put("rainProbability", 0.0);
            return fallback;
        }
    }
}