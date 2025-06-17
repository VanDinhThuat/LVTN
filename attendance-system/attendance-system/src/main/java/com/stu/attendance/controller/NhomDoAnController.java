package com.stu.attendance.controller;

import com.stu.attendance.dto.NhomDoAnDTO;
import com.stu.attendance.service.NhomDoAnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhom-do-an")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NhomDoAnController {

    private final NhomDoAnService nhomDoAnService;

    @PostMapping
    public ResponseEntity<NhomDoAnDTO> addNhomDoAn(@RequestBody NhomDoAnDTO dto) {
        try {
            NhomDoAnDTO savedNhomDoAn = nhomDoAnService.addNhomDoAn(dto);
            return ResponseEntity.ok(savedNhomDoAn);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{maNhom}")
    public ResponseEntity<NhomDoAnDTO> updateNhomDoAn(
            @PathVariable Integer maNhom,
            @RequestBody NhomDoAnDTO nhomDoAnDTO) {
        try {
            NhomDoAnDTO updatedNhomDoAn = nhomDoAnService.updateNhomDoAn(maNhom, nhomDoAnDTO);
            return ResponseEntity.ok(updatedNhomDoAn);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<NhomDoAnDTO>> getAllNhomDoAn() {
        List<NhomDoAnDTO> nhomDoAnList = nhomDoAnService.getAllNhomDoAn();
        return ResponseEntity.ok(nhomDoAnList);
    }

    @GetMapping("/{maNhom}")
    public ResponseEntity<NhomDoAnDTO> getNhomDoAnById(@PathVariable Integer maNhom) {
        try {
            NhomDoAnDTO nhomDoAn = nhomDoAnService.getNhomDoAnById(maNhom);
            return ResponseEntity.ok(nhomDoAn);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/lop-do-an/{maLopDoAn}")
    public ResponseEntity<List<NhomDoAnDTO>> getNhomDoAnByLopDoAn(@PathVariable Integer maLopDoAn) {
        List<NhomDoAnDTO> nhomDoAnList = nhomDoAnService.getNhomDoAnByLopDoAn(maLopDoAn);
        return ResponseEntity.ok(nhomDoAnList);
    }

    @DeleteMapping("/{maNhom}")
    public ResponseEntity<Void> deleteNhomDoAn(@PathVariable Integer maNhom) {
        try {
            nhomDoAnService.deleteNhomDoAn(maNhom);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 