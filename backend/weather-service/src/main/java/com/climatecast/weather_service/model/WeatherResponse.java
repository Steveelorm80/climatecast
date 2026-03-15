package com.climatecast.weather_service.model;
public class WeatherResponse {

    private String city;
    private double temperature;
    private int humidity;
    private double wind;
    private String description;

    public WeatherResponse(String city, double temperature, int humidity, double wind, String description) {
        this.city = city;
        this.temperature = temperature;
        this.humidity = humidity;
        this.wind = wind;
        this.description = description;
    }

    public String getCity() { return city; }
    public double getTemperature() { return temperature; }
    public int getHumidity() { return humidity; }
    public double getWind() { return wind; }
    public String getDescription() { return description; }
}