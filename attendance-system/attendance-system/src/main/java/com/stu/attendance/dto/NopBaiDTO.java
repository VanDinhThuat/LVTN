package com.stu.attendance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NopBaiDTO {
    private Integer maNopBai;
    private Integer maTuan;
    private String tenTuan;
    private String maNguoiDung;
    private String tenNguoiDung;
    private String tenFile;
    private String duongDanFile;
    private Long kichThuoc;
    private String loaiFile;
    private LocalDateTime ngayNop;
    private String ghiChuGv;
}