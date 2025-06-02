package com.stu.attendance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentSubmissionDTO {
    private String maNguoiDung;
    private String tenNguoiDung;
    private String maLop;
    private Boolean daNop;
    private String tenFile;
    private LocalDateTime ngayNop;
    private String trangThaiNop; // "Đã nộp", "Chưa nộp", "Nộp trễ"
}