package com.climatecast.api.event;

import org.springframework.stereotype.Service;

@Service
public class EventRiskService {

    public String calculateRisk(double rainProbability, double windSpeed) {
        if (rainProbability > 70 || windSpeed > 15) {
            return "HIGH";
        } else if (rainProbability > 40 || windSpeed > 10) {
            return "MEDIUM";
        }
        return "LOW";
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

    /**
     * The current-weather API gives no precipitation probability,
     * so derive an estimate from the reported condition.
     */
    public double estimateRainProbability(String condition) {
        if (condition == null) return 0.0;
        String c = condition.toLowerCase();
        if (c.contains("thunder") || c.contains("storm")) return 90.0;
        if (c.contains("rain") || c.contains("drizzle")) return 80.0;
        if (c.contains("snow")) return 70.0;
        if (c.contains("cloud")) return 20.0;
        return 0.0;
    }
}
