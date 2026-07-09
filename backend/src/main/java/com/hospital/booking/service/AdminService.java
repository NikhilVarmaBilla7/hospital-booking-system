package com.hospital.booking.service;

import com.hospital.booking.dto.AdminReportDto;
import com.hospital.booking.entity.Department;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.AppointmentRepository;
import com.hospital.booking.repository.DepartmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public AdminReportDto getReports() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = userRepository.findByRole("PATIENT").size();
        long totalAppointments = appointmentRepository.count();
        long scheduled = appointmentRepository.countByStatus("SCHEDULED") + appointmentRepository.countByStatus("RESCHEDULED");
        long completed = appointmentRepository.countByStatus("COMPLETED");
        long cancelled = appointmentRepository.countByStatus("CANCELLED");

        return new AdminReportDto(totalDoctors, totalPatients, totalAppointments, scheduled, completed, cancelled);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional
    public Department addDepartment(Department department) {
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new RuntimeException("Department already exists");
        }
        return departmentRepository.save(department);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    @Transactional
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }
}
