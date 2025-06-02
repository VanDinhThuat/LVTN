package com.stu.attendance.controller;

import com.stu.attendance.dto.NopBaiDTO;
import com.stu.attendance.dto.SubmissionReportDTO;
import com.stu.attendance.service.NopBaiService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nop-bai")
@RequiredArgsConstructor
public class NopBaiController {

    private final NopBaiService nopBaiService;
    private final String UPLOAD_DIR = "uploads/submissions/";

    @GetMapping("/tuan/{maTuan}")
    public ResponseEntity<List<NopBaiDTO>> getSubmissionsByWeek(@PathVariable Integer maTuan) {
        List<NopBaiDTO> submissions = nopBaiService.getSubmissionsByWeek(maTuan);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/sinh-vien/{maNguoiDung}")
    public ResponseEntity<List<NopBaiDTO>> getSubmissionsByStudent(@PathVariable String maNguoiDung) {
        List<NopBaiDTO> submissions = nopBaiService.getSubmissionsByStudent(maNguoiDung);
        return ResponseEntity.ok(submissions);
    }

    @PostMapping("/submit")
    public ResponseEntity<NopBaiDTO> submitFile(
            @RequestParam("maTuan") Integer maTuan,
            @RequestParam("maNguoiDung") String maNguoiDung,
            @RequestParam("file") MultipartFile file) {
        try {
            NopBaiDTO submission = nopBaiService.submitFile(maTuan, maNguoiDung, file);
            return ResponseEntity.ok(submission);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{maNopBai}")
    public ResponseEntity<Void> deleteSubmission(
            @PathVariable Integer maNopBai,
            @RequestParam String maNguoiDung) {
        try {
            nopBaiService.deleteSubmission(maNopBai, maNguoiDung);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{maNopBai}/ghi-chu")
    public ResponseEntity<Void> addTeacherNote(
            @PathVariable Integer maNopBai,
            @RequestBody Map<String, String> request) {
        String ghiChu = request.get("ghiChu");
        nopBaiService.addTeacherNote(maNopBai, ghiChu);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bao-cao/{maTuan}")
    public ResponseEntity<SubmissionReportDTO> getSubmissionReport(@PathVariable Integer maTuan) {
        SubmissionReportDTO report = nopBaiService.getSubmissionReport(maTuan);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/download/{maTuan}/{fileName}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Integer maTuan,
            @PathVariable String fileName) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + maTuan + "/" + fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}