package com.climatecast.event_service.service;

import org.springframework.stereotype.Service;

@Service
public class EventRiskService {
    
    public String calculateRisk(double rainProbability, double windSpeed) {
        if (rainProbability > 70 || windSpeed > 15) {
            return "HIGH";
        } else if (rainProbability > 40 || windSpeed > 10) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }
    
    public String recommendation(String risk) {
        switch (risk) {
            case "HIGH":
                return "High risk: Consider postponing the event";
            case "MEDIUM":
                return "Moderate risk: Have indoor backup plans";
            case "LOW":
                return "Low risk: Good conditions for the event";
            default:
                return "Unable to provide recommendation";
        }
    }
}