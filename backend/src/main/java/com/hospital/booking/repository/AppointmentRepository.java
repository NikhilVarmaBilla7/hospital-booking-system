package com.hospital.booking.repository;

import com.hospital.booking.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Appointment> findByDoctorIdOrderBySlotDateAscSlotStartTimeAsc(Long doctorId);
    Optional<Appointment> findBySlotId(Long slotId);
    
    // For admin analytics
    long countByStatus(String status);
}
