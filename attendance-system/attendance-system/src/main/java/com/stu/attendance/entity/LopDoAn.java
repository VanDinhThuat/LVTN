package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "lop_do_an")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LopDoAn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_lop_do_an")
    private Integer maLopDoAn;

    @Column(name = "ten_lop_do_an", nullable = false)
    private String tenLopDoAn;


    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "gv_id")
    private String gvId;

    @Column(name = "ma_tham_gia", nullable = false)
    private String maThamGia;

    @Column(name = "thoi_gian_bat_dau")
    private LocalDate thoiGianBatDau;

    @Column(name = "thoi_gian_ket_thuc")
    private LocalDate thoiGianKetThuc;

    @OneToMany(mappedBy = "lopDoAn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NhomDoAn> nhomDoAns;

    @OneToMany(mappedBy = "lopDoAn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThamGiaLopDoAn> thamGiaLopDoAns;
} 