package com.stu.attendance.service;

import com.stu.attendance.dto.*;
import com.stu.attendance.entity.NguoiDung;
import com.stu.attendance.entity.NopBai;
import com.stu.attendance.entity.TuanNopBai;
import com.stu.attendance.entity.NguoiThamGia;
import com.stu.attendance.entity.ThamGiaLopDoAn;
import com.stu.attendance.repository.NopBaiRepository;
import com.stu.attendance.repository.TeacherRepository;
import com.stu.attendance.repository.TuanNopBaiRepository;
import com.stu.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NopBaiService {

    private final NopBaiRepository nopBaiRepository;
    private final TuanNopBaiRepository tuanNopBaiRepository;
    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;

    private final String UPLOAD_DIR = "uploads/submissions/";

    public List<NopBaiDTO> getSubmissionsByWeek(Integer maTuan) {
        List<NopBai> submissions = nopBaiRepository.findByTuanNopBai_MaTuanOrderByNgayNopDesc(maTuan);
        return submissions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<NopBaiDTO> getSubmissionsByStudent(String maNguoiDung) {
        List<NopBai> submissions = nopBaiRepository.findByNguoiDung_MaNguoiDungOrderByNgayNopDesc(maNguoiDung);
        return submissions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public NopBaiDTO submitFile(Integer maTuan, String maNguoiDung, MultipartFile file) throws IOException {
        // Kiểm tra tuần nộp bài
        TuanNopBai tuanNopBai = tuanNopBaiRepository.findById(maTuan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuần nộp bài"));

        if (!"active".equals(tuanNopBai.getTrangThai())) {
            throw new RuntimeException("Tuần nộp bài đã đóng");
        }

        // Kiểm tra sinh viên
        NguoiDung nguoiDung = userRepository.findById(maNguoiDung)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // Kiểm tra đã nộp bài chưa
        if (nopBaiRepository.existsByTuanNopBai_MaTuanAndNguoiDung_MaNguoiDung(maTuan, maNguoiDung)) {
            throw new RuntimeException("Bạn đã nộp bài cho tuần này rồi");
        }

        // Lưu file
        String fileName = saveFile(file, maTuan, maNguoiDung);

        // Tạo bản ghi nộp bài
        NopBai nopBai = new NopBai();
        nopBai.setTuanNopBai(tuanNopBai);
        nopBai.setNguoiDung(nguoiDung);
        nopBai.setTenFile(file.getOriginalFilename());
        nopBai.setDuongDanFile(fileName);
        nopBai.setKichThuoc(file.getSize());
        nopBai.setLoaiFile(getFileExtension(file.getOriginalFilename()));
        nopBai.setNgayNop(LocalDateTime.now());

        NopBai saved = nopBaiRepository.save(nopBai);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteSubmission(Integer maNopBai, String maNguoiDung) throws IOException {
        NopBai nopBai = nopBaiRepository.findById(maNopBai)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp"));

        // Kiểm tra quyền xóa (chỉ sinh viên nộp bài mới được xóa)
        if (!nopBai.getNguoiDung().getMaNguoiDung().equals(maNguoiDung)) {
            throw new RuntimeException("Bạn không có quyền xóa bài nộp này");
        }

        // Xóa file
        deleteFile(nopBai.getDuongDanFile());

        // Xóa bản ghi
        nopBaiRepository.delete(nopBai);
    }

    @Transactional
    public void addTeacherNote(Integer maNopBai, String ghiChu) {
        NopBai nopBai = nopBaiRepository.findById(maNopBai)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài nộp"));

        nopBai.setGhiChuGv(ghiChu);
        nopBaiRepository.save(nopBai);
    }

    public SubmissionReportDTO getSubmissionReport(Integer maTuan) {
        TuanNopBai tuanNopBai = tuanNopBaiRepository.findById(maTuan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuần nộp bài"));

        // Lấy danh sách sinh viên tham gia lớp đồ án
        List<NguoiDung> allStudents = tuanNopBai.getNhomDoAn().getLopDoAn().getThamGiaLopDoAns().stream()
                .map(ThamGiaLopDoAn::getNguoiDung)
                .filter(nd -> nd.getTaiKhoan() != null && "student".equals(nd.getTaiKhoan().getRole()))
                .collect(Collectors.toList());

        // Lấy danh sách bài nộp
        List<NopBai> submissions = nopBaiRepository.findByTuanNopBai_MaTuanOrderByNgayNopDesc(maTuan);

        // Tạo báo cáo
        SubmissionReportDTO report = new SubmissionReportDTO();
        report.setMaTuan(maTuan);
        report.setTenTuan(tuanNopBai.getTenTuan());
        report.setTongSinhVien((long) allStudents.size());
        report.setSinhVienDaNop((long) submissions.size());
        report.setSinhVienChuaNop(report.getTongSinhVien() - report.getSinhVienDaNop());

        // Chi tiết từng sinh viên
        List<StudentSubmissionDTO> chiTiet = allStudents.stream().map(student -> {
            StudentSubmissionDTO dto = new StudentSubmissionDTO();
            dto.setMaNguoiDung(student.getMaNguoiDung());
            dto.setTenNguoiDung(student.getTenNguoiDung());
            dto.setMaLop(student.getLopSinhVien() != null ? student.getLopSinhVien().getMaLop() : "");

            NopBai submission = submissions.stream()
                    .filter(s -> s.getNguoiDung().getMaNguoiDung().equals(student.getMaNguoiDung()))
                    .findFirst().orElse(null);

            if (submission != null) {
                dto.setDaNop(true);
                dto.setTenFile(submission.getTenFile());
                dto.setNgayNop(submission.getNgayNop());
                dto.setTrangThaiNop(submission.getNgayNop().toLocalDate().isAfter(tuanNopBai.getNgayKetThuc()) ? "Nộp trễ" : "Đã nộp");
            } else {
                dto.setDaNop(false);
                dto.setTrangThaiNop("Chưa nộp");
            }

            return dto;
        }).collect(Collectors.toList());

        report.setChiTietSinhVien(chiTiet);
        return report;
    }

    private String saveFile(MultipartFile file, Integer maTuan, String maNguoiDung) throws IOException {
        // Tạo thư mục nếu chưa có
        Path uploadPath = Paths.get(UPLOAD_DIR + maTuan);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo tên file unique
        String originalFileName = file.getOriginalFilename();
        String extension = getFileExtension(originalFileName);
        String fileName = maNguoiDung + "_" + UUID.randomUUID().toString() + "." + extension;

        // Lưu file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return maTuan + "/" + fileName;
    }

    private void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(UPLOAD_DIR + filePath);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    private NopBaiDTO convertToDTO(NopBai entity) {
        NopBaiDTO dto = new NopBaiDTO();
        dto.setMaNopBai(entity.getMaNopBai());
        dto.setMaTuan(entity.getTuanNopBai().getMaTuan());
        dto.setTenTuan(entity.getTuanNopBai().getTenTuan());
        dto.setMaNguoiDung(entity.getNguoiDung().getMaNguoiDung());
        dto.setTenNguoiDung(entity.getNguoiDung().getTenNguoiDung());
        dto.setTenFile(entity.getTenFile());
        dto.setDuongDanFile(entity.getDuongDanFile());
        dto.setKichThuoc(entity.getKichThuoc());
        dto.setLoaiFile(entity.getLoaiFile());
        dto.setNgayNop(entity.getNgayNop());
        dto.setGhiChuGv(entity.getGhiChuGv());
        return dto;
    }
}