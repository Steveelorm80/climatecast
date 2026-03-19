package com.climatecast.event_service.service;

import org.springframework.stereotype.Service;

@Service
public class EventRiskService {

    public String calculateRisk(double rainProbability, double wind){

        if (rainProbability > 0.6 || wind > 15) {
            return "HIGH";
        }

        if (rainProbability > 0.3) {
            return "MEDIUM";
        }

        return "LOW";
    }

    public String recommendation(String risk){

        if (risk.equals("HIGH")) {
            return "Move event to another day";
        }

        if (risk.equals("MEDIUM")) {
            return "Monitor weather closely";
        }

        return "Weather looks good";
    }
}