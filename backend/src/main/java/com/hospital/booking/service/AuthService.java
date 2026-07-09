package com.hospital.booking.service;

import com.hospital.booking.config.JwtUtils;
import com.hospital.booking.dto.LoginRequest;
import com.hospital.booking.dto.LoginResponse;
import com.hospital.booking.dto.RegisterRequest;
import com.hospital.booking.entity.Department;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.DepartmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "PATIENT");

        User savedUser = userRepository.save(user);

        if ("DOCTOR".equalsIgnoreCase(savedUser.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialization(request.getSpecialization());
            doctor.setExperience(request.getExperience());
            doctor.setBiography(request.getBiography());
            doctor.setConsultationFee(request.getConsultationFee());

            if (request.getDepartmentId() != null) {
                Department department = departmentRepository.findById(request.getDepartmentId())
                        .orElseThrow(() -> new RuntimeException("Department not found"));
                doctor.setDepartment(department);
            }
            doctorRepository.save(doctor);
        }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole(), user.getId(), user.getFullName());
        return new LoginResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}
