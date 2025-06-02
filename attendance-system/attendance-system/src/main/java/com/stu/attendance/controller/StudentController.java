package com.stu.attendance.controller;

import com.stu.attendance.dto.*;
import com.stu.attendance.service.DiemDanhService;
import com.stu.attendance.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService studentService;
    private final DiemDanhService diemDanhService;

    @PostMapping("/diem-danh")
    public ResponseEntity<String> diemDanh(@RequestBody DiemDanhSinhVienRequest request){
        return ResponseEntity.ok(diemDanhService.diemDanh(request));
    }
    @GetMapping("/diem-danh")
    public ResponseEntity<List<DiemDanhListResponse>> getDiemDanhHistory(@RequestParam String userId, @RequestParam Integer sessionId){
        return ResponseEntity.ok(diemDanhService.getDiemDanhList(userId, sessionId));
    }

}