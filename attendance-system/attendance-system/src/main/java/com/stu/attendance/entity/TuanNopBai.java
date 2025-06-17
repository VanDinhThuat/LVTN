package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tuan_nop_bai")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TuanNopBai {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_tuan")
    private Integer maTuan;

    @ManyToOne
    @JoinColumn(name = "ma_nhom", nullable = false)
    private NhomDoAn nhomDoAn;

    @Column(name = "ten_tuan", nullable = false)
    private String tenTuan;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;

    @Column(name = "trang_thai", length = 50)
    private String trangThai = "active"; // active | closed

    @OneToMany(mappedBy = "tuanNopBai", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NopBai> nopBais;
}
