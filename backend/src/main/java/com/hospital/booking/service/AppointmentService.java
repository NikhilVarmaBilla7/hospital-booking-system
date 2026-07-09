package com.hospital.booking.service;

import com.hospital.booking.entity.*;
import com.hospital.booking.exception.DoubleBookingException;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Transactional
    public Appointment bookAppointment(Long patientId, Long slotId) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        // Fetch slot with pessimistic write lock if using real database or a transaction check to prevent race conditions
        AvailabilitySlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Availability slot not found"));

        if (slot.getIsBooked()) {
            throw new DoubleBookingException("This slot is already booked by another patient.");
        }

        slot.setIsBooked(true);
        slotRepository.save(slot);

        Appointment appointment = new Appointment(patient, slot.getDoctor(), slot, "SCHEDULED");
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Send Notifications
        createNotification(patient, "Your appointment with Dr. " + slot.getDoctor().getUser().getFullName() + 
                " on " + slot.getDate() + " at " + slot.getStartTime() + " has been booked successfully.");
        
        createNotification(slot.getDoctor().getUser(), "New appointment booked by " + patient.getFullName() + 
                " on " + slot.getDate() + " at " + slot.getStartTime() + ".");

        return savedAppointment;
    }

    @Transactional
    public Appointment rescheduleAppointment(Long appointmentId, Long newSlotId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if ("CANCELLED".equals(appointment.getStatus()) || "COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Cannot reschedule completed or cancelled appointments.");
        }

        AvailabilitySlot newSlot = slotRepository.findById(newSlotId)
                .orElseThrow(() -> new ResourceNotFoundException("New availability slot not found"));

        if (newSlot.getIsBooked()) {
            throw new DoubleBookingException("The new slot is already booked.");
        }

        // Free up old slot
        AvailabilitySlot oldSlot = appointment.getSlot();
        oldSlot.setIsBooked(false);
        slotRepository.save(oldSlot);

        // Book new slot
        newSlot.setIsBooked(true);
        slotRepository.save(newSlot);

        // Update appointment details
        appointment.setSlot(newSlot);
        appointment.setStatus("RESCHEDULED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify
        createNotification(appointment.getPatient(), "Your appointment with Dr. " + appointment.getDoctor().getUser().getFullName() + 
                " has been rescheduled to " + newSlot.getDate() + " at " + newSlot.getStartTime() + ".");
        
        createNotification(appointment.getDoctor().getUser(), "Appointment with " + appointment.getPatient().getFullName() + 
                " has been rescheduled to " + newSlot.getDate() + " at " + newSlot.getStartTime() + ".");

        return updatedAppointment;
    }

    @Transactional
    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if ("CANCELLED".equals(appointment.getStatus())) {
            return appointment;
        }

        AvailabilitySlot slot = appointment.getSlot();
        slot.setIsBooked(false);
        slotRepository.save(slot);

        appointment.setStatus("CANCELLED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        // Notify
        createNotification(appointment.getPatient(), "Your appointment with Dr. " + appointment.getDoctor().getUser().getFullName() + 
                " on " + slot.getDate() + " has been cancelled.");
        
        createNotification(appointment.getDoctor().getUser(), "Appointment with " + appointment.getPatient().getFullName() + 
                " on " + slot.getDate() + " has been cancelled.");

        return updatedAppointment;
    }

    @Transactional
    public Appointment addClinicalNotes(Long appointmentId, String notes, String prescription) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setClinicalNotes(notes);
        appointment.setPrescription(prescription);
        
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus("COMPLETED");
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        createNotification(appointment.getPatient(), "Your appointment with Dr. " + appointment.getDoctor().getUser().getFullName() + 
                " has been marked as Completed. You can view prescriptions and notes in your dashboard.");

        return updatedAppointment;
    }

    public List<Appointment> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<Appointment> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderBySlotDateAscSlotStartTimeAsc(doctorId);
    }

    private void createNotification(User user, String message) {
        Notification notification = new Notification(user, message);
        notificationRepository.save(notification);
    }
}
