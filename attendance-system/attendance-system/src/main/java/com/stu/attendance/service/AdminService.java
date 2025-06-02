package com.stu.attendance.service;

import com.stu.attendance.dto.ChangePassWordRequest;
import com.stu.attendance.dto.SessionDto;
import com.stu.attendance.dto.UpdateUserRequest;
import com.stu.attendance.dto.UserInfoDto;
import com.stu.attendance.entity.*;
import com.stu.attendance.repository.*;
import jakarta.mail.Session;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final RoomRepository roomRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthRepository authRepository;
    private final NguoiThamGiaRepository nguoiThamGiaRepository;
    private final DiemDanhSinhVienRepository diemDanhSinhVienRepository;
    @Autowired
    private JavaMailSender mailSender;

    // User Management
    public List<UserInfoDto> getAllUsers(String keyword, TaiKhoan.Role role) {
        List<NguoiDung> users = userRepository.findAllUsers(keyword, role);
        return users.stream()
                .map(this::convertToUserInfoDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserInfoDto createUser(UserInfoDto userInfoDto) {
        // Validate user doesn't exist already
        if (userRepository.existsByMaNguoiDung(userInfoDto.getUserId())) {
            throw new IllegalArgumentException("Mã người dùng đã tồn tại");
        }
        if (userRepository.existsByEmail(userInfoDto.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        // Create account
        TaiKhoan taiKhoan = new TaiKhoan();
        taiKhoan.setMaTaiKhoan(UUID.randomUUID().toString());
        taiKhoan.setTenTaiKhoan(userInfoDto.getUsername());
        // Default password is the user ID, or a specific default
        String defaultPassword = userInfoDto.getUserId();
        taiKhoan.setMatKhau(passwordEncoder.encode(defaultPassword));
        taiKhoan.setRole(userInfoDto.getRole());
        authRepository.save(taiKhoan);


        // Create user
        NguoiDung nguoiDung = new NguoiDung();
        nguoiDung.setMaNguoiDung(userInfoDto.getUserId());
        nguoiDung.setTenNguoiDung(userInfoDto.getFullName());
        nguoiDung.setEmail(userInfoDto.getEmail());
        nguoiDung.setSdt(userInfoDto.getPhone());

        // Set class if provided
        if (userInfoDto.getClassId() != null && !userInfoDto.getClassId().isEmpty()) {
            // Tìm lớp thực tế từ database
            LopSinhVien lopSinhVien = classRepository.findById(userInfoDto.getClassId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lớp"));
            nguoiDung.setLopSinhVien(lopSinhVien);
        }

        nguoiDung.setTaiKhoan(taiKhoan);

        NguoiDung savedUser = userRepository.save(nguoiDung);
        return convertToUserInfoDto(savedUser);
    }

    @Transactional
    public UpdateUserRequest updateUser(String userId, UpdateUserRequest userInfoDto) {
        NguoiDung existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        existingUser.setSdt(userInfoDto.getSdt());
        existingUser.setEmail(userInfoDto.getEmail());
        existingUser.setTenNguoiDung(userInfoDto.getFullName());
        if(userInfoDto.getMaLop().length() > 0){
            LopSinhVien lop = classRepository.findById(userInfoDto.getMaLop()).get();
            existingUser.setLopSinhVien(lop);
        }
        userRepository.save(existingUser);
        return userInfoDto;
    }

    @Transactional
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("Không tìm thấy người dùng");
        }
        NguoiDung nguoiDung = userRepository.findByMaNguoiDung(userId).get();
        TaiKhoan taiKhoan = authRepository.findByUserId(userId).get();
        authRepository.delete(taiKhoan);
        userRepository.deleteById(userId);
    }
    public NguoiDung getNguoiDung(String id){
        return userRepository.findById(id).get();
    }
    // Class Management
    public List<Map<String, Object>> getAllClasses(String keyword) {
        List<LopSinhVien> classes = classRepository.findAllClasses(keyword);
        return classes.stream()
                .map(c -> {
                    Map<String, Object> classMap = new HashMap<>();
                    classMap.put("classId", c.getMaLop());
                    classMap.put("className", c.getTenLop());
                    return classMap;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createClass(Map<String, String> classInfo) {
        String classId = classInfo.get("classId");
        String className = classInfo.get("className");

        if (classId == null || classId.isEmpty()) {
            throw new IllegalArgumentException("Mã lớp không được để trống");
        }
        if (className == null || className.isEmpty()) {
            throw new IllegalArgumentException("Tên lớp không được để trống");
        }

        if (classRepository.existsByMaLop(classId)) {
            throw new IllegalArgumentException("Mã lớp đã tồn tại");
        }

        LopSinhVien lopSinhVien = new LopSinhVien();
        lopSinhVien.setMaLop(classId);
        lopSinhVien.setTenLop(className);

        LopSinhVien savedClass = classRepository.save(lopSinhVien);

        Map<String, Object> result = new HashMap<>();
        result.put("classId", savedClass.getMaLop());
        result.put("className", savedClass.getTenLop());
        return result;
    }

    @Transactional
    public Map<String, Object> updateClass(String classId, Map<String, String> classInfo) {
        LopSinhVien existingClass = classRepository.findById(classId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lớp"));

        String className = classInfo.get("className");
        if (className == null || className.isEmpty()) {
            throw new IllegalArgumentException("Tên lớp không được để trống");
        }

        existingClass.setTenLop(className);
        LopSinhVien updatedClass = classRepository.save(existingClass);

        Map<String, Object> result = new HashMap<>();
        result.put("classId", updatedClass.getMaLop());
        result.put("className", updatedClass.getTenLop());
        return result;
    }

    @Transactional
    public void deleteClass(String classId) {
        if (!classRepository.existsById(classId)) {
            throw new EntityNotFoundException("Không tìm thấy lớp");
        }
        classRepository.deleteById(classId);
    }

    // Subject Management
    public List<Map<String, Object>> getAllSubjects(String keyword) {
        List<MonHoc> subjects = subjectRepository.findAllSubjects(keyword);
        return subjects.stream()
                .map(s -> {
                    Map<String, Object> subjectMap = new HashMap<>();
                    subjectMap.put("subjectId", s.getMaMonHoc());
                    subjectMap.put("subjectName", s.getTenMonHoc());
                    return subjectMap;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createSubject(Map<String, String> subjectInfo) {
        String subjectId = subjectInfo.get("subjectId");
        String subjectName = subjectInfo.get("subjectName");

        if (subjectId == null || subjectId.isEmpty()) {
            throw new IllegalArgumentException("Mã môn học không được để trống");
        }
        if (subjectName == null || subjectName.isEmpty()) {
            throw new IllegalArgumentException("Tên môn học không được để trống");
        }

        if (subjectRepository.existsByMaMonHoc(subjectId)) {
            throw new IllegalArgumentException("Mã môn học đã tồn tại");
        }

        MonHoc monHoc = new MonHoc();
        monHoc.setMaMonHoc(subjectId);
        monHoc.setTenMonHoc(subjectName);

        MonHoc savedSubject = subjectRepository.save(monHoc);

        Map<String, Object> result = new HashMap<>();
        result.put("subjectId", savedSubject.getMaMonHoc());
        result.put("subjectName", savedSubject.getTenMonHoc());
        return result;
    }

    @Transactional
    public Map<String, Object> updateSubject(String subjectId, Map<String, String> subjectInfo) {
        MonHoc existingSubject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy môn học"));

        String subjectName = subjectInfo.get("subjectName");
        if (subjectName == null || subjectName.isEmpty()) {
            throw new IllegalArgumentException("Tên môn học không được để trống");
        }

        existingSubject.setTenMonHoc(subjectName);
        MonHoc updatedSubject = subjectRepository.save(existingSubject);

        Map<String, Object> result = new HashMap<>();
        result.put("subjectId", updatedSubject.getMaMonHoc());
        result.put("subjectName", updatedSubject.getTenMonHoc());
        return result;
    }

    @Transactional
    public void deleteSubject(String subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new EntityNotFoundException("Không tìm thấy môn học");
        }
        subjectRepository.deleteById(subjectId);
    }

    // Room Management
    public List<Map<String, Object>> getAllRooms(String keyword) {
        List<Phong> rooms = roomRepository.findAllRooms(keyword);
        return rooms.stream()
                .map(r -> {
                    Map<String, Object> roomMap = new HashMap<>();
                    roomMap.put("roomId", r.getMaPhong());
                    roomMap.put("roomName", r.getTenPhong());
                    return roomMap;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createRoom(Map<String, String> roomInfo) {
        String roomId = roomInfo.get("roomId");
        String roomName = roomInfo.get("roomName");

        if (roomId == null || roomId.isEmpty()) {
            throw new IllegalArgumentException("Mã phòng không được để trống");
        }
        if (roomName == null || roomName.isEmpty()) {
            throw new IllegalArgumentException("Tên phòng không được để trống");
        }

        if (roomRepository.existsByMaPhong(roomId)) {
            throw new IllegalArgumentException("Mã phòng đã tồn tại");
        }

        Phong phong = new Phong();
        phong.setMaPhong(roomId);
        phong.setTenPhong(roomName);

        Phong savedRoom = roomRepository.save(phong);

        Map<String, Object> result = new HashMap<>();
        result.put("roomId", savedRoom.getMaPhong());
        result.put("roomName", savedRoom.getTenPhong());
        return result;
    }

    @Transactional
    public Map<String, Object> updateRoom(String roomId, Map<String, String> roomInfo) {
        Phong existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng"));

        String roomName = roomInfo.get("roomName");
        if (roomName == null || roomName.isEmpty()) {
            throw new IllegalArgumentException("Tên phòng không được để trống");
        }

        existingRoom.setTenPhong(roomName);
        Phong updatedRoom = roomRepository.save(existingRoom);

        Map<String, Object> result = new HashMap<>();
        result.put("roomId", updatedRoom.getMaPhong());
        result.put("roomName", updatedRoom.getTenPhong());
        return result;
    }

    @Transactional
    public void deleteRoom(String roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new EntityNotFoundException("Không tìm thấy phòng");
        }
        roomRepository.deleteById(roomId);
    }

    // Session Management
    public List<SessionDto> getAllSessions(LocalDate startDate, LocalDate endDate, String subjectId, String roomId) {
        // Chuyển đổi từ ngày sang thứ trong tuần (nếu cần)
        String thu = null;
        if (startDate != null) {
            // Nếu startDate và endDate là cùng một ngày, chúng ta có thể lọc theo thứ
            if (endDate != null && startDate.equals(endDate)) {
                thu = convertToWeekDay(startDate);
            }
            // Nếu khác ngày, không thể lọc chính xác theo thứ
        }

        List<BuoiHoc> sessions = sessionRepository.findAllSessions(thu, subjectId, roomId);
        return sessions.stream()
                .map(this::convertToSessionDto)
                .collect(Collectors.toList());
    }
    // Phương thức hỗ trợ để chuyển đổi từ LocalDate sang thứ trong tuần
    private String convertToWeekDay(LocalDate date) {
        int dayOfWeek = date.getDayOfWeek().getValue(); // 1 = Thứ 2, 7 = Chủ nhật

        switch (dayOfWeek) {
            case 1: return "Thứ 2";
            case 2: return "Thứ 3";
            case 3: return "Thứ 4";
            case 4: return "Thứ 5";
            case 5: return "Thứ 6";
            case 6: return "Thứ 7";
            case 7: return "CN";
            default: return null;
        }
    }
    /**
     * Kiểm tra xem giảng viên có bị trùng lịch không
     *
     * @param instructorId ID của giảng viên
     * @param thu Thứ trong tuần (Thứ 2, Thứ 3, ...)
     * @param startPeriod Tiết bắt đầu
     * @param endPeriod Tiết kết thúc
     * @param excludeSessionId ID của buổi học hiện tại (trong trường hợp cập nhật)
     */
    private void checkInstructorAvailability(String instructorId, String thu,
                                             Integer startPeriod, Integer endPeriod,
                                             Integer excludeSessionId) {
        List<BuoiHoc> conflictingSessions;

        if (excludeSessionId != null) {
            conflictingSessions = sessionRepository.findByGvIdAndThuAndMaBuoiHocNot(
                    instructorId, thu, excludeSessionId);
        } else {
            conflictingSessions = sessionRepository.findByGvIdAndThu(instructorId, thu);
        }

        for (BuoiHoc session : conflictingSessions) {
            // Check for time overlap
            if ((startPeriod <= session.getTietKetThuc() && endPeriod >= session.getTietBatDau())) {
                throw new IllegalStateException("Giảng viên đã có lịch dạy vào " + thu +
                        " từ tiết " + session.getTietBatDau() +
                        " đến tiết " + session.getTietKetThuc() +
                        " môn " + session.getMonHoc().getTenMonHoc());
            }
        }
    }


    // These methods need to be implemented in your service class

    /**
     * Kiểm tra xem phòng có bị trùng lịch không
     *
     * @param roomId ID của phòng
     * @param thu Thứ trong tuần (Thứ 2, Thứ 3, ...)
     * @param startPeriod Tiết bắt đầu
     * @param endPeriod Tiết kết thúc
     * @param excludeSessionId ID của buổi học hiện tại (trong trường hợp cập nhật)
     */
    private void checkRoomAvailability(String roomId, String thu,
                                       Integer startPeriod, Integer endPeriod,
                                       Integer excludeSessionId) {
        List<BuoiHoc> conflictingSessions;

        if (excludeSessionId != null) {
            conflictingSessions = sessionRepository.findByPhongMaPhongAndThuAndMaBuoiHocNot(
                    roomId, thu, excludeSessionId);
        } else {
            conflictingSessions = sessionRepository.findByPhongMaPhongAndThu(roomId, thu);
        }

        for (BuoiHoc session : conflictingSessions) {
            // Check for time overlap
            if ((startPeriod <= session.getTietKetThuc() && endPeriod >= session.getTietBatDau())) {
                throw new IllegalStateException("Phòng " + session.getPhong().getTenPhong() +
                        " đã được sử dụng vào " + thu +
                        " từ tiết " + session.getTietBatDau() +
                        " đến tiết " + session.getTietKetThuc());
            }
        }
    }


    /**
     * Check if two time periods overlap
     * @return true if periods overlap, false otherwise
     */
    private boolean checkPeriodOverlap(int start1, int end1, int start2, int end2) {
        // Two periods overlap if one starts during the other or if one completely contains the other
        return (start1 <= end2) && (start2 <= end1);
    }
    /**
     * Kiểm tra xem môn học có bị trùng lịch không
     *
     * @param subjectId ID của môn học
     * @param thu Thứ trong tuần (Thứ 2, Thứ 3, ...)
     * @param startPeriod Tiết bắt đầu
     * @param endPeriod Tiết kết thúc
     * @param excludeSessionId ID của buổi học hiện tại (trong trường hợp cập nhật)
     */
    private void checkSubjectAvailability(String subjectId, String thu,
                                          Integer startPeriod, Integer endPeriod,
                                          Integer excludeSessionId) {
        List<BuoiHoc> conflictingSessions;

        if (excludeSessionId != null) {
            conflictingSessions = sessionRepository.findByMonHocMaMonHocAndThuAndMaBuoiHocNot(
                    subjectId, thu, excludeSessionId);
        } else {
            conflictingSessions = sessionRepository.findByMonHocMaMonHocAndThu(subjectId, thu);
        }

        for (BuoiHoc session : conflictingSessions) {
            // Check for time overlap
            if ((startPeriod <= session.getTietKetThuc() && endPeriod >= session.getTietBatDau())) {
                throw new IllegalStateException("Môn học " + session.getMonHoc().getTenMonHoc() +
                        " đã có lịch học vào " + thu +
                        " từ tiết " + session.getTietBatDau() +
                        " đến tiết " + session.getTietKetThuc());
            }
        }
    }
    @Transactional
    public SessionDto createSession(SessionDto sessionDto) {
        // Updated validation code
        if (sessionDto.getSubjectId() == null || sessionDto.getSubjectId().isEmpty()) {
            throw new IllegalArgumentException("Mã môn học không được để trống");
        }
        if (sessionDto.getRoomId() == null || sessionDto.getRoomId().isEmpty()) {
            throw new IllegalArgumentException("Mã phòng không được để trống");
        }
        if (sessionDto.getThu() == null || sessionDto.getThu().isEmpty()) {
            throw new IllegalArgumentException("Thứ học không được để trống");
        }
        if (sessionDto.getStartPeriod() == null || sessionDto.getEndPeriod() == null) {
            throw new IllegalArgumentException("Tiết học không được để trống");
        }
        if (sessionDto.getStartPeriod() > sessionDto.getEndPeriod()) {
            throw new IllegalArgumentException("Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc");
        }
        if (sessionDto.getGvId() == null || sessionDto.getGvId().isEmpty()) {
            throw new IllegalArgumentException("Mã giảng viên không được để trống");
        }

        // Check for room scheduling conflicts
        checkRoomAvailability(sessionDto.getRoomId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), null);

        // Check for instructor scheduling conflicts
        checkInstructorAvailability(sessionDto.getGvId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), null);

        // Kiểm tra xem môn học đã có buổi học trùng tiết trong cùng thứ chưa
        checkSubjectAvailability(sessionDto.getSubjectId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), null);

        // Create new session
        BuoiHoc buoiHoc = new BuoiHoc();

        // Tìm môn học từ repository
        MonHoc monHoc = subjectRepository.findById(sessionDto.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy môn học"));
        buoiHoc.setMonHoc(monHoc);

        // Tìm phòng từ repository
        Phong phong = roomRepository.findById(sessionDto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng"));
        buoiHoc.setPhong(phong);

        buoiHoc.setThu(sessionDto.getThu());
        buoiHoc.setTietBatDau(sessionDto.getStartPeriod());
        buoiHoc.setTietKetThuc(sessionDto.getEndPeriod());
        String maThamGia = UUID.randomUUID().toString().replace("-", "").substring(0, 10); // 10 ký tự
        buoiHoc.setMaThamGia(maThamGia);
        buoiHoc.setGvId(sessionDto.getGvId());
        buoiHoc.setNgayBatDau(sessionDto.getNgayBatDau());
        buoiHoc.setNgayKetThuc(sessionDto.getNgayKetThuc());
        buoiHoc.setSoBuoi(sessionDto.getSoBuoi() != null ? sessionDto.getSoBuoi() : 1);
        BuoiHoc savedSession = sessionRepository.save(buoiHoc);

        return convertToSessionDto(savedSession);
    }



    @Transactional
    public SessionDto updateSession(Integer sessionId, SessionDto sessionDto) {
        // Validate input
        if (sessionId == null) {
            throw new IllegalArgumentException("Mã buổi học không được để trống");
        }
        if (sessionDto.getSubjectId() == null || sessionDto.getSubjectId().isEmpty()) {
            throw new IllegalArgumentException("Mã môn học không được để trống");
        }
        if (sessionDto.getRoomId() == null || sessionDto.getRoomId().isEmpty()) {
            throw new IllegalArgumentException("Mã phòng không được để trống");
        }
        if (sessionDto.getThu() == null || sessionDto.getThu().isEmpty()) {
            throw new IllegalArgumentException("Thứ học không được để trống");
        }
        if (sessionDto.getStartPeriod() == null || sessionDto.getEndPeriod() == null) {
            throw new IllegalArgumentException("Tiết học không được để trống");
        }
        if (sessionDto.getStartPeriod() > sessionDto.getEndPeriod()) {
            throw new IllegalArgumentException("Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc");
        }
        if (sessionDto.getGvId() == null || sessionDto.getGvId().isEmpty()) {
            throw new IllegalArgumentException("Mã giảng viên không được để trống");
        }

        // Find existing session
        BuoiHoc existingSession = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy buổi học với mã " + sessionId));

        // Check for room scheduling conflicts
        checkRoomAvailability(sessionDto.getRoomId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), sessionId);

        // Check for instructor scheduling conflicts
        checkInstructorAvailability(sessionDto.getGvId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), sessionId);

        // Kiểm tra xem môn học đã có buổi học trùng tiết trong cùng thứ chưa
        checkSubjectAvailability(sessionDto.getSubjectId(), sessionDto.getThu(),
                sessionDto.getStartPeriod(), sessionDto.getEndPeriod(), sessionId);

        // Update session
        MonHoc monHoc = subjectRepository.findById(sessionDto.getSubjectId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy môn học"));
        existingSession.setMonHoc(monHoc);

        Phong phong = roomRepository.findById(sessionDto.getRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phòng"));
        existingSession.setPhong(phong);

        existingSession.setThu(sessionDto.getThu());
        existingSession.setTietBatDau(sessionDto.getStartPeriod());
        existingSession.setTietKetThuc(sessionDto.getEndPeriod());
        existingSession.setGvId(sessionDto.getGvId());

        BuoiHoc updatedSession = sessionRepository.save(existingSession);
        return convertToSessionDto(updatedSession);
    }

    @Transactional
    public void deleteSession(Integer sessionId) {
        if (!sessionRepository.existsById(sessionId)) {
            throw new EntityNotFoundException("Không tìm thấy buổi học");
        }
        sessionRepository.deleteById(sessionId);
    }

    // Helper methods
    private UserInfoDto convertToUserInfoDto(NguoiDung nguoiDung) {
        UserInfoDto dto = new UserInfoDto();
        dto.setUserId(nguoiDung.getMaNguoiDung());
        dto.setFullName(nguoiDung.getTenNguoiDung());
        dto.setEmail(nguoiDung.getEmail());
        dto.setPhone(nguoiDung.getSdt());

        if (nguoiDung.getLopSinhVien() != null) {
            dto.setClassId(nguoiDung.getLopSinhVien().getMaLop());
            dto.setClassName(nguoiDung.getLopSinhVien().getTenLop());
        }

        if (nguoiDung.getTaiKhoan() != null) {
            dto.setRole(nguoiDung.getTaiKhoan().getRole());
            dto.setUsername(nguoiDung.getTaiKhoan().getTenTaiKhoan());
        }

        return dto;
    }

    // Helper methods need to be updated too
    private SessionDto convertToSessionDto(BuoiHoc buoiHoc) {
        SessionDto dto = new SessionDto();
        dto.setSessionId(buoiHoc.getMaBuoiHoc());

        if (buoiHoc.getMonHoc() != null) {
            dto.setSubjectId(buoiHoc.getMonHoc().getMaMonHoc());
            dto.setSubjectName(buoiHoc.getMonHoc().getTenMonHoc());
        }

        if (buoiHoc.getPhong() != null) {
            dto.setRoomId(buoiHoc.getPhong().getMaPhong());
            dto.setRoomName(buoiHoc.getPhong().getTenPhong());
        }

        dto.setThu(buoiHoc.getThu());
        dto.setStartPeriod(buoiHoc.getTietBatDau());
        dto.setEndPeriod(buoiHoc.getTietKetThuc());
        dto.setMaThamGia(buoiHoc.getMaThamGia());
        dto.setGvId(buoiHoc.getGvId());
        dto.setNgayBatDau(buoiHoc.getNgayBatDau());
        dto.setNgayKetThuc(buoiHoc.getNgayKetThuc());
        dto.setSoBuoi(buoiHoc.getSoBuoi());

        // Calculate attendance statistics
        if (buoiHoc.getDiemDanhs() != null && !buoiHoc.getDiemDanhs().isEmpty()) {
            int present = 0, absent = 0, late = 0;

            // Your attendance statistics calculation logic goes here

            dto.setTotalStudents(buoiHoc.getDiemDanhs().size());
            dto.setPresentCount(present);
            dto.setAbsentCount(absent);
            dto.setLateCount(late);
        }

        return dto;
    }
    @Transactional
    public List<SessionDto> getAllSessions(String gvId){
        List<BuoiHoc> sessions = sessionRepository.findByGvId(gvId);
        List<SessionDto> sessionDtos = new ArrayList<>();
        for (BuoiHoc s : sessions){
            SessionDto t = new SessionDto();
            t.setSessionId(s.getMaBuoiHoc());
            t.setThu(s.getThu());
            t.setEndPeriod(s.getTietKetThuc());
            t.setGvId(s.getGvId());
            t.setMaThamGia(s.getMaThamGia());
            t.setRoomId(s.getPhong().getMaPhong());
            t.setRoomName(s.getPhong().getTenPhong());
            t.setStartPeriod(s.getTietBatDau());
            t.setSubjectId((s.getMonHoc().getMaMonHoc()));
            t.setSubjectName(s.getMonHoc().getTenMonHoc());
            sessionDtos.add(t);
        }
        return sessionDtos;
    }
    public SessionDto getById(Integer id){
        Optional<BuoiHoc> buoiHoc = sessionRepository.findById(id);
        if(buoiHoc.isPresent()){
            BuoiHoc s = buoiHoc.get();
            SessionDto t = new SessionDto();
            t.setSessionId(s.getMaBuoiHoc());
            t.setThu(s.getThu());
            t.setEndPeriod(s.getTietKetThuc());
            t.setGvId(s.getGvId());
            t.setMaThamGia(s.getMaThamGia());
            t.setRoomId(s.getPhong().getMaPhong());
            t.setRoomName(s.getPhong().getTenPhong());
            t.setStartPeriod(s.getTietBatDau());
            t.setSubjectId((s.getMonHoc().getMaMonHoc()));
            t.setSubjectName(s.getMonHoc().getTenMonHoc());
            return t;
        }
        return null;
    }
    public List<SessionDto> getSSByUser(String id){
        List<BuoiHoc> ds = sessionRepository.findAllBuoiHocByNguoiDungId(id);
        List<SessionDto> sessionDtos = new ArrayList<>();
        for (BuoiHoc s : ds){
            SessionDto t = new SessionDto();
            t.setSessionId(s.getMaBuoiHoc());
            t.setThu(s.getThu());
            t.setEndPeriod(s.getTietKetThuc());
            t.setGvId(s.getGvId());
            t.setMaThamGia(s.getMaThamGia());
            t.setRoomId(s.getPhong().getMaPhong());
            t.setRoomName(s.getPhong().getTenPhong());
            t.setStartPeriod(s.getTietBatDau());
            t.setSubjectId((s.getMonHoc().getMaMonHoc()));
            t.setSubjectName(s.getMonHoc().getTenMonHoc());
            sessionDtos.add(t);
        }
        return sessionDtos;
    }
    public List<UserInfoDto> getStudentBySS(Integer id){

        List<NguoiDung> ds = userRepository.findNguoiDungByBuoiHocId(id);
        List<UserInfoDto> ds2 = new ArrayList<>();
        for (NguoiDung n : ds){
            UserInfoDto dt = new UserInfoDto();
            dt.setUserId(n.getMaNguoiDung());
            dt.setPhone(n.getSdt());
            dt.setClassId(n.getLopSinhVien().getMaLop());
            dt.setClassName(n.getLopSinhVien().getTenLop());
            dt.setFullName(n.getTenNguoiDung());
            ds2.add(dt);
        }
        return ds2;
    }
    public LopSinhVien getLopHoc(String id){
        return classRepository.findById(id).get();
    }
    public MonHoc getMonHoc(String id){
        return subjectRepository.findById(id).get();
    }
    public UserInfoDto getUser(String id){
        NguoiDung user = userRepository.findById(id).get();
        UserInfoDto dto = new UserInfoDto();
        dto.setUserId(id);
        dto.setRole(user.getTaiKhoan().getRole());
        dto.setEmail(user.getEmail());
        dto.setUsername(dto.getUsername());
        if(user.getLopSinhVien() != null && user.getLopSinhVien().getMaLop() != null){
            dto.setClassId(user.getLopSinhVien().getMaLop());
            dto.setClassName(user.getLopSinhVien().getTenLop());
        }
        dto.setPhone(user.getSdt());
        dto.setFullName(user.getTenNguoiDung());
        return dto;
    }
    public String delStudent(String userId, Integer sessionId){
        nguoiThamGiaRepository.deleteByUserIdAndSessionId(userId, sessionId);
        return "Đã xóa thành công";
    }


    public String getOTPCode(String email) {
        // 1. Tạo mã OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // mã 6 số

        // 2. Gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + ". Vui lòng không chia sẻ mã này với bất kỳ ai.");

        try {
            mailSender.send(message);
            // 3. (Tùy chọn) Lưu OTP vào DB/Redis gắn với email ở đây
            return otp;
        } catch (Exception e) {
            e.printStackTrace();
            return "Gửi OTP thất bại: " + e.getMessage();
        }
    }
    public String changePassword(ChangePassWordRequest request){
        authRepository.updatePasswordByMaNguoiDung(request.getMaNguoiDung(), passwordEncoder.encode(request.getNewPassword()));
        return "Da doi mat khau thanh cong";
    }

    // Add these methods to AdminService.java

    // Get attendance history for all students
    public List<Map<String, Object>> getAllAttendanceHistory() {
        List<DiemDanhSinhVien> allRecords = diemDanhSinhVienRepository.findAll();
        return convertToAttendanceHistoryResponse(allRecords);
    }

    // Get attendance history for a specific student
    public List<Map<String, Object>> getStudentAttendanceHistory(String studentId) {
        List<DiemDanhSinhVien> studentRecords = diemDanhSinhVienRepository.findByUserMaNguoiDung(studentId);
        return convertToAttendanceHistoryResponse(studentRecords);
    }

    // Get attendance history for a specific subject
    public List<Map<String, Object>> getSubjectAttendanceHistory(String subjectId) {
        List<DiemDanhSinhVien> subjectRecords = diemDanhSinhVienRepository.findByDiemDanhBuoiHocMonHocMaMonHoc(subjectId);
        return convertToAttendanceHistoryResponse(subjectRecords);
    }

    // Get attendance history for a specific teacher
    public List<Map<String, Object>> getTeacherAttendanceHistory(String teacherId) {
        List<DiemDanhSinhVien> teacherRecords = diemDanhSinhVienRepository.findByDiemDanhBuoiHocGvId(teacherId);
        return convertToAttendanceHistoryResponse(teacherRecords);
    }

    // Get attendance history for a specific room
    public List<Map<String, Object>> getRoomAttendanceHistory(String roomId) {
        List<DiemDanhSinhVien> roomRecords = diemDanhSinhVienRepository.findByDiemDanhBuoiHocPhongMaPhong(roomId);
        return convertToAttendanceHistoryResponse(roomRecords);
    }

    // Get attendance history for a specific student and subject
    public List<Map<String, Object>> getStudentSubjectAttendanceHistory(String studentId, String subjectId) {
        List<DiemDanhSinhVien> records = diemDanhSinhVienRepository
                .findByUserMaNguoiDungAndDiemDanhBuoiHocMonHocMaMonHoc(studentId, subjectId);
        return convertToAttendanceHistoryResponse(records);
    }

    // Helper method to convert DiemDanhSinhVien entities to response format
// Helper method to convert DiemDanhSinhVien entities to response format
    private List<Map<String, Object>> convertToAttendanceHistoryResponse(List<DiemDanhSinhVien> records) {
        return records.stream().map(record -> {
            Map<String, Object> result = new HashMap<>();

            // Student information
            result.put("studentId", record.getUser().getMaNguoiDung());
            result.put("studentName", record.getUser().getTenNguoiDung());
            result.put("className", record.getUser().getLopSinhVien() != null ?
                    record.getUser().getLopSinhVien().getTenLop() : null);

            // Session information
            BuoiHoc buoiHoc = record.getDiemDanh().getBuoiHoc();
            result.put("sessionId", buoiHoc.getMaBuoiHoc());
            result.put("subjectId", buoiHoc.getMonHoc().getMaMonHoc());
            result.put("subjectName", buoiHoc.getMonHoc().getTenMonHoc());
            result.put("roomId", buoiHoc.getPhong().getMaPhong());
            result.put("roomName", buoiHoc.getPhong().getTenPhong());
            result.put("thu", buoiHoc.getThu()); // Changed from date to thu
            result.put("startPeriod", buoiHoc.getTietBatDau());
            result.put("endPeriod", buoiHoc.getTietKetThuc());
            result.put("teacherId", buoiHoc.getGvId());

            // Attendance information
            result.put("attendanceTime", record.getTime());
            result.put("status", record.getStatus());
            result.put("attendanceId", record.getId());

            return result;
        }).collect(Collectors.toList());
    }
}