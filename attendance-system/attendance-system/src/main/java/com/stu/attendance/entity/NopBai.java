package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "nop_bai")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NopBai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nop_bai")
    private Integer maNopBai;

    @ManyToOne
    @JoinColumn(name = "ma_tuan", nullable = false)
    private TuanNopBai tuanNopBai;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "ten_file", nullable = false)
    private String tenFile;

    @Column(name = "duong_dan_file", nullable = false)
    private String duongDanFile;

    @Column(name = "kich_thuoc")
    private Long kichThuoc;

    @Column(name = "loai_file", length = 100)
    private String loaiFile;

    @Column(name = "ngay_nop", nullable = false)
    private LocalDateTime ngayNop = LocalDateTime.now();

    @Column(name = "ghi_chu_gv", columnDefinition = "TEXT")
    private String ghiChuGv;
}
