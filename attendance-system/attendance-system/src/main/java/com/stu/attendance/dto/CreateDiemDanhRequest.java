package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiemDanhRequest {
    private Integer buoiHocId;
    private LocalDateTime expiredAt;
    private String maNguoidung;
}
