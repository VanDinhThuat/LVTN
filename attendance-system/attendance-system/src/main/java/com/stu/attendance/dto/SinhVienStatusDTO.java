package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SinhVienStatusDTO {
    private String maNguoiDung;
    private String tenNguoiDung;
    private String status;
}
