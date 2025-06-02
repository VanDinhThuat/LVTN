package com.stu.attendance.repository;

import com.stu.attendance.entity.BuoiHoc;
import com.stu.attendance.entity.DiemDanh;
import com.stu.attendance.entity.LopSinhVien;
import com.stu.attendance.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TeacherRepository extends JpaRepository<BuoiHoc, Integer> {
    // Get students by class
    @Query("SELECT n FROM NguoiDung n WHERE n.lopSinhVien.maLop = :classId AND n.taiKhoan.role = 'student'")
    List<NguoiDung> findStudentsByClass(@Param("classId") String classId);
}