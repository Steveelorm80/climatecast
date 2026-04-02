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

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;

import java.util.HashMap;
import java.util.Map;

@Component
public class WeatherClient {@PostConstruct
    public void init() {
       System.out.println("Weather service URL is: " + weatherServiceUrl);
     }


    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.service.url}")
    private String weatherServiceUrl;

    public Map<String, Object> getWeather(String city) {
    String url = weatherServiceUrl + "/weather?city=" + city;
    System.out.println("Calling weather service: " + url);
    
    try {
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
        Map<String, Object> weatherData = new HashMap<>();
        weatherData.put("city", city);
        weatherData.put("temperature", response != null ? response.getOrDefault("temperature", 20.0) : 20.0);
        weatherData.put("condition", response != null ? response.getOrDefault("condition", "Unknown") : "Unknown");
        weatherData.put("humidity", response != null ? response.getOrDefault("humidity", 50) : 50);
        
        // Calculate wind and rain from available data (or set defaults)
        weatherData.put("wind", calculateWindFromCondition((String)weatherData.get("condition")));
        weatherData.put("rainProbability", calculateRainFromCondition((String)weatherData.get("condition")));
        
        return weatherData;
    } catch (Exception e) {
        System.err.println("Error calling weather service: " + e.getMessage());
        // Return fallback data with calculated values
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

private double calculateWindFromCondition(String condition) {
    if (condition == null) return 5.0;
    switch(condition.toLowerCase()) {
        case "clear": return 3.0;
        case "clouds": return 8.0;
        case "rain": return 12.0;
        case "storm": return 20.0;
        default: return 5.0;
    }
}

private double calculateRainFromCondition(String condition) {
    if (condition == null) return 0.0;
    switch(condition.toLowerCase()) {
        case "clear": return 0.0;
        case "clouds": return 20.0;
        case "rain": return 80.0;
        case "storm": return 90.0;
        default: return 0.0;
    }

}
}