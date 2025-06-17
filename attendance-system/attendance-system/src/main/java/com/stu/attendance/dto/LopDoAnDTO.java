package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LopDoAnDTO {
    private Integer maLopDoAn;
    private String tenLopDoAn;
    private String maThamGia;
    private String ghiChu;
    private String gvId;
    private LocalDate thoiGianBatDau;
    private LocalDate thoiGianKetThuc;

} 