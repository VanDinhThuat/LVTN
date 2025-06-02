package com.stu.attendance.dto;

import lombok.Data;
import java.util.List;

@Data
public class SubmissionReportDTO {
    private Integer maTuan;
    private String tenTuan;
    private Long tongSinhVien;
    private Long sinhVienDaNop;
    private Long sinhVienChuaNop;
    private List<StudentSubmissionDTO> chiTietSinhVien;
}