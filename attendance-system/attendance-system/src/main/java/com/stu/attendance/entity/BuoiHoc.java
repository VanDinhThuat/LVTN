//package com.stu.attendance.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Entity
//@Table(name = "buoi_hoc")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class BuoiHoc {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "ma_buoi_hoc")
//    private Integer maBuoiHoc;
//
//    @ManyToOne
//    @JoinColumn(name = "ma_mon_hoc", nullable = false)
//    private MonHoc monHoc;
//
//    @ManyToOne
//    @JoinColumn(name = "ma_phong", nullable = false)
//    private Phong phong;
//
//    @Column(name = "thu", nullable = false)
////    private LocalDate ngayHoc;
//    private String thu;//Thứ 2, 3, 4, 5, 6, 7, CN
//
//    @Column(name = "tiet_bat_dau", nullable = false)
//    private Integer tietBatDau;
//
//    @Column(name = "tiet_ket_thuc", nullable = false)
//    private Integer tietKetThuc;
//
//    @OneToMany(mappedBy = "buoiHoc", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<NguoiThamGia> nguoiThamGias;
//
//    @OneToMany(mappedBy = "buoiHoc", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<DiemDanh> diemDanhs;
//
//    @Column(name = "ma_tham_gia", nullable = false)
//    private String maThamGia;
//    @Column(name = "gv_id")
//    private String gvId;
//}
package com.stu.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "buoi_hoc")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuoiHoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_buoi_hoc")
    private Integer maBuoiHoc;

    @ManyToOne
    @JoinColumn(name = "ma_mon_hoc", nullable = false)
    private MonHoc monHoc;

    @ManyToOne
    @JoinColumn(name = "ma_phong", nullable = false)
    private Phong phong;

    @Column(name = "thu", nullable = false)
    private String thu; // Thứ 2, 3, 4, 5, 6, 7, CN

    @Column(name = "tiet_bat_dau", nullable = false)
    private Integer tietBatDau;

    @Column(name = "tiet_ket_thuc", nullable = false)
    private Integer tietKetThuc;

    @Column(name = "gv_id")
    private String gvId;

    @Column(name = "ma_tham_gia", nullable = false)
    private String maThamGia;

    @Column(name = "type", columnDefinition = "varchar(20) DEFAULT 'regular'")
    @Enumerated(EnumType.STRING)
    private BuoiHocType type = BuoiHocType.regular;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "so_buoi", columnDefinition = "int(11) DEFAULT 1")
    private Integer soBuoi = 1;

    @OneToMany(mappedBy = "buoiHoc", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NguoiThamGia> nguoiThamGias;

    @OneToMany(mappedBy = "buoiHoc", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiemDanh> diemDanhs;

    // Enum for session type
    public enum BuoiHocType {
        regular, project
    }
}