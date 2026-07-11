package com.climatecast.api.weather;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openweather.api.key}")
    private String apiKey;

    private static final double WIND_THRESHOLD = 8.0;
    private static final double RAIN_THRESHOLD = 2.0;

    @Cacheable(value = "weather", key = "#city.toLowerCase()")
    @SuppressWarnings("unchecked")
    public Map<String, Object> getWeather(String city) {
        String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&units=metric&appid=%s",
                city, apiKey);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        Map<String, Object> main = (Map<String, Object>) response.get("main");
        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
        Map<String, Object> weather = weatherList.get(0);

        Map<String, Object> result = new HashMap<>();
        result.put("city", response.get("name"));
        result.put("temperature", ((Number) main.get("temp")).doubleValue());
        result.put("humidity", ((Number) main.get("humidity")).intValue());
        result.put("wind", ((Number) wind.get("speed")).doubleValue());
        // Current-weather API has no precipitation probability; derived downstream
        result.put("rainProbability", 0.0);
        result.put("condition", weather.get("main"));
        result.put("description", weather.get("description"));

        // Extra metrics available in the same response
        if (main.get("feels_like") != null) {
            result.put("feelsLike", ((Number) main.get("feels_like")).doubleValue());
        }
        if (main.get("pressure") != null) {
            result.put("pressure", ((Number) main.get("pressure")).intValue());
        }
        if (response.get("visibility") != null) {
            result.put("visibility", ((Number) response.get("visibility")).intValue());
        }
        Map<String, Object> sys = (Map<String, Object>) response.get("sys");
        if (sys != null) {
            result.put("sunrise", sys.get("sunrise"));
            result.put("sunset", sys.get("sunset"));
        }
        result.put("timezone", response.get("timezone"));

        Map<String, Object> coord = (Map<String, Object>) response.get("coord");
        if (coord != null) {
            double lat = ((Number) coord.get("lat")).doubleValue();
            double lon = ((Number) coord.get("lon")).doubleValue();
            enrichWithAirQuality(result, lat, lon);
            enrichWithUvIndex(result, lat, lon);
        }

        return result;
    }

    @SuppressWarnings("unchecked")
    private void enrichWithAirQuality(Map<String, Object> result, double lat, double lon) {
        try {
            String url = String.format(Locale.US,
                    "https://api.openweathermap.org/data/2.5/air_pollution?lat=%f&lon=%f&appid=%s",
                    lat, lon, apiKey);
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            List<Map<String, Object>> list = (List<Map<String, Object>>) resp.get("list");
            if (list != null && !list.isEmpty()) {
                Map<String, Object> entry = list.get(0);
                Map<String, Object> aqiMain = (Map<String, Object>) entry.get("main");
                Map<String, Object> components = (Map<String, Object>) entry.get("components");
                int aqi = ((Number) aqiMain.get("aqi")).intValue();
                result.put("aqi", aqi);
                result.put("aqiLabel", switch (aqi) {
                    case 1 -> "Good";
                    case 2 -> "Fair";
                    case 3 -> "Moderate";
                    case 4 -> "Poor";
                    case 5 -> "Very Poor";
                    default -> "Unknown";
                });
                if (components != null && components.get("pm2_5") != null) {
                    result.put("pm25", ((Number) components.get("pm2_5")).doubleValue());
                }
            }
        } catch (Exception e) {
            // Air quality is optional; never break the main weather response
        }
    }

    @SuppressWarnings("unchecked")
    private void enrichWithUvIndex(Map<String, Object> result, double lat, double lon) {
        try {
            String url = String.format(Locale.US,
                    "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&daily=uv_index_max&forecast_days=1&timezone=UTC",
                    lat, lon);
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            Map<String, Object> daily = (Map<String, Object>) resp.get("daily");
            if (daily != null) {
                List<Number> uv = (List<Number>) daily.get("uv_index_max");
                if (uv != null && !uv.isEmpty() && uv.get(0) != null) {
                    result.put("uvIndex", uv.get(0).doubleValue());
                }
            }
        } catch (Exception e) {
            // UV is optional; never break the main weather response
        }
    }

    @Cacheable(value = "forecast", key = "#city.toLowerCase()")
    @SuppressWarnings("unchecked")
    public Map<String, Object> getForecast(String city) {
        String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?q=%s&units=metric&appid=%s",
                city, apiKey);
        return restTemplate.getForObject(url, Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> calculateRisk(String city, String date) {
        Map<String, Object> forecast = getForecast(city);
        List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecast.get("list");

        WeatherMetrics metrics = aggregateMetricsForDate(forecastList, date);
        double comfortScore = calculateComfortScore(metrics);
        RiskAssessment risk = assessRisk(comfortScore);

        Map<String, Object> result = new HashMap<>();
        result.put("city", city);
        result.put("eventRisk", risk.level);
        result.put("rainAmount", metrics.totalRain);
        result.put("avgTemp", metrics.avgTemp);
        result.put("maxWind", metrics.maxWind);
        result.put("recommendation", risk.recommendation);
        result.put("rainProbability", Math.min(100, metrics.totalRain * 10));
        result.put("comfortScore", comfortScore);
        return result;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> findBestDay(String city) {
        Map<String, Object> forecast = getForecast(city);
        List<Map<String, Object>> forecastList = (List<Map<String, Object>>) forecast.get("list");

        Map<String, Double> dayScores = new HashMap<>();
        for (Map<String, Object> item : forecastList) {
            String dtTxt = (String) item.get("dt_txt");
            String date = dtTxt.split(" ")[0];
            dayScores.merge(date, calculateScoreForTimeSlot(item), Double::sum);
        }

        String bestDay = findBestDayFromScores(dayScores);

        Map<String, Object> result = new HashMap<>();
        result.put("city", city);
        result.put("bestDay", bestDay);
        result.put("score", dayScores.get(bestDay));
        result.put("bestDayName", formatDayName(bestDay));
        return result;
    }

    // ---- helpers ----

    @SuppressWarnings("unchecked")
    private WeatherMetrics aggregateMetricsForDate(List<Map<String, Object>> forecastList, String date) {
        WeatherMetrics metrics = new WeatherMetrics();
        int count = 0;
        for (Map<String, Object> item : forecastList) {
            String dtTxt = (String) item.get("dt_txt");
            if (dtTxt.startsWith(date)) {
                Map<String, Object> main = (Map<String, Object>) item.get("main");
                Map<String, Object> wind = (Map<String, Object>) item.get("wind");
                metrics.avgTemp += ((Number) main.get("temp")).doubleValue();
                metrics.maxWind = Math.max(metrics.maxWind, ((Number) wind.get("speed")).doubleValue());
                metrics.totalRain += extractRainAmount(item);
                count++;
            }
        }
        if (count > 0) {
            metrics.avgTemp /= count;
        }
        return metrics;
    }

    @SuppressWarnings("unchecked")
    private double extractRainAmount(Map<String, Object> item) {
        if (item.containsKey("rain")) {
            Map<String, Object> rain = (Map<String, Object>) item.get("rain");
            return ((Number) rain.getOrDefault("3h", 0)).doubleValue();
        }
        return 0.0;
    }

    private double calculateComfortScore(WeatherMetrics metrics) {
        double score = 100.0;
        if (metrics.avgTemp < 10) score -= 30;
        else if (metrics.avgTemp > 30) score -= 20;
        if (metrics.maxWind > WIND_THRESHOLD) score -= 20;
        if (metrics.totalRain > 3) score -= 30;
        return Math.max(0, score);
    }

    private RiskAssessment assessRisk(double comfortScore) {
        if (comfortScore < 40) {
            return new RiskAssessment("HIGH", "High risk: reschedule event");
        } else if (comfortScore < 70) {
            return new RiskAssessment("MEDIUM", "Moderate risk: consider indoor backup");
        }
        return new RiskAssessment("LOW", "Great conditions for outdoor event");
    }

    @SuppressWarnings("unchecked")
    private double calculateScoreForTimeSlot(Map<String, Object> item) {
        Map<String, Object> main = (Map<String, Object>) item.get("main");
        Map<String, Object> wind = (Map<String, Object>) item.get("wind");

        double temp = ((Number) main.get("temp")).doubleValue();
        double windSpeed = ((Number) wind.get("speed")).doubleValue();
        double rain = extractRainAmount(item);

        double score = 100.0;
        if (temp < 10) score -= 20;
        if (windSpeed > WIND_THRESHOLD) score -= 20;
        if (rain > RAIN_THRESHOLD) score -= 40;
        return score;
    }

    private String findBestDayFromScores(Map<String, Double> dayScores) {
        return dayScores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    private String formatDayName(String date) {
        LocalDate dateObj = LocalDate.parse(date);
        String dayName = dateObj.getDayOfWeek().toString();
        return dayName.substring(0, 1) + dayName.substring(1).toLowerCase();
    }

    private static class WeatherMetrics {
        double totalRain = 0;
        double avgTemp = 0;
        double maxWind = 0;
    }

    private static class RiskAssessment {
        final String level;
        final String recommendation;

        RiskAssessment(String level, String recommendation) {
            this.level = level;
            this.recommendation = recommendation;
        }
    }
}
