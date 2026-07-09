package com.hospital.booking.config;

import com.hospital.booking.entity.AvailabilitySlot;
import com.hospital.booking.entity.Department;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.AvailabilitySlotRepository;
import com.hospital.booking.repository.DepartmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AvailabilitySlotRepository slotRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Departments
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(Arrays.asList(
                    new Department("Cardiology", "Heart care and cardiovascular diagnostics"),
                    new Department("Pediatrics", "Infant, child, and adolescent healthcare"),
                    new Department("Orthopedics", "Bone, joint, ligament, and muscle treatment"),
                    new Department("Neurology", "Brain, spine, and nervous system care"),
                    new Department("Dermatology", "Skin, hair, and nail health diagnostics")
            ));
        }

        // 2. Seed Admin User
        if (userRepository.findByEmail("admin@careplus.com").isEmpty()) {
            User admin = new User(
                    "admin@careplus.com",
                    passwordEncoder.encode("admin123"),
                    "System Admin",
                    "+1-555-0100",
                    "ADMIN"
            );
            userRepository.save(admin);
        }

        // 3. Seed Patient User
        if (userRepository.findByEmail("patient@careplus.com").isEmpty()) {
            User patient = new User(
                    "patient@careplus.com",
                    passwordEncoder.encode("patient123"),
                    "John Doe",
                    "+1-555-0200",
                    "PATIENT"
            );
            userRepository.save(patient);
        }

        if (userRepository.findByEmail("mary@careplus.com").isEmpty()) {
            User patient2 = new User(
                    "mary@careplus.com",
                    passwordEncoder.encode("patient123"),
                    "Mary Jane",
                    "+1-555-0222",
                    "PATIENT"
            );
            userRepository.save(patient2);
        }

        // 4. Seed Doctor 1 (Cardiology)
        if (userRepository.findByEmail("doctor1@careplus.com").isEmpty()) {
            User docUser = new User(
                    "doctor1@careplus.com",
                    passwordEncoder.encode("doctor123"),
                    "Dr. Elizabeth Blackwell",
                    "+1-555-0301",
                    "DOCTOR"
            );
            userRepository.save(docUser);

            Department cardio = departmentRepository.findByName("Cardiology").orElse(null);
            if (cardio != null) {
                Doctor doctor = new Doctor(
                        docUser,
                        cardio,
                        "Cardiologist",
                        "12 Years",
                        "Dr. Elizabeth Blackwell is a board-certified cardiologist with extensive research in preventive heart health.",
                        "$150"
                );
                Doctor savedDoc = doctorRepository.save(doctor);

                // Seed Slots
                LocalDate today = LocalDate.now();
                slotRepository.save(new AvailabilitySlot(savedDoc, today, LocalTime.of(9, 0), LocalTime.of(9, 30), false));
                slotRepository.save(new AvailabilitySlot(savedDoc, today, LocalTime.of(10, 0), LocalTime.of(10, 30), false));
                slotRepository.save(new AvailabilitySlot(savedDoc, today, LocalTime.of(14, 0), LocalTime.of(14, 30), false));
                slotRepository.save(new AvailabilitySlot(savedDoc, today.plusDays(1), LocalTime.of(11, 0), LocalTime.of(11, 30), false));
            }
        }

        // 5. Seed Doctor 2 (Pediatrics)
        if (userRepository.findByEmail("doctor2@careplus.com").isEmpty()) {
            User docUser2 = new User(
                    "doctor2@careplus.com",
                    passwordEncoder.encode("doctor123"),
                    "Dr. Benjamin Spock",
                    "+1-555-0302",
                    "DOCTOR"
            );
            userRepository.save(docUser2);

            Department pediatrics = departmentRepository.findByName("Pediatrics").orElse(null);
            if (pediatrics != null) {
                Doctor doctor2 = new Doctor(
                        docUser2,
                        pediatrics,
                        "Pediatrician",
                        "8 Years",
                        "Dr. Spock specializes in developmental pediatrics and newborn growth tracking.",
                        "$100"
                );
                Doctor savedDoc2 = doctorRepository.save(doctor2);

                // Seed Slots
                LocalDate today = LocalDate.now();
                slotRepository.save(new AvailabilitySlot(savedDoc2, today, LocalTime.of(10, 0), LocalTime.of(10, 30), false));
                slotRepository.save(new AvailabilitySlot(savedDoc2, today, LocalTime.of(11, 0), LocalTime.of(11, 30), false));
                slotRepository.save(new AvailabilitySlot(savedDoc2, today.plusDays(1), LocalTime.of(15, 0), LocalTime.of(15, 30), false));
            }
        }
    }
}
