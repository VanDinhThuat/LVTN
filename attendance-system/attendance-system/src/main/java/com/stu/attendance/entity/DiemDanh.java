package com.stu.attendance.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diem_danh")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiemDanh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_diem_danh")
    private Integer maDiemDanh;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ma_buoi_hoc", nullable = false)
    private BuoiHoc buoiHoc;

    @Column(name = "thoi_gian_diem_danh")
    private LocalDateTime thoiGianDiemDanh;

    private String code;
    private LocalDateTime expiredAt;
    @JsonIgnore
    @OneToMany(mappedBy = "diemDanh", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DiemDanhSinhVien> diemDanhSinhVienList;

    private LocalDateTime createdAt;

}