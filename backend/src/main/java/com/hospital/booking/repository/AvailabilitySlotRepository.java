package com.hospital.booking.repository;

import com.hospital.booking.entity.AvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    List<AvailabilitySlot> findByDoctorId(Long doctorId);
    List<AvailabilitySlot> findByDoctorIdAndIsBooked(Long doctorId, Boolean isBooked);
    
    Optional<AvailabilitySlot> findByDoctorIdAndDateAndStartTimeAndEndTime(
        Long doctorId, LocalDate date, LocalTime startTime, LocalTime endTime
    );
}
