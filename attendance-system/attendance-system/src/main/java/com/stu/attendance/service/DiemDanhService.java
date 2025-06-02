package com.stu.attendance.service;

import com.stu.attendance.dto.CreateDiemDanhRequest;
import com.stu.attendance.dto.DiemDanhListResponse;
import com.stu.attendance.dto.DiemDanhSinhVienRequest;
import com.stu.attendance.dto.SinhVienStatusDTO;
import com.stu.attendance.entity.BuoiHoc;
import com.stu.attendance.entity.DiemDanh;
import com.stu.attendance.entity.DiemDanhSinhVien;
import com.stu.attendance.entity.NguoiDung;
import com.stu.attendance.repository.AttendanceRepository;
import com.stu.attendance.repository.DiemDanhSinhVienRepository;
import com.stu.attendance.repository.SessionRepository;
import com.stu.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiemDanhService {

    private final AttendanceRepository diemDanhRepository;
    private final SessionRepository buoiHocRepository;
    private final UserRepository userRepository;
    private final DiemDanhSinhVienRepository diemDanhSinhVienRepository;

    public String generateAttendanceCode(CreateDiemDanhRequest request) {
        // Sinh mã ngắn (6 ký tự)
        String code = UUID.randomUUID().toString().substring(0, 6);

        // Tạo đối tượng DiemDanh
        DiemDanh diemDanh = new DiemDanh();
        diemDanh.setCode(code);

        // Lấy thông tin buổi học từ buoiHocRepository
        BuoiHoc buoiHoc = buoiHocRepository.findById(request.getBuoiHocId())
                .orElseThrow(() -> new IllegalArgumentException("Buổi học không tồn tại"));

        diemDanh.setBuoiHoc(buoiHoc);

        ZonedDateTime vnTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime now = vnTime.toLocalDateTime();
        diemDanh.setCreatedAt(now);


        // Tính thời gian hết hạn sau 1 phút từ thời điểm hiện tại
        LocalDateTime expiredAt = now.plusMinutes(3);

        diemDanh.setExpiredAt(expiredAt);

        // Kiểm tra thời gian hết hạn có hợp lý không
        if (expiredAt.isBefore(now)) {
            throw new IllegalArgumentException("Thời gian hết hạn không hợp lệ.");
        }

        // Lấy thông tin người dùng từ userRepository
        NguoiDung nguoiDung = userRepository.findByMaNguoiDung(request.getMaNguoidung())
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));

        diemDanh.setNguoiDung(nguoiDung);

        // Lưu đối tượng DiemDanh vào cơ sở dữ liệu
        diemDanhRepository.save(diemDanh);

        // Trả về mã điểm danh
        return code;
    }

//    public String diemDanh(DiemDanhSinhVienRequest request) {
//
//        // Tìm người dùng theo mã sinh viên
//        NguoiDung nguoiDung = userRepository.findByMaNguoiDung(request.getStudentId())
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));
//
//        // Lấy thông tin điểm danh theo mã code
//        DiemDanh diemDanh = diemDanhRepository.findByCode(request.getCode());
//        if (diemDanh == null) {
//            throw new RuntimeException("Mã điểm danh không hợp lệ");
//        }
//        Optional<DiemDanhSinhVien> student = diemDanh.getDiemDanhSinhVienList().stream()
//                .filter(ddsv -> ddsv.getUser().getMaNguoiDung().equals(request.getStudentId()))
//                .findFirst();
//
//        if (student.isPresent()) {
//            DiemDanhSinhVien diemDanhSinhVien = student.get();
//            if (!diemDanhSinhVien.getStatus().equals("Vắng")) { // So sánh chuỗi đúng
//                return "Sinh viên đã điểm danh cho buổi học này";
//            }
//        } else {
//            // Không tìm thấy sinh viên
//            System.out.println("Không tìm thấy sinh viên với mã " + request.getStudentId());
//        }
//        // Kiểm tra xem sinh viên đã điểm danh cho mã điểm danh này chưa
//        boolean alreadyAttended = diemDanh.getDiemDanhSinhVienList().stream()
//                .anyMatch(ddsv -> ddsv.getUser().getMaNguoiDung().equals(request.getStudentId()));
//
//        if (alreadyAttended) {
//            return "Sinh viên đã điểm danh cho buổi học này";
//        }
//
//        // Thiết lập thời gian hết hạn là 6 phút sau thời gian tạo
//        LocalDateTime expirationTime = diemDanh.getCreatedAt().plusMinutes(6);
//        diemDanh.setExpiredAt(expirationTime);
//
//        // Lấy thời gian hiện tại theo múi giờ Việt Nam
//        ZonedDateTime vnTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
//        LocalDateTime now = vnTime.toLocalDateTime();
//
//        // Lấy thời gian bắt đầu (createdAt) của điểm danh
//        LocalDateTime createdAt = diemDanh.getCreatedAt();
//
//        // Kiểm tra thời gian điểm danh có hợp lệ không
//        if (createdAt != null) {
//            // Tính thời gian từ lúc tạo điểm danh đến lúc sinh viên điểm danh
//            Duration duration = Duration.between(createdAt, now);
//            long minutesSinceCreation = duration.toMinutes();
//
//            // Nếu quá 6 phút, không cho phép điểm danh
//            if (minutesSinceCreation > 6) {
//                return "Đã quá thời gian điểm danh (6 phút). Không thể điểm danh.";
//            }
//        }
//
//        // Tìm buổi học liên quan đến điểm danh
//        BuoiHoc buoiHoc = buoiHocRepository.findById(diemDanh.getBuoiHoc().getMaBuoiHoc())
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học"));
//
//        // Tạo đối tượng DiemDanhSinhVien
//        DiemDanhSinhVien diemDanhSinhVien = new DiemDanhSinhVien();
//        diemDanhSinhVien.setDiemDanh(diemDanh);
//        diemDanhSinhVien.setTime(request.getTime());
//        diemDanhSinhVien.setUser(nguoiDung);
//
//        // Gán trạng thái dựa vào thời gian điểm danh
//        if (createdAt != null) {
//            Duration duration = Duration.between(createdAt, now);
//            long minutesSinceCreation = duration.toMinutes();
//
//            if (minutesSinceCreation <= 3) {
//                diemDanhSinhVien.setStatus("Đúng giờ");
//            } else if (minutesSinceCreation <= 6) {
//                diemDanhSinhVien.setStatus("Trễ");
//            }
//        }
//
//        // Lưu đối tượng điểm danh sinh viên vào cơ sở dữ liệu
//        diemDanhSinhVienRepository.save(diemDanhSinhVien);
//// Lấy danh sách tất cả sinh viên và trạng thái điểm danh hiện có
//        List<SinhVienStatusDTO> danhSachSinhVien = diemDanhSinhVienRepository.findAllStudentsAndStatusByDiemDanhId(diemDanh.getMaDiemDanh());
//
//// Thêm sinh viên còn thiếu vào danh sách điểm danh với trạng thái "Vang"
//        for (SinhVienStatusDTO sv : danhSachSinhVien) {
//            if (sv.getStatus() == null) { // Chưa có bản ghi DiemDanhSinhVien
//                NguoiDung sinhVien = userRepository.findByMaNguoiDung(sv.getMaNguoiDung())
//                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + sv.getMaNguoiDung()));
//
//                DiemDanhSinhVien vangSV = new DiemDanhSinhVien();
//                vangSV.setUser(sinhVien);
//                vangSV.setDiemDanh(diemDanh);
//                vangSV.setTime(now); // không có thời gian vì không điểm danh
//                vangSV.setStatus("Vắng");
//                diemDanhSinhVienRepository.save(vangSV);
//            }
//        }
//
//        return "Điểm danh thành công";
//    }

public String diemDanh(DiemDanhSinhVienRequest request) {

    // Tìm người dùng theo mã sinh viên
    NguoiDung nguoiDung = userRepository.findByMaNguoiDung(request.getStudentId())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

    // Lấy thông tin điểm danh theo mã code
    DiemDanh diemDanh = diemDanhRepository.findByCode(request.getCode());
    if (diemDanh == null) {
        throw new RuntimeException("Mã điểm danh không hợp lệ");
    }

    // Kiểm tra nếu đã có bản ghi điểm danh sinh viên cho sinh viên này
    Optional<DiemDanhSinhVien> existingRecord = diemDanh.getDiemDanhSinhVienList().stream()
            .filter(ddsv -> ddsv.getUser().getMaNguoiDung().equals(request.getStudentId()))
            .findFirst();

    // Thiết lập thời gian hết hạn là 6 phút sau thời gian tạo
    LocalDateTime expirationTime = diemDanh.getCreatedAt().plusMinutes(6);
    diemDanh.setExpiredAt(expirationTime);

    // Lấy thời gian hiện tại theo múi giờ Việt Nam
    ZonedDateTime vnTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
    LocalDateTime now = vnTime.toLocalDateTime();

    // Lấy thời gian bắt đầu (createdAt) của điểm danh
    LocalDateTime createdAt = diemDanh.getCreatedAt();

    // Kiểm tra thời gian điểm danh có hợp lệ không
    if (createdAt != null) {
        // Tính thời gian từ lúc tạo điểm danh đến lúc sinh viên điểm danh
        Duration duration = Duration.between(createdAt, now);
        long minutesSinceCreation = duration.toMinutes();

        // Nếu quá 6 phút, không cho phép điểm danh
        if (minutesSinceCreation > 6) {
            return "Đã quá thời gian điểm danh (6 phút). Không thể điểm danh.";
        }
    }

    // Xác định trạng thái dựa vào thời gian điểm danh
    String attendanceStatus = "Đúng giờ";
    if (createdAt != null) {
        Duration duration = Duration.between(createdAt, now);
        long minutesSinceCreation = duration.toMinutes();

        if (minutesSinceCreation <= 3) {
            attendanceStatus = "Đúng giờ";
        } else if (minutesSinceCreation <= 6) {
            attendanceStatus = "Trễ";
        }
    }

    // Tìm buổi học liên quan đến điểm danh
    BuoiHoc buoiHoc = buoiHocRepository.findById(diemDanh.getBuoiHoc().getMaBuoiHoc())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi học"));

    DiemDanhSinhVien diemDanhSinhVien;
    String returnMessage = "Điểm danh thành công";

    if (existingRecord.isPresent()) {
        // Nếu đã có bản ghi
        diemDanhSinhVien = existingRecord.get();

        if ("Vắng".equals(diemDanhSinhVien.getStatus())) {
            // Cập nhật bản ghi từ "Vắng" sang trạng thái mới
            diemDanhSinhVien.setStatus(attendanceStatus);
            diemDanhSinhVien.setTime(now);
            diemDanhSinhVienRepository.save(diemDanhSinhVien);
        } else {
            // Sinh viên đã điểm danh rồi (không phải "Vắng")
            returnMessage = "Sinh viên đã điểm danh cho buổi học này";
        }
    } else {
        // Chưa có bản ghi, tạo mới
        diemDanhSinhVien = new DiemDanhSinhVien();
        diemDanhSinhVien.setDiemDanh(diemDanh);
        diemDanhSinhVien.setTime(now);
        diemDanhSinhVien.setUser(nguoiDung);
        diemDanhSinhVien.setStatus(attendanceStatus);
        diemDanhSinhVienRepository.save(diemDanhSinhVien);
    }

    // Lấy danh sách tất cả sinh viên và trạng thái điểm danh hiện có
    List<SinhVienStatusDTO> danhSachSinhVien = diemDanhSinhVienRepository.findAllStudentsAndStatusByDiemDanhId(diemDanh.getMaDiemDanh());

    // Thêm sinh viên còn thiếu vào danh sách điểm danh với trạng thái "Vang"
    for (SinhVienStatusDTO sv : danhSachSinhVien) {
        if (sv.getStatus() == null) { // Chưa có bản ghi DiemDanhSinhVien
            NguoiDung sinhVien = userRepository.findByMaNguoiDung(sv.getMaNguoiDung())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + sv.getMaNguoiDung()));

            DiemDanhSinhVien vangSV = new DiemDanhSinhVien();
            vangSV.setUser(sinhVien);
            vangSV.setDiemDanh(diemDanh);
            vangSV.setTime(now);
            vangSV.setStatus("Vắng");
            diemDanhSinhVienRepository.save(vangSV);
        }
    }

    return returnMessage;
}
    public List<DiemDanhListResponse> getDiemDanhList(String userId, Integer sessionId){
        return diemDanhSinhVienRepository.getDiemDanhListByNguoiDungAndBuoiHoc(userId, sessionId);
    }
    public List<DiemDanh> getDanhSach(Integer id){
        return diemDanhRepository.findByMaBuoiHoc(id);
    }
    public List<SinhVienStatusDTO> getAllStatus(Integer id){

        return  diemDanhSinhVienRepository.findAllStudentsAndStatusByDiemDanhId(id);
    }
}
