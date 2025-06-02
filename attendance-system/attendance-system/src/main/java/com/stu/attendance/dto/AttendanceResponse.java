package com.stu.attendance.dto;

import com.stu.attendance.entity.DiemDanh;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {

    private Integer attendanceId;
    private String studentId;
    private String studentName;
    private String className;
    private Integer sessionId;
    private String subjectName;
    private String roomName;

    private LocalDateTime recordTime;
    private boolean success;
    private String message;
}