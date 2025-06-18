-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 18, 2025 at 04:33 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tttn`
--

-- --------------------------------------------------------

--
-- Table structure for table `buoi_hoc`
--

DROP TABLE IF EXISTS `buoi_hoc`;
CREATE TABLE IF NOT EXISTS `buoi_hoc` (
  `ma_buoi_hoc` int NOT NULL AUTO_INCREMENT,
  `tiet_bat_dau` int NOT NULL,
  `tiet_ket_thuc` int NOT NULL,
  `gv_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ma_mon_hoc` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ma_phong` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ma_tham_gia` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `thu` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'regular' COMMENT 'regular|project',
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `so_buoi` int DEFAULT '1',
  PRIMARY KEY (`ma_buoi_hoc`),
  KEY `FKresnpp25ibokky9xcp7r9nn1e` (`ma_mon_hoc`),
  KEY `FK1xu8i7qikw0dq270q1ejw8n27` (`ma_phong`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buoi_hoc`
--

INSERT INTO `buoi_hoc` (`ma_buoi_hoc`, `tiet_bat_dau`, `tiet_ket_thuc`, `gv_id`, `ma_mon_hoc`, `ma_phong`, `ma_tham_gia`, `thu`, `type`, `ngay_bat_dau`, `ngay_ket_thuc`, `so_buoi`) VALUES
(5, 1, 4, 'GV01', 'KT', 'P01', 'c1c1ba9dd7', 'Thu 4', 'regular', NULL, NULL, 1),
(6, 1, 4, 'GV01', 'KT', 'P01', '330ea2e3e5', 'Thu 3', 'regular', NULL, NULL, 1),
(7, 1, 4, 'GV01', 'KT', 'P01', 'e19627b70d', 'Thu 2', 'regular', '2025-05-27', '2025-06-27', 5),
(9, 5, 8, 'GV01', 'KT', 'P01', 'a6d1fcba2a', 'Thu 5', 'regular', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `diem_danh`
--

DROP TABLE IF EXISTS `diem_danh`;
CREATE TABLE IF NOT EXISTS `diem_danh` (
  `ma_buoi_hoc` int NOT NULL,
  `ma_diem_danh` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expired_at` datetime(6) DEFAULT NULL,
  `thoi_gian_diem_danh` datetime(6) DEFAULT NULL,
  `code` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ma_nguoi_dung` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ma_diem_danh`),
  KEY `FKn39tnia8bkst1qbvkosdx8lew` (`ma_buoi_hoc`),
  KEY `FK56ahhb3iy1e50gim96jbaxyku` (`ma_nguoi_dung`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diem_danh`
--

INSERT INTO `diem_danh` (`ma_buoi_hoc`, `ma_diem_danh`, `created_at`, `expired_at`, `thoi_gian_diem_danh`, `code`, `ma_nguoi_dung`) VALUES
(5, 2, '2025-06-07 01:16:33.423853', '2025-06-07 01:19:33.423853', NULL, '0cc93e', 'GV01'),
(5, 3, '2025-06-17 15:59:30.486236', '2025-06-17 16:02:30.486236', NULL, 'f497eb', 'GV01'),
(9, 4, '2025-06-17 16:00:58.714108', '2025-06-17 16:03:58.714108', NULL, '117375', 'GV01'),
(9, 5, '2025-06-17 16:01:48.259093', '2025-06-17 16:04:48.259093', NULL, '15108f', 'GV01'),
(6, 6, '2025-06-17 16:02:43.020857', '2025-06-17 16:05:43.020857', NULL, 'fd4c9c', 'GV01'),
(5, 7, '2025-06-17 16:04:16.107198', '2025-06-17 16:07:16.107198', NULL, '5a7394', 'GV01'),
(5, 8, '2025-06-17 16:04:56.428099', '2025-06-17 16:07:56.428099', NULL, 'd3922b', 'GV01'),
(5, 9, '2025-06-17 16:05:34.003588', '2025-06-17 16:08:34.003588', NULL, 'a06844', 'GV01');

-- --------------------------------------------------------

--
-- Table structure for table `diem_danh_sinh_vien`
--

DROP TABLE IF EXISTS `diem_danh_sinh_vien`;
CREATE TABLE IF NOT EXISTS `diem_danh_sinh_vien` (
  `diemdanh_id` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `time` datetime(6) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtflyllv7mahy2d1wxf18dncf9` (`diemdanh_id`),
  KEY `FK5expuo5jtc2lkdw7n6wvngej8` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diem_danh_sinh_vien`
--

INSERT INTO `diem_danh_sinh_vien` (`diemdanh_id`, `id`, `time`, `status`, `user_id`) VALUES
(4, 1, '2025-06-17 16:01:10.857498', 'Đúng giờ', 'DH123456');

-- --------------------------------------------------------

--
-- Table structure for table `lop_do_an`
--

DROP TABLE IF EXISTS `lop_do_an`;
CREATE TABLE IF NOT EXISTS `lop_do_an` (
  `ma_lop_do_an` int NOT NULL AUTO_INCREMENT,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `gv_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ma_tham_gia` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_lop_do_an` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `thoi_gian_bat_dau` date DEFAULT NULL,
  `thoi_gian_ket_thuc` date DEFAULT NULL,
  PRIMARY KEY (`ma_lop_do_an`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lop_do_an`
--

INSERT INTO `lop_do_an` (`ma_lop_do_an`, `ghi_chu`, `gv_id`, `ma_tham_gia`, `ten_lop_do_an`, `thoi_gian_bat_dau`, `thoi_gian_ket_thuc`) VALUES
(1, 'Test từ Postman', 'GV001', '550b59c8e1', 'Lớp Đồ Án CNTT Test', '2024-09-01', '2024-12-15'),
(2, 'D21', 'GV01', '3565fe166a', 'Đồ án chuyên ngành', '2026-01-01', '2026-05-05'),
(3, 'D22-code c#', 'GV01', '14669c574b', 'Đồ Án Tin Học', '2025-03-02', '2025-05-04'),
(4, 'D23', 'GV01', '855ee043d8', 'Đồ an androi', '2025-01-01', '2026-01-01');

-- --------------------------------------------------------

--
-- Table structure for table `lop_sinh_vien`
--

DROP TABLE IF EXISTS `lop_sinh_vien`;
CREATE TABLE IF NOT EXISTS `lop_sinh_vien` (
  `ma_lop` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_lop` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ma_lop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lop_sinh_vien`
--

INSERT INTO `lop_sinh_vien` (`ma_lop`, `ten_lop`) VALUES
('D20_TH09', 'Tin hoc 09'),
('D21_TH05', 'D21_TH05'),
('D21_TH06', 'Tin hoc 06'),
('D21_TH07', 'Tin hoc 07'),
('GV', 'Giang Vien');

-- --------------------------------------------------------

--
-- Table structure for table `mon_hoc`
--

DROP TABLE IF EXISTS `mon_hoc`;
CREATE TABLE IF NOT EXISTS `mon_hoc` (
  `ma_mon_hoc` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_mon_hoc` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ma_mon_hoc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mon_hoc`
--

INSERT INTO `mon_hoc` (`ma_mon_hoc`, `ten_mon_hoc`) VALUES
('DA', 'Đồ Án Tin Học'),
('DACN', 'Đồ Án Chuyên Ngành'),
('KT', 'Ky Thuat lap trinh'),
('KTLT', 'KY THUAT LAP TRINH'),
('LTW', 'Lap trinh mang'),
('NMLT', 'Nhap mon lap trinh 1');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ma_lop` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ma_nguoi_dung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ma_tai_khoan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sdt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ten_nguoi_dung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ma_nguoi_dung`),
  UNIQUE KEY `UKmajqh5g4djy2tp3p9dvr64brp` (`email`),
  UNIQUE KEY `UKltruy9naf2a8dw4mteq44xufk` (`ma_tai_khoan`),
  KEY `FK4kfboc7g5ory9apx9nntvvslw` (`ma_lop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`email`, `ma_lop`, `ma_nguoi_dung`, `ma_tai_khoan`, `sdt`, `ten_nguoi_dung`) VALUES
('hao12398700@gmail.com', NULL, 'admin', '151f9bc2-f058-47f1-99b8-1f062ff52fed', '0945652311', 'admin'),
('hai@stu.edu.vn', 'D20_TH09', 'DH00', 'df45007f-f3ec-437f-9abe-78f592387b71', '0127736484', 'Hai'),
('thua@gmail.com', 'D20_TH09', 'DH123456', '2f7f648b-54da-4320-9094-74f980d0db14', '0374958373', 'Van Dinh Thuat'),
('truong@gmail.com', 'D21_TH06', 'DH52108548', 'f7709531-52c6-4a98-997b-575cf0b34e85', '0866783068', 'Nguyen Thanh Truong'),
('dh52108549@student.stu.edu.vn', 'D21_TH05', 'DH52108549', 'baa8ec02-a32a-42c8-b90e-10986224be08', '0226138575', 'DANG THANH HAI'),
('hai123@gmail.com', 'GV', 'GV01', '8aacbf13-69cd-474d-81d1-517a93be1d88', '0346847355', 'Dang Thanh Hai '),
('thuatvan1012@gmail.com', NULL, 'GV02', 'f424da08-24e7-45f3-821f-0de14de64181', '0896361875', 'Hồ Đình Khả'),
('nguyen.lan@example.com', 'D21_TH06', 'ND001', '1234', '0123456789', 'Nguyen Thi Lan'),
('danghai220503@gmail.com', 'D21_TH06', 'ND002', 'TK001', '0123456789', 'Nguyen Thi Lan');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_tham_gia`
--

DROP TABLE IF EXISTS `nguoi_tham_gia`;
CREATE TABLE IF NOT EXISTS `nguoi_tham_gia` (
  `buoihoc_id` int DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nguoidung_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs7m9d0kal9qtv80wssa9lp6gj` (`buoihoc_id`),
  KEY `FKtojp2r3lsbk1ssso6oca99og9` (`nguoidung_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_tham_gia`
--

INSERT INTO `nguoi_tham_gia` (`buoihoc_id`, `id`, `nguoidung_id`) VALUES
(5, 3, 'DH00'),
(6, 7, 'DH00');

-- --------------------------------------------------------

--
-- Table structure for table `nhom_do_an`
--

DROP TABLE IF EXISTS `nhom_do_an`;
CREATE TABLE IF NOT EXISTS `nhom_do_an` (
  `ma_nhom` int NOT NULL AUTO_INCREMENT,
  `ghi_chu` text COLLATE utf8mb4_general_ci,
  `ten_nhom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ma_lop_do_an` int NOT NULL,
  PRIMARY KEY (`ma_nhom`),
  KEY `FKo65pawfxu5m6rj1xotoctp8aw` (`ma_lop_do_an`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhom_do_an`
--

INSERT INTO `nhom_do_an` (`ma_nhom`, `ghi_chu`, `ten_nhom`, `ma_lop_do_an`) VALUES
(1, 'Nhóm làm đồ án về hệ thống quản lý điểm danh', 'Nhóm Phát triển Web', 1),
(2, 'Nhóm làm đồ án về hệ thống quản lý điểm danh', 'Nhóm Phát triển Web', 1),
(4, 'Xây dựng website bán hàng', 'Nhóm 1', 2),
(5, 'làm website quản lí kí túc xá', 'Nhóm 2', 2),
(6, 'web', 'nhóm 1', 4),
(7, 'di động', 'Nhóm 2', 4),
(8, 'xây dụng ưngs  dụng khách sạn', 'nhóm 3', 4);

-- --------------------------------------------------------

--
-- Table structure for table `nop_bai`
--

DROP TABLE IF EXISTS `nop_bai`;
CREATE TABLE IF NOT EXISTS `nop_bai` (
  `ma_nop_bai` int NOT NULL AUTO_INCREMENT,
  `ma_tuan` int NOT NULL,
  `ma_nguoi_dung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_file` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `duong_dan_file` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `kich_thuoc` bigint DEFAULT NULL,
  `loai_file` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ngay_nop` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ghi_chu_gv` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`ma_nop_bai`),
  KEY `fk_nopbai_tuan` (`ma_tuan`),
  KEY `fk_nopbai_nguoidung` (`ma_nguoi_dung`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
CREATE TABLE IF NOT EXISTS `phong` (
  `ma_phong` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_phong` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ma_phong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phong`
--

INSERT INTO `phong` (`ma_phong`, `ten_phong`) VALUES
('P01', 'Phong 1'),
('P02', 'Phong 2'),
('P03', 'Phong 3');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

DROP TABLE IF EXISTS `tai_khoan`;
CREATE TABLE IF NOT EXISTS `tai_khoan` (
  `ma_tai_khoan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mat_khau` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ten_tai_khoan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','student','teacher') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`ma_tai_khoan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`ma_tai_khoan`, `mat_khau`, `ten_tai_khoan`, `role`) VALUES
('1234', '$2a$10$X.lhuj27aTwEUo9kNiokxexwIEjoVzaUkKD.RROLuSHcqDbuy6IHq', 'nguyenvana', 'admin'),
('151f9bc2-f058-47f1-99b8-1f062ff52fed', '$2a$10$nWuNuupCjubBd2VIRxtQ3./pu8XxSo2b26aQGXMVJaogLPTGcxlUu', 'admin', 'admin'),
('2f7f648b-54da-4320-9094-74f980d0db14', '$2a$10$.8sFwByLbOB6mL4C.RJqkOTjsIwevd4R1n2saCS8oluYmBZ5ibhJm', 'DH123456', 'student'),
('8aacbf13-69cd-474d-81d1-517a93be1d88', '$2a$10$dSpK3YmGumEx5rf1Z2CIbuw/9z9AcL87COPjGbWiLSku4jx24qOP.', 'GV01', 'teacher'),
('baa8ec02-a32a-42c8-b90e-10986224be08', '$2a$10$x3QvHvT1Z3vnai9LXZOMQecwWHu8C5r.KAFmy.LMf2R5AuvE8TcZ.', 'DH52108549', 'student'),
('df45007f-f3ec-437f-9abe-78f592387b71', '$2a$10$x4LIXMDUMsQ1mMBSehUFvuJ2Q9BfXefCnGG3..Z3zbR2MurXS5swK', 'DH00', 'student'),
('f424da08-24e7-45f3-821f-0de14de64181', '$2a$10$g/90WgtKjgH/oHtGII7joOhJG4DceOIVjBRaJhZsirI9M2T5csvAa', 'GV02', 'teacher'),
('f7709531-52c6-4a98-997b-575cf0b34e85', '$2a$10$fTBO5nmio7ODNyKeMST15euRlxl1j66Aj4KHw76Z.zGeSlpl5RHEC', 'DH52108548', 'student'),
('TK001', '$2a$10$TU9KfmMOXOZmj2JeCu354.PrAoNo0ZAjEwj7F1mQWRYTD8Tml6EVi', 'dangthanhhai', 'student');

-- --------------------------------------------------------

--
-- Table structure for table `tham_gia_lop_do_an`
--

DROP TABLE IF EXISTS `tham_gia_lop_do_an`;
CREATE TABLE IF NOT EXISTS `tham_gia_lop_do_an` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ma_lop_do_an` int NOT NULL,
  `ma_nguoi_dung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ma_nhom` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhbppfj1is8ppi1696pk8jyvwg` (`ma_nguoi_dung`),
  KEY `FKhkcqf47d980oatx2g3by49k9u` (`ma_lop_do_an`),
  KEY `FKf2st0tkrt8382q81nrrqwansg` (`ma_nhom`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tham_gia_lop_do_an`
--

INSERT INTO `tham_gia_lop_do_an` (`id`, `ma_lop_do_an`, `ma_nguoi_dung`, `ma_nhom`) VALUES
(1, 1, 'DH00', NULL),
(2, 1, 'DH00', NULL),
(3, 2, 'DH123456', NULL),
(4, 1, 'DH123456', NULL),
(5, 3, 'DH123456', NULL),
(6, 2, 'DH00', NULL),
(7, 4, 'DH00', NULL),
(8, 4, 'DH52108548', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tuan_nop_bai`
--

DROP TABLE IF EXISTS `tuan_nop_bai`;
CREATE TABLE IF NOT EXISTS `tuan_nop_bai` (
  `ma_tuan` int NOT NULL AUTO_INCREMENT,
  `ten_tuan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mo_ta` text COLLATE utf8mb4_general_ci,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `trang_thai` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'active' COMMENT 'active|closed',
  `ma_nhom` int NOT NULL,
  PRIMARY KEY (`ma_tuan`),
  KEY `FKltr7r2ejek5l9awdyq5gg26qm` (`ma_nhom`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tuan_nop_bai`
--

INSERT INTO `tuan_nop_bai` (`ma_tuan`, `ten_tuan`, `mo_ta`, `ngay_bat_dau`, `ngay_ket_thuc`, `trang_thai`, `ma_nhom`) VALUES
(8, 'Tuần 3 - Ôn tập 1', NULL, '2025-05-27', '2025-06-03', 'ACTIVE', 2),
(9, 'Tuần 3 - Ôn tập 1', NULL, '2025-05-27', '2025-06-03', 'ACTIVE', 1),
(10, 'Tuần 1', 'Nộp bài đồ án tuần đầu tiên', '2025-06-17', '2025-06-23', 'Đang diễn ra', 2),
(11, 'Tuần 1', 'Nộp bài đồ án tuần đầu tiên', '2025-06-17', '2025-06-23', 'Đang diễn ra', 4),
(12, 'Tuần 1', 'vẽ ERD', '2025-02-02', '2026-03-03', 'active', 7),
(13, 'tuần 1', 'vẽ ERD', '2025-02-02', '2026-03-03', 'ACTIVE', 6),
(14, 'tuần 1', 'demo', '2025-04-04', '2025-05-05', 'ACTIVE', 1),
(15, 'tuần 2', 'demo 22', '2025-06-06', '2025-08-08', 'active', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buoi_hoc`
--
ALTER TABLE `buoi_hoc`
  ADD CONSTRAINT `FK1xu8i7qikw0dq270q1ejw8n27` FOREIGN KEY (`ma_phong`) REFERENCES `phong` (`ma_phong`),
  ADD CONSTRAINT `FKresnpp25ibokky9xcp7r9nn1e` FOREIGN KEY (`ma_mon_hoc`) REFERENCES `mon_hoc` (`ma_mon_hoc`);

--
-- Constraints for table `diem_danh`
--
ALTER TABLE `diem_danh`
  ADD CONSTRAINT `FK56ahhb3iy1e50gim96jbaxyku` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  ADD CONSTRAINT `FKn39tnia8bkst1qbvkosdx8lew` FOREIGN KEY (`ma_buoi_hoc`) REFERENCES `buoi_hoc` (`ma_buoi_hoc`);

--
-- Constraints for table `diem_danh_sinh_vien`
--
ALTER TABLE `diem_danh_sinh_vien`
  ADD CONSTRAINT `FK5expuo5jtc2lkdw7n6wvngej8` FOREIGN KEY (`user_id`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  ADD CONSTRAINT `FKtflyllv7mahy2d1wxf18dncf9` FOREIGN KEY (`diemdanh_id`) REFERENCES `diem_danh` (`ma_diem_danh`);

--
-- Constraints for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD CONSTRAINT `FK4kfboc7g5ory9apx9nntvvslw` FOREIGN KEY (`ma_lop`) REFERENCES `lop_sinh_vien` (`ma_lop`),
  ADD CONSTRAINT `FKbrlqj8q133ly8l99xc05wf6sk` FOREIGN KEY (`ma_tai_khoan`) REFERENCES `tai_khoan` (`ma_tai_khoan`);

--
-- Constraints for table `nguoi_tham_gia`
--
ALTER TABLE `nguoi_tham_gia`
  ADD CONSTRAINT `FKs7m9d0kal9qtv80wssa9lp6gj` FOREIGN KEY (`buoihoc_id`) REFERENCES `buoi_hoc` (`ma_buoi_hoc`),
  ADD CONSTRAINT `FKtojp2r3lsbk1ssso6oca99og9` FOREIGN KEY (`nguoidung_id`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`);

--
-- Constraints for table `nhom_do_an`
--
ALTER TABLE `nhom_do_an`
  ADD CONSTRAINT `FKo65pawfxu5m6rj1xotoctp8aw` FOREIGN KEY (`ma_lop_do_an`) REFERENCES `lop_do_an` (`ma_lop_do_an`);

--
-- Constraints for table `nop_bai`
--
ALTER TABLE `nop_bai`
  ADD CONSTRAINT `fk_nopbai_nguoidung` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  ADD CONSTRAINT `fk_nopbai_tuan` FOREIGN KEY (`ma_tuan`) REFERENCES `tuan_nop_bai` (`ma_tuan`) ON DELETE CASCADE;

--
-- Constraints for table `tham_gia_lop_do_an`
--
ALTER TABLE `tham_gia_lop_do_an`
  ADD CONSTRAINT `FKf2st0tkrt8382q81nrrqwansg` FOREIGN KEY (`ma_nhom`) REFERENCES `nhom_do_an` (`ma_nhom`),
  ADD CONSTRAINT `FKhbppfj1is8ppi1696pk8jyvwg` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  ADD CONSTRAINT `FKhkcqf47d980oatx2g3by49k9u` FOREIGN KEY (`ma_lop_do_an`) REFERENCES `lop_do_an` (`ma_lop_do_an`);

--
-- Constraints for table `tuan_nop_bai`
--
ALTER TABLE `tuan_nop_bai`
  ADD CONSTRAINT `FKltr7r2ejek5l9awdyq5gg26qm` FOREIGN KEY (`ma_nhom`) REFERENCES `nhom_do_an` (`ma_nhom`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
