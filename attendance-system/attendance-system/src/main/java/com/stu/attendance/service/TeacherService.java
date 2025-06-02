package com.stu.attendance.service;

import com.stu.attendance.entity.*;
import com.stu.attendance.repository.AttendanceRepository;
import com.stu.attendance.repository.TeacherRepository;
import com.stu.attendance.security.JwtTokenProvider;
//import com.stu.attendance.util.JwtUtils;
import com.stu.attendance.util.QrCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final QrCodeGenerator qrCodeGenerator;
    private final JwtTokenProvider jwtUtils;
    private final AttendanceRepository attendanceRepository;


    /**
     * Get students in a specific class
     */
    public List<Map<String, Object>> getStudentsByClass(String classId) {
        List<NguoiDung> students = teacherRepository.findStudentsByClass(classId);

        return students.stream().map(student -> {
            Map<String, Object> studentInfo = new HashMap<>();
            studentInfo.put("studentId", student.getMaNguoiDung());
            studentInfo.put("fullName", student.getTenNguoiDung());
            studentInfo.put("email", student.getEmail());
            studentInfo.put("phone", student.getSdt());
            return studentInfo;
        }).collect(Collectors.toList());
    }

    /**
     * Process attendance for a single student
     */

    /**
     * Helper method to map BuoiHoc entity to SessionDto
     */


    /**
     * Helper method to map DiemDanh entity to AttendanceResponse
     */

    private String getCurrentTeacherId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        // In a real implementation, this would query a repository to get the teacher ID from username
        // For simplicity, we're assuming the username is the teacher ID
        return username;
    }
}