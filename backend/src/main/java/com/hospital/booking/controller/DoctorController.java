package com.hospital.booking.controller;

import com.hospital.booking.dto.SlotRequest;
import com.hospital.booking.entity.AvailabilitySlot;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors(@RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(doctorService.getDoctors(query));
    }

    @GetMapping("/doctors/{id}/slots")
    public ResponseEntity<List<AvailabilitySlot>> getDoctorSlots(
            @PathVariable("id") Long doctorId,
            @RequestParam(value = "available", defaultValue = "true") Boolean availableOnly) {
        return ResponseEntity.ok(doctorService.getDoctorSlots(doctorId, availableOnly));
    }

    @PostMapping("/doctor/slots")
    public ResponseEntity<?> addSlot(@RequestBody SlotRequest request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Doctor user session not found"));

            AvailabilitySlot slot = doctorService.addAvailabilitySlot(
                    user.getId(), request.getDate(), request.getStartTime(), request.getEndTime()
            );
            return ResponseEntity.ok(slot);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
