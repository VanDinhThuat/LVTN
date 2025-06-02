package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiemDanhListResponse {
    private String fullName;
    private LocalDateTime time;
    private String status;
    private Integer maDiemDanh;
}
