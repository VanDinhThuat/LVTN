package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tham_gia_lop_do_an")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThamGiaLopDoAn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ma_nguoi_dung", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne
    @JoinColumn(name = "ma_lop_do_an", nullable = false)
    private LopDoAn lopDoAn;

    @ManyToOne
    @JoinColumn(name = "ma_nhom")
    private NhomDoAn nhomDoAn;

  
} 