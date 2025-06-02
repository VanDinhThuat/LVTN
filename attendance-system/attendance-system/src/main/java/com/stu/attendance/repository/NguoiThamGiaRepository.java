package com.stu.attendance.repository;

import com.stu.attendance.entity.NguoiThamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NguoiThamGiaRepository extends JpaRepository<NguoiThamGia, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM NguoiThamGia a WHERE a.nguoiDung.maNguoiDung = :userId AND a.buoiHoc.maBuoiHoc = :sessionId")
    void deleteByUserIdAndSessionId(@Param("userId") String userId, @Param("sessionId") Integer sessionId);

}
