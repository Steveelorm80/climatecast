
package com.climatecast.event_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate; // ✅ ADD THIS

@Data
@Document(collection = "events")
public class Event {

    @Id
    private String id;

    private String name;
    private String city;
    private LocalDate date;
    private String type;
}