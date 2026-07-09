package com.hospital.booking.repository;

import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Doctor> searchDoctors(@Param("query") String query);

    List<Doctor> findByDepartmentId(Long departmentId);
}
