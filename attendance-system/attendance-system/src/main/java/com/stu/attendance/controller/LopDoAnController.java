package com.stu.attendance.controller;

import com.stu.attendance.dto.LopDoAnDTO;
import com.stu.attendance.dto.NguoiThamGiaDTO;
import com.stu.attendance.dto.SessionDto;
import com.stu.attendance.dto.ThamGiaLopDoAnDTO;
import com.stu.attendance.entity.ThamGiaLopDoAn;
import com.stu.attendance.service.LopDoAnService;
import com.stu.attendance.service.NguoiThamGiaService;
import com.stu.attendance.service.ThamGiaLopDoAnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/lop-do-an")
@RequiredArgsConstructor
public class LopDoAnController {

    private final LopDoAnService lopDoAnService;
    private final ThamGiaLopDoAnService thamGiaLopDoAnService;

    @PostMapping
    public ResponseEntity<LopDoAnDTO> addLopDoAn(@Valid @RequestBody LopDoAnDTO lopDoAnDTO) {
        try {
            LopDoAnDTO savedLopDoAn = lopDoAnService.addLopDoAn(lopDoAnDTO);
            return ResponseEntity.ok(savedLopDoAn);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{maLopDoAn}")
    public ResponseEntity<Void> deleteLopDoAn(@PathVariable Integer maLopDoAn) {
        try {
            lopDoAnService.deleteLopDoAn(maLopDoAn);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/gv/{gvId}")
    public ResponseEntity<List<LopDoAnDTO>> getLopDoAnByGvId(@PathVariable String gvId) {
        List<LopDoAnDTO> lopDoAnList = lopDoAnService.getLopDoAnByGvId(gvId);
        return ResponseEntity.ok(lopDoAnList);
    }
    @PostMapping("/student/add")
    public void addStudent(@RequestBody ThamGiaLopDoAnDTO request){
        thamGiaLopDoAnService.addStudentdoan(request.getUserId(), request.getMaThamGia());
    }
    @GetMapping("/{maLopDoAn}")
    public ResponseEntity<LopDoAnDTO> getLopDoAnByMaLopDoAn(@PathVariable Integer maLopDoAn) {
        try {
            LopDoAnDTO lopDoAnDTO = lopDoAnService.getLopDoAnByMaLopDoAn(maLopDoAn);
            return ResponseEntity.ok(lopDoAnDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/student")
    public ResponseEntity<List<LopDoAnDTO>> getSSByStudent(@RequestParam(required = false) String id){
        return ResponseEntity.ok(lopDoAnService.getSSByUser(id));
    }
}