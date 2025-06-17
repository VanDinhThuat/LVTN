package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhomDoAnDTO {

    private Integer maNhom;
    private String tenNhom;
    private String maLopDoAn;
    private String ghiChu;



} 