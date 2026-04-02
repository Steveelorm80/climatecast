// package com.climatecast.event_service.controller;

// import com.climatecast.event_service.model.Event;
// import com.climatecast.event_service.service.EventService;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;

// @RestController
// @RequestMapping("/events")
// public class EventController {

//     private final EventService service;

//     public EventController(EventService service){
//         this.service = service;
//     }

//     @PostMapping
// public Object create(@RequestBody Event event){
//     return service.create(event);
// }

//     @GetMapping
//     public List<Event> getEvents(){
//         return service.getAll();
//     }
// }

package com.climatecast.event_service.controller;

import com.climatecast.event_service.model.Event;
import com.climatecast.event_service.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Event event) {
        return service.create(event);
    }

    @GetMapping
    public List<Event> getAll() {
        return service.getAll();
    }
    
    @GetMapping("/{id}")
    public Optional<Event> getById(@PathVariable String id) {
        return service.getById(id);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
    
    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable String id, @RequestBody Event event) {
        return service.update(id, event);
    }
}