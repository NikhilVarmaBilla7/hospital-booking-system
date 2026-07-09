package com.hospital.booking.controller;

import com.hospital.booking.dto.BookRequest;
import com.hospital.booking.dto.ClinicalNotesRequest;
import com.hospital.booking.dto.RescheduleRequest;
import com.hospital.booking.entity.Appointment;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/appointments/book")
    public ResponseEntity<?> book(@RequestBody BookRequest request) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Patient user session not found"));

            Appointment appt = appointmentService.bookAppointment(user.getId(), request.getSlotId());
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/appointments/my")
    public ResponseEntity<?> getMyAppointments() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User session not found"));
            
            List<Appointment> list = appointmentService.getPatientAppointments(user.getId());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<?> reschedule(@PathVariable("id") Long id, @RequestBody RescheduleRequest request) {
        try {
            Appointment appt = appointmentService.rescheduleAppointment(id, request.getNewSlotId());
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<?> cancel(@PathVariable("id") Long id) {
        try {
            Appointment appt = appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor/appointments")
    public ResponseEntity<?> getDoctorAppointments() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Doctor user session not found"));

            Doctor doctor = doctorRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

            List<Appointment> list = appointmentService.getDoctorAppointments(doctor.getId());
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/doctor/appointments/{id}/clinical")
    public ResponseEntity<?> addClinicalNotes(@PathVariable("id") Long id, @RequestBody ClinicalNotesRequest request) {
        try {
            Appointment appt = appointmentService.addClinicalNotes(id, request.getClinicalNotes(), request.getPrescription());
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/doctor/appointments/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable("id") Long id) {
        try {
            Appointment appt = appointmentService.completeAppointment(id);
            return ResponseEntity.ok(appt);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
