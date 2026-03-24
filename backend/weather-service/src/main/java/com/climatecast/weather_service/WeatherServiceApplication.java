 package com.climatecast.weather_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;


@SpringBootApplication
@EnableCaching
public class WeatherServiceApplication {

    public static void main(String[] args) {

        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("sun.net.spi.nameservice.provider.1", "dns,sun");
        System.setProperty("sun.net.spi.nameservice.nameservers", "8.8.8.8"); // 👈 ADD THIS

        SpringApplication.run(WeatherServiceApplication.class, args);
    }
}
