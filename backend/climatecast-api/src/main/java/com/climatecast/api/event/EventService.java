package com.climatecast.api.event;

import com.climatecast.api.weather.WeatherService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository repository;
    private final WeatherService weatherService;
    private final EventRiskService riskService;

    public EventService(EventRepository repository,
                        WeatherService weatherService,
                        EventRiskService riskService) {
        this.repository = repository;
        this.weatherService = weatherService;
        this.riskService = riskService;
    }

    public Map<String, Object> create(Event event) {
        String userId = currentUserId();

        // Idempotent create: same name+city+date for this user reuses the existing event
        Optional<Event> existing = repository.findFirstByUserIdAndNameIgnoreCaseAndCityIgnoreCaseAndDate(
                userId, event.getName(), event.getCity(), event.getDate());
        boolean alreadyExisted = existing.isPresent();

        Event saved;
        if (alreadyExisted) {
            saved = existing.get();
        } else {
            event.setUserId(userId);
            saved = repository.save(event);
        }

        Map<String, Object> weather = fetchWeatherSafely(saved.getCity());

        double wind = weather.get("wind") != null
                ? Double.parseDouble(weather.get("wind").toString()) : 0.0;
        double rainProbability = riskService.estimateRainProbability(
                weather.get("condition") != null ? weather.get("condition").toString() : null);
        weather.put("rainProbability", rainProbability);

        String risk = riskService.calculateRisk(rainProbability, wind);

        Map<String, Object> response = new HashMap<>();
        response.put("event", saved);
        response.put("eventRisk", risk);
        response.put("recommendation", riskService.recommendation(risk));
        response.put("weather", weather);
        response.put("alreadyExisted", alreadyExisted);
        return response;
    }

    public List<Event> getAll() {
        return repository.findByUserId(currentUserId());
    }

    public Optional<Event> getById(Long id) {
        return repository.findByIdAndUserId(id, currentUserId());
    }

    public void delete(Long id) {
        repository.findByIdAndUserId(id, currentUserId())
                .ifPresent(repository::delete);
    }

    public Map<String, Object> update(Long id, Event event) {
        Map<String, Object> response = new HashMap<>();
        Optional<Event> existing = repository.findByIdAndUserId(id, currentUserId());
        if (existing.isPresent()) {
            event.setId(id);
            event.setUserId(existing.get().getUserId());
            Event saved = repository.save(event);
            response.put("success", true);
            response.put("event", saved);
        } else {
            response.put("success", false);
            response.put("message", "Event not found");
        }
        return response;
    }

    /**
     * Clerk user id from the JWT subject; "dev-user" when auth is disabled.
     */
    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            return jwtAuth.getToken().getSubject();
        }
        return "dev-user";
    }

    private Map<String, Object> fetchWeatherSafely(String city) {
        try {
            return new HashMap<>(weatherService.getWeather(city));
        } catch (Exception e) {
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
