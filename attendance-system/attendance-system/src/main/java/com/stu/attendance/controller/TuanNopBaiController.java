package com.stu.attendance.controller;

import com.stu.attendance.dto.TuanNopBaiDTO;
import com.stu.attendance.service.TuanNopBaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tuan-nop-bai")
@RequiredArgsConstructor
public class TuanNopBaiController {

    private final TuanNopBaiService tuanNopBaiService;

    @GetMapping("/nhom-do-an/{maNhomDoan}")
    public ResponseEntity<List<TuanNopBaiDTO>> getWeeksByNhomDoan(@PathVariable Integer maNhomDoan) {
        List<TuanNopBaiDTO> weeks = tuanNopBaiService.getWeeksByNhomDoan(maNhomDoan);
        return ResponseEntity.ok(weeks);
    }

    @GetMapping("/active")
    public ResponseEntity<List<TuanNopBaiDTO>> getActiveWeeks() {
        List<TuanNopBaiDTO> weeks = tuanNopBaiService.getActiveWeeks();
        return ResponseEntity.ok(weeks);
    }

    @PostMapping
    public ResponseEntity<TuanNopBaiDTO> createWeek(@RequestBody TuanNopBaiDTO dto) {
        TuanNopBaiDTO created = tuanNopBaiService.createWeek(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{maTuan}")
    public ResponseEntity<TuanNopBaiDTO> updateWeek(@PathVariable Integer maTuan, @RequestBody TuanNopBaiDTO dto) {
        TuanNopBaiDTO updated = tuanNopBaiService.updateWeek(maTuan, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{maTuan}")
    public ResponseEntity<Void> deleteWeek(@PathVariable Integer maTuan) {
        tuanNopBaiService.deleteWeek(maTuan);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{maTuan}/close")
    public ResponseEntity<Void> closeWeek(@PathVariable Integer maTuan) {
        tuanNopBaiService.closeWeek(maTuan);
        return ResponseEntity.ok().build();
    }
}