package com.stu.attendance.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TuanNopBaiDTO {
    private Integer maTuan;
    private Integer maNhomDoan;
    private String tenTuan;
    private String moTa;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private String trangThai;
    private Long soLuongNopBai;
    private Boolean daQuaHan;
}