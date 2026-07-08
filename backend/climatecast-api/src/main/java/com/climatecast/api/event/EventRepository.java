package com.climatecast.api.event;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUserId(String userId);

    Optional<Event> findByIdAndUserId(Long id, String userId);
}
