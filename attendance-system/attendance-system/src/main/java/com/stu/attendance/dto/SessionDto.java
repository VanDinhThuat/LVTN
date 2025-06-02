//package com.stu.attendance.dto;
//
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class SessionDto {
//
//    private Integer sessionId;
//
//    @NotBlank(message = "Mã môn học không được để trống")
//    private String subjectId;
//
//    private String subjectName;
//
//    @NotBlank(message = "Mã phòng không được để trống")
//    private String roomId;
//
//    private String roomName;
//
//    @NotBlank(message = "Thứ học không được để trống")
//    private String thu; // Changed from LocalDate date to String thu
//
//    @NotNull(message = "Tiết bắt đầu không được để trống")
//    private Integer startPeriod;
//
//    @NotNull(message = "Tiết kết thúc không được để trống")
//    private Integer endPeriod;
//
//
//    // Statistics for attendance
//    private Integer totalStudents;
//    private Integer presentCount;
//    private Integer absentCount;
//    private Integer lateCount;
//
//
//    // For detailed view
//    private List<AttendanceResponse> attendances;
//
//    // For creation and update
//    private List<String> classIds;
//
//    private String maThamGia;
//    private String gvId;
//}
package com.stu.attendance.dto;

import com.stu.attendance.entity.BuoiHoc;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionDto {

    private Integer sessionId;

    @NotBlank(message = "Mã môn học không được để trống")
    private String subjectId;

    private String subjectName;

    @NotBlank(message = "Mã phòng không được để trống")
    private String roomId;

    private String roomName;

    @NotBlank(message = "Thứ học không được để trống")
    private String thu;

    @NotNull(message = "Tiết bắt đầu không được để trống")
    @Min(value = 1, message = "Tiết bắt đầu phải lớn hơn 0")
    private Integer startPeriod;

    @NotNull(message = "Tiết kết thúc không được để trống")
    @Min(value = 1, message = "Tiết kết thúc phải lớn hơn 0")
    private Integer endPeriod;

    //@NotBlank(message = "Mã tham gia không được để trống")
    private String maThamGia;

    private String gvId;


    private LocalDate ngayBatDau;

    private LocalDate ngayKetThuc;

    @Min(value = 1, message = "Số buổi phải lớn hơn 0")
    private Integer soBuoi = 1;

    // Statistics for attendance
    private Integer totalStudents;
    private Integer presentCount;
    private Integer absentCount;
    private Integer lateCount;

    // For detailed view
    private List<AttendanceResponse> attendances;

    // For creation and update
    private List<String> classIds;
}