package com.stu.attendance.repository;

import com.stu.attendance.entity.DiemDanh;
import com.stu.attendance.entity.NguoiDung;
import com.stu.attendance.entity.BuoiHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<DiemDanh, Integer> {

    // Find by session
    DiemDanh findByCode(String code);
    @Query("SELECT d FROM DiemDanh d WHERE d.buoiHoc.maBuoiHoc = :maBuoiHoc")
    List<DiemDanh> findByMaBuoiHoc(@Param("maBuoiHoc") Integer maBuoiHoc);

}