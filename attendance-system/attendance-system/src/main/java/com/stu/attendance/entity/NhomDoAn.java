package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "nhom_do_an")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhomDoAn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nhom")
    private Integer maNhom;

    @Column(name = "ten_nhom", nullable = false)
    private String tenNhom;

    @ManyToOne
    @JoinColumn(name = "ma_lop_do_an", nullable = false)
    private LopDoAn lopDoAn;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @OneToMany(mappedBy = "nhomDoAn", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThamGiaLopDoAn> thamGiaLopDoAns;
} 