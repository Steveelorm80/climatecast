package com.climatecast.event_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data  // This generates getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    private String id;
    private String name;
    private String city;
    private String date;
    private String description;
}