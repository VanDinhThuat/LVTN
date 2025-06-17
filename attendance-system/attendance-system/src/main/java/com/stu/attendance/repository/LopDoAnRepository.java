package com.stu.attendance.repository;

import com.stu.attendance.entity.LopDoAn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LopDoAnRepository extends JpaRepository<LopDoAn, Integer> {
    
    @Query("SELECT l FROM LopDoAn l WHERE " +
            "(:tenLopDoAn IS NULL OR l.tenLopDoAn LIKE %:tenLopDoAn%) AND " +
            "(:gvId IS NULL OR l.gvId = :gvId)")
    List<LopDoAn> findAllLopDoAn(
            @Param("tenLopDoAn") String tenLopDoAn,
            @Param("gvId") String gvId);

    @Query("SELECT l FROM LopDoAn l LEFT JOIN FETCH l.thamGiaLopDoAns WHERE l.gvId = :gvId")
    List<LopDoAn> findAllLopDoAnByTeacher(@Param("gvId") String gvId);

    List<LopDoAn> findByGvId(String gvId);

    LopDoAn findByMaThamGia(String maThamGia);

    @Query("SELECT tgl.lopDoAn FROM ThamGiaLopDoAn tgl WHERE tgl.nguoiDung.id = :nguoiDungId")
    List<LopDoAn> findAllLopDoAnByNguoiDungId(@Param("nguoiDungId") String nguoiDungId);

    // Methods for checking time conflicts
    @Query("SELECT l FROM LopDoAn l WHERE " +
            "l.thoiGianBatDau <= :thoiGianKetThuc AND " +
            "l.thoiGianKetThuc >= :thoiGianBatDau AND " +
            "l.gvId = :gvId")
    List<LopDoAn> findTimeConflictsForTeacher(
            @Param("thoiGianBatDau") LocalDateTime thoiGianBatDau,
            @Param("thoiGianKetThuc") LocalDateTime thoiGianKetThuc,
            @Param("gvId") String gvId);

    @Query("SELECT l FROM LopDoAn l WHERE " +
            "l.thoiGianBatDau <= :thoiGianKetThuc AND " +
            "l.thoiGianKetThuc >= :thoiGianBatDau AND " +
            "l.gvId = :gvId AND " +
            "l.maLopDoAn != :maLopDoAn")
    List<LopDoAn> findTimeConflictsForTeacherExcluding(
            @Param("thoiGianBatDau") LocalDateTime thoiGianBatDau,
            @Param("thoiGianKetThuc") LocalDateTime thoiGianKetThuc,
            @Param("gvId") String gvId,
            @Param("maLopDoAn") Integer maLopDoAn);

    boolean existsByMaLopDoAn(Integer maLopDoAn);



}