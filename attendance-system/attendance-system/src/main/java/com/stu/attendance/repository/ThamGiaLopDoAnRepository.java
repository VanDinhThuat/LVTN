package com.stu.attendance.repository;

import com.stu.attendance.entity.ThamGiaLopDoAn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ThamGiaLopDoAnRepository extends JpaRepository<ThamGiaLopDoAn, Integer> {
    
    @Modifying
    @Transactional
    @Query("DELETE FROM ThamGiaLopDoAn tgl WHERE tgl.nguoiDung.id = :userId AND tgl.lopDoAn.maLopDoAn = :lopDoAnId")
    void deleteByUserIdAndLopDoAnId(@Param("userId") String userId, @Param("lopDoAnId") Integer lopDoAnId);
} 