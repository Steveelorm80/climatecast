// package com.climatecast.event_service.service;

// import com.climatecast.event_service.model.Event;
// import com.climatecast.event_service.repository.EventRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;

// @Service
// public class EventService {

//     private final EventRepository repository;

//     public EventService(EventRepository repository){
//         this.repository = repository;
//     }

//     public Event create(Event event){
//         return repository.save(event);
//     }

//     public List<Event> getAll(){
//         return repository.findAll();
//     }
// }

package com.climatecast.event_service.service;

import com.climatecast.event_service.model.Event;
import com.climatecast.event_service.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository repository;
    private final WeatherClient weatherClient;
    private final EventRiskService riskService;

    public EventService(EventRepository repository,
                        WeatherClient weatherClient,
                        EventRiskService riskService) {
        this.repository = repository;
        this.weatherClient = weatherClient;
        this.riskService = riskService;
    }

    public Map create(Event event){

        Event saved = repository.save(event);

        Map weather = weatherClient.getWeather(event.getCity());

        double wind = (double) weather.get("wind");
        double rainProbability = weather.get("rainProbability") != null
                ? (double) weather.get("rainProbability") : 0.0;

        String risk = riskService.calculateRisk(rainProbability, wind);
        String recommendation = riskService.recommendation(risk);

        Map response = new HashMap();
        response.put("event", saved);
        response.put("eventRisk", risk);
        response.put("recommendation", recommendation);

        return response;
    }

    public List<Event> getAll(){
        return repository.findAll();
    }
}