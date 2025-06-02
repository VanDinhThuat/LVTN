package com.stu.attendance.controller;

import com.stu.attendance.dto.*;
import com.stu.attendance.entity.LopSinhVien;
import com.stu.attendance.entity.MonHoc;
import com.stu.attendance.entity.NguoiDung;
import com.stu.attendance.entity.TaiKhoan;
import com.stu.attendance.repository.AttendanceRepository;
import com.stu.attendance.repository.DiemDanhSinhVienRepository;
import com.stu.attendance.repository.NguoiThamGiaRepository;
import com.stu.attendance.service.AdminService;
import com.stu.attendance.service.NguoiThamGiaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final NguoiThamGiaService nguoiThamGiaService;
    private final DiemDanhSinhVienRepository diemDanhSinhVienRepository;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserInfoDto>> getAllUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TaiKhoan.Role role) {
        return ResponseEntity.ok(adminService.getAllUsers(keyword, role));
    }

    @PostMapping("/users")
    public ResponseEntity<UserInfoDto> createUser(@Valid @RequestBody UserInfoDto userInfoDto) {
        return ResponseEntity.ok(adminService.createUser(userInfoDto));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UpdateUserRequest> updateUser(@PathVariable String userId, @RequestBody UpdateUserRequest userInfoDto) {
        return ResponseEntity.ok(adminService.updateUser(userId, userInfoDto));
    }
    @GetMapping("/nguoi-dung")
    public ResponseEntity<LoginResponse> getNguoiDung(@RequestParam String id){
        LoginResponse response = new LoginResponse();
        NguoiDung nguoiDung = adminService.getNguoiDung(id);
        UserInfoDto dto = new UserInfoDto();
        dto.setFullName(nguoiDung.getTenNguoiDung());
        dto.setRole(nguoiDung.getTaiKhoan().getRole());
        dto.setEmail(nguoiDung.getEmail());
        dto.setPhone(nguoiDung.getSdt());
        dto.setClassId(nguoiDung.getLopSinhVien().getMaLop());
        dto.setClassName(nguoiDung.getLopSinhVien().getTenLop());
        dto.setUserId(nguoiDung.getMaNguoiDung());
        dto.setUsername(nguoiDung.getTenNguoiDung());
        response.setUser(dto);
        response.setRole(nguoiDung.getTaiKhoan().getRole());
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/users/import")
//    public ResponseEntity<Map<String, Object>> importUsers(@RequestParam("file") MultipartFile file) {
//        return ResponseEntity.ok(adminService.importUsersFromExcel(file));
//    }

    // Class Management
    @GetMapping("/classes")
    public ResponseEntity<List<Map<String, Object>>> getAllClasses(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminService.getAllClasses(keyword));
    }

    @GetMapping("/classId")
    public ResponseEntity<LopSinhVien> getLopById(@RequestParam String id){
        return ResponseEntity.ok(adminService.getLopHoc(id));
    }

    @PostMapping("/classes")
    public ResponseEntity<Map<String, Object>> createClass(@RequestBody Map<String, String> classInfo) {
        return ResponseEntity.ok(adminService.createClass(classInfo));
    }

    @PutMapping("/classes/{classId}")
    public ResponseEntity<Map<String, Object>> updateClass(@PathVariable String classId, @RequestBody Map<String, String> classInfo) {
        return ResponseEntity.ok(adminService.updateClass(classId, classInfo));
    }

    @DeleteMapping("/classes/{classId}")
    public ResponseEntity<Void> deleteClass(@PathVariable String classId) {
        adminService.deleteClass(classId);
        return ResponseEntity.noContent().build();
    }

    // Subject Management
    @GetMapping("/subjects")
    public ResponseEntity<List<Map<String, Object>>> getAllSubjects(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminService.getAllSubjects(keyword));
    }

    @PostMapping("/subjects")
    public ResponseEntity<Map<String, Object>> createSubject(@RequestBody Map<String, String> subjectInfo) {
        return ResponseEntity.ok(adminService.createSubject(subjectInfo));
    }

    @GetMapping("/subjects/id")
    public ResponseEntity<MonHoc> getMonHocById(@RequestParam String id){
        return ResponseEntity.ok(adminService.getMonHoc(id));
    }

    @PutMapping("/subjects/{subjectId}")
    public ResponseEntity<Map<String, Object>> updateSubject(@PathVariable String subjectId, @RequestBody Map<String, String> subjectInfo) {
        return ResponseEntity.ok(adminService.updateSubject(subjectId, subjectInfo));
    }

    @DeleteMapping("/subjects/{subjectId}")
    public ResponseEntity<Void> deleteSubject(@PathVariable String subjectId) {
        adminService.deleteSubject(subjectId);
        return ResponseEntity.noContent().build();
    }

    // Room Management
    @GetMapping("/rooms")
    public ResponseEntity<List<Map<String, Object>>> getAllRooms(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(adminService.getAllRooms(keyword));
    }

    @PostMapping("/rooms")
    public ResponseEntity<Map<String, Object>> createRoom(@RequestBody Map<String, String> roomInfo) {
        return ResponseEntity.ok(adminService.createRoom(roomInfo));
    }

    @PutMapping("/rooms/{roomId}")
    public ResponseEntity<Map<String, Object>> updateRoom(@PathVariable String roomId, @RequestBody Map<String, String> roomInfo) {
        return ResponseEntity.ok(adminService.updateRoom(roomId, roomInfo));
    }

    @DeleteMapping("/rooms/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable String roomId) {
        adminService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionDto>> getAllSessions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) String roomId) {
        return ResponseEntity.ok(adminService.getAllSessions(startDate, endDate, subjectId, roomId));
    }
    @GetMapping("/sessions/get")
    public ResponseEntity<List<SessionDto>> getSSByGV(@RequestParam(required = false) String gvId){
        System.out.println(gvId);
        return ResponseEntity.ok(adminService.getAllSessions(gvId));

    }

    @GetMapping("/session/getid")
    public ResponseEntity<SessionDto> getSSByID(@RequestParam(required = false) Integer id){
        return ResponseEntity.ok(adminService.getById(id));
    }


    @PostMapping("/sessions")
    public ResponseEntity<SessionDto> createSession(@Valid @RequestBody SessionDto sessionDto) {
        return ResponseEntity.ok(adminService.createSession(sessionDto));
    }

    @PutMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionDto> updateSession(@PathVariable Integer sessionId, @Valid @RequestBody SessionDto sessionDto) {
        return ResponseEntity.ok(adminService.updateSession(sessionId, sessionDto));
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable Integer sessionId) {
        adminService.deleteSession(sessionId);
        return ResponseEntity.noContent().build();
    }
//    @GetMapping("/session/student")
//    public ResponseEntity<List<SessionDto>> getSSByID(@RequestParam(required = false) Integer id){
//        return null;
//    }
@PostMapping("/student/add")
public void addStudent(@RequestBody NguoiThamGiaDTO request){
    nguoiThamGiaService.addStudent(request.getUserId(), request.getMaThamGia());
}

    @GetMapping("/sessions/student")
    public ResponseEntity<List<SessionDto>> getSSByStudent(@RequestParam(required = false) String id){
        return ResponseEntity.ok(adminService.getSSByUser(id));
    }
    @GetMapping("/session/sinh-vien")
    public ResponseEntity<List<UserInfoDto>> getStudentBySS(@RequestParam(required = false) Integer id){
        return ResponseEntity.ok(adminService.getStudentBySS(id));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserInfoDto> getUserById(@RequestParam String id){
        return ResponseEntity.ok(adminService.getUser(id));
    }

    @GetMapping("/delete/student")
    public ResponseEntity<String> deleteStudent(@RequestParam String studentId, @RequestParam Integer sessionId) {
        return ResponseEntity.ok(adminService.delStudent(studentId, sessionId));
    }
    @PostMapping("/otp")
    public ResponseEntity<String> getOTPCode(@RequestBody EmailRequest request){
        return ResponseEntity.ok(adminService.getOTPCode(request.getEmail()));
    }

    @PostMapping("change-pass")
    public ResponseEntity<String> changePassWord(@RequestBody ChangePassWordRequest request){
        return ResponseEntity.ok(adminService.changePassword(request));
    }
    @GetMapping("/attendance/history")
    public ResponseEntity<List<Map<String, Object>>> getAllAttendanceHistory() {
        return ResponseEntity.ok(adminService.getAllAttendanceHistory());
    }

    // API to get attendance history for a specific student
    @GetMapping("/attendance/history/student/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentAttendanceHistory(@PathVariable String studentId) {
        return ResponseEntity.ok(adminService.getStudentAttendanceHistory(studentId));
    }

    // API to get attendance history for a specific subject
    @GetMapping("/attendance/history/subject/{subjectId}")
    public ResponseEntity<List<Map<String, Object>>> getSubjectAttendanceHistory(@PathVariable String subjectId) {
        return ResponseEntity.ok(adminService.getSubjectAttendanceHistory(subjectId));
    }

    // API to get attendance history for a specific teacher
    @GetMapping("/attendance/history/teacher/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>> getTeacherAttendanceHistory(@PathVariable String teacherId) {
        return ResponseEntity.ok(adminService.getTeacherAttendanceHistory(teacherId));
    }

    // API to get attendance history for a specific room
    @GetMapping("/attendance/history/room/{roomId}")
    public ResponseEntity<List<Map<String, Object>>> getRoomAttendanceHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(adminService.getRoomAttendanceHistory(roomId));
    }

    // API to get attendance history for a specific student and subject
    @GetMapping("/attendance/history/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentSubjectAttendanceHistory(
            @PathVariable String studentId,
            @PathVariable String subjectId) {
        return ResponseEntity.ok(adminService.getStudentSubjectAttendanceHistory(studentId, subjectId));
    }
}