package com.stu.attendance.repository;

import com.stu.attendance.entity.TuanNopBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TuanNopBaiRepository extends JpaRepository<TuanNopBai, Integer> {

    List<TuanNopBai> findByNhomDoAn_MaNhomOrderByNgayBatDauAsc(Integer maNhom);

    @Query("SELECT t FROM TuanNopBai t WHERE t.nhomDoAn.maNhom = :maNhomDoan AND t.trangThai = 'active'")
    List<TuanNopBai> findActiveWeeksByNhomDoan(@Param("maNhomDoan") Integer maNhomDoan);

    @Query("SELECT t FROM TuanNopBai t WHERE t.trangThai = 'active' AND CURRENT_DATE BETWEEN t.ngayBatDau AND t.ngayKetThuc")
    List<TuanNopBai> findCurrentActiveWeeks();
}