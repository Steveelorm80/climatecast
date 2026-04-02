package com.climatecast.event_service.service;

import com.climatecast.event_service.model.Event;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EventService {

    private final WeatherClient weatherClient;
    private final EventRiskService riskService;
    
    // In-memory storage instead of MongoDB
    private final Map<String, Event> eventStore = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public EventService(WeatherClient weatherClient,
                        EventRiskService riskService) {
        this.weatherClient = weatherClient;
        this.riskService = riskService;
    }

    public Map<String, Object> create(Event event) {
        // Generate ID and save event to memory
        String eventId = String.valueOf(idGenerator.getAndIncrement());
        event.setId(eventId);
        eventStore.put(eventId, event);
        
        // Get weather data
        Map<String, Object> weather = weatherClient.getWeather(event.getCity());

        double wind = weather.get("wind") != null
                ? Double.parseDouble(weather.get("wind").toString()) : 0.0;

        double rainProbability = weather.get("rainProbability") != null
                ? Double.parseDouble(weather.get("rainProbability").toString()) : 0.0;

        String risk = riskService.calculateRisk(rainProbability, wind);
        String recommendation = riskService.recommendation(risk);

        Map<String, Object> response = new HashMap<>();
        response.put("event", event);
        response.put("eventRisk", risk);
        response.put("recommendation", recommendation);
        response.put("weather", weather);

        return response;
    }
    
    // ✅ Add this method - it's called by EventController.getEvents()
    public List<Event> getAll() {
        return new ArrayList<>(eventStore.values());
    }
    
    // Optional additional methods
    public Optional<Event> getById(String id) {
        return Optional.ofNullable(eventStore.get(id));
    }
    
    public void delete(String id) {
        eventStore.remove(id);
    }
    
    public Map<String, Object> update(String id, Event event) {
        if (eventStore.containsKey(id)) {
            event.setId(id);
            eventStore.put(id, event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("event", event);
            return response;
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Event not found");
        return response;
    }
}