package com.stu.attendance.repository;

import com.stu.attendance.entity.NopBai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NopBaiRepository extends JpaRepository<NopBai, Integer> {

    List<NopBai> findByTuanNopBai_MaTuanOrderByNgayNopDesc(Integer maTuan);

    List<NopBai> findByNguoiDung_MaNguoiDungOrderByNgayNopDesc(String maNguoiDung);

    Optional<NopBai> findByTuanNopBai_MaTuanAndNguoiDung_MaNguoiDung(Integer maTuan, String maNguoiDung);

    @Query("SELECT COUNT(n) FROM NopBai n WHERE n.tuanNopBai.maTuan = :maTuan")
    Long countSubmissionsByWeek(@Param("maTuan") Integer maTuan);

    @Query("SELECT n FROM NopBai n WHERE n.tuanNopBai.buoiHoc.maBuoiHoc = :maBuoiHoc")
    List<NopBai> findByBuoiHoc(@Param("maBuoiHoc") Integer maBuoiHoc);

    boolean existsByTuanNopBai_MaTuanAndNguoiDung_MaNguoiDung(Integer maTuan, String maNguoiDung);
}