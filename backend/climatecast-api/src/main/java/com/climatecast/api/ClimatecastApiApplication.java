package com.climatecast.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ClimatecastApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClimatecastApiApplication.class, args);
    }
}
