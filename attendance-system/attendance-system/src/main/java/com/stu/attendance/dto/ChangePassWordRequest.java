package com.stu.attendance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePassWordRequest {
    private String oldPassword;
    private String newPassword;
    private String maNguoiDung;
}
