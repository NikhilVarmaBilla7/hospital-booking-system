package com.hospital.booking.service;

import com.hospital.booking.entity.AvailabilitySlot;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.AvailabilitySlotRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    public List<Doctor> getDoctors(String query) {
        if (query != null && !query.trim().isEmpty()) {
            return doctorRepository.searchDoctors(query);
        }
        return doctorRepository.findAll();
    }

    public List<AvailabilitySlot> getDoctorSlots(Long doctorId, Boolean availableOnly) {
        if (availableOnly) {
            return slotRepository.findByDoctorIdAndIsBooked(doctorId, false);
        }
        return slotRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public AvailabilitySlot addAvailabilitySlot(Long doctorUserId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        User user = userRepository.findById(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor user not found"));

        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Optional<AvailabilitySlot> existingSlot = slotRepository.findByDoctorIdAndDateAndStartTimeAndEndTime(
                doctor.getId(), date, startTime, endTime
        );

        if (existingSlot.isPresent()) {
            throw new RuntimeException("Availability slot already exists for this timeframe.");
        }

        AvailabilitySlot slot = new AvailabilitySlot(doctor, date, startTime, endTime, false);
        return slotRepository.save(slot);
    }
}
