-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 06:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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

CREATE TABLE `buoi_hoc` (
  `ma_buoi_hoc` int(11) NOT NULL,
  `tiet_bat_dau` int(11) NOT NULL,
  `tiet_ket_thuc` int(11) NOT NULL,
  `gv_id` varchar(255) DEFAULT NULL,
  `ma_mon_hoc` varchar(255) NOT NULL,
  `ma_phong` varchar(255) NOT NULL,
  `ma_tham_gia` varchar(255) NOT NULL,
  `thu` varchar(255) NOT NULL,
  `type` varchar(20) DEFAULT 'regular' COMMENT 'regular|project',
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `so_buoi` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diem_danh`
--

CREATE TABLE `diem_danh` (
  `ma_buoi_hoc` int(11) NOT NULL,
  `ma_diem_danh` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expired_at` datetime(6) DEFAULT NULL,
  `thoi_gian_diem_danh` datetime(6) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `ma_nguoi_dung` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diem_danh_sinh_vien`
--

CREATE TABLE `diem_danh_sinh_vien` (
  `diemdanh_id` int(11) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `time` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lop_sinh_vien`
--

CREATE TABLE `lop_sinh_vien` (
  `ma_lop` varchar(255) NOT NULL,
  `ten_lop` varchar(255) NOT NULL
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

CREATE TABLE `mon_hoc` (
  `ma_mon_hoc` varchar(255) NOT NULL,
  `ten_mon_hoc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mon_hoc`
--

INSERT INTO `mon_hoc` (`ma_mon_hoc`, `ten_mon_hoc`) VALUES
('KT', 'Ky Thuat lap trinh'),
('KTLT', 'KY THUAT LAP TRINH'),
('LTW', 'Lap trinh mang'),
('NMLT', 'Nhap mon lap trinh 1');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `email` varchar(255) DEFAULT NULL,
  `ma_lop` varchar(255) DEFAULT NULL,
  `ma_nguoi_dung` varchar(255) NOT NULL,
  `ma_tai_khoan` varchar(255) DEFAULT NULL,
  `sdt` varchar(255) DEFAULT NULL,
  `ten_nguoi_dung` varchar(255) NOT NULL
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
('nguyen.lan@example.com', 'D21_TH06', 'ND001', '1234', '0123456789', 'Nguyen Thi Lan'),
('danghai220503@gmail.com', 'D21_TH06', 'ND002', 'TK001', '0123456789', 'Nguyen Thi Lan'),
('danghai22052003@gmail.com', 'GV', 'ND003', 'TK002', '0123456728', 'Nguyen Thi Lann');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_tham_gia`
--

CREATE TABLE `nguoi_tham_gia` (
  `buoihoc_id` int(11) DEFAULT NULL,
  `id` bigint(20) NOT NULL,
  `nguoidung_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nop_bai`
--

CREATE TABLE `nop_bai` (
  `ma_nop_bai` int(11) NOT NULL,
  `ma_tuan` int(11) NOT NULL,
  `ma_nguoi_dung` varchar(255) NOT NULL,
  `ten_file` varchar(255) NOT NULL,
  `duong_dan_file` varchar(255) NOT NULL,
  `kich_thuoc` bigint(20) DEFAULT NULL,
  `loai_file` varchar(100) DEFAULT NULL,
  `ngay_nop` datetime NOT NULL DEFAULT current_timestamp(),
  `ghi_chu_gv` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phong`
--

CREATE TABLE `phong` (
  `ma_phong` varchar(255) NOT NULL,
  `ten_phong` varchar(255) NOT NULL
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

CREATE TABLE `tai_khoan` (
  `ma_tai_khoan` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `ten_tai_khoan` varchar(255) NOT NULL,
  `role` enum('admin','student','teacher') NOT NULL
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
('f7709531-52c6-4a98-997b-575cf0b34e85', '$2a$10$fTBO5nmio7ODNyKeMST15euRlxl1j66Aj4KHw76Z.zGeSlpl5RHEC', 'DH52108548', 'student'),
('TK001', '$2a$10$TU9KfmMOXOZmj2JeCu354.PrAoNo0ZAjEwj7F1mQWRYTD8Tml6EVi', 'dangthanhhai', 'student'),
('TK002', '$2a$10$wWL5JhA9AnvFcHewuAiyI.lE2geP6yUQ0sMg82kX/GE2jlsB4OI0G', 'hai', 'teacher');

-- --------------------------------------------------------

--
-- Table structure for table `tuan_nop_bai`
--

CREATE TABLE `tuan_nop_bai` (
  `ma_tuan` int(11) NOT NULL,
  `ma_buoi_hoc` int(11) NOT NULL,
  `ten_tuan` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `trang_thai` varchar(50) DEFAULT 'active' COMMENT 'active|closed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buoi_hoc`
--
ALTER TABLE `buoi_hoc`
  ADD PRIMARY KEY (`ma_buoi_hoc`),
  ADD KEY `FKresnpp25ibokky9xcp7r9nn1e` (`ma_mon_hoc`),
  ADD KEY `FK1xu8i7qikw0dq270q1ejw8n27` (`ma_phong`);

--
-- Indexes for table `diem_danh`
--
ALTER TABLE `diem_danh`
  ADD PRIMARY KEY (`ma_diem_danh`),
  ADD KEY `FKn39tnia8bkst1qbvkosdx8lew` (`ma_buoi_hoc`),
  ADD KEY `FK56ahhb3iy1e50gim96jbaxyku` (`ma_nguoi_dung`);

--
-- Indexes for table `diem_danh_sinh_vien`
--
ALTER TABLE `diem_danh_sinh_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKtflyllv7mahy2d1wxf18dncf9` (`diemdanh_id`),
  ADD KEY `FK5expuo5jtc2lkdw7n6wvngej8` (`user_id`);

--
-- Indexes for table `lop_sinh_vien`
--
ALTER TABLE `lop_sinh_vien`
  ADD PRIMARY KEY (`ma_lop`);

--
-- Indexes for table `mon_hoc`
--
ALTER TABLE `mon_hoc`
  ADD PRIMARY KEY (`ma_mon_hoc`);

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`ma_nguoi_dung`),
  ADD UNIQUE KEY `UKmajqh5g4djy2tp3p9dvr64brp` (`email`),
  ADD UNIQUE KEY `UKltruy9naf2a8dw4mteq44xufk` (`ma_tai_khoan`),
  ADD KEY `FK4kfboc7g5ory9apx9nntvvslw` (`ma_lop`);

--
-- Indexes for table `nguoi_tham_gia`
--
ALTER TABLE `nguoi_tham_gia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKs7m9d0kal9qtv80wssa9lp6gj` (`buoihoc_id`),
  ADD KEY `FKtojp2r3lsbk1ssso6oca99og9` (`nguoidung_id`);

--
-- Indexes for table `nop_bai`
--
ALTER TABLE `nop_bai`
  ADD PRIMARY KEY (`ma_nop_bai`),
  ADD KEY `fk_nopbai_tuan` (`ma_tuan`),
  ADD KEY `fk_nopbai_nguoidung` (`ma_nguoi_dung`);

--
-- Indexes for table `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`ma_phong`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`ma_tai_khoan`);

--
-- Indexes for table `tuan_nop_bai`
--
ALTER TABLE `tuan_nop_bai`
  ADD PRIMARY KEY (`ma_tuan`),
  ADD KEY `fk_tuan_buoihoc` (`ma_buoi_hoc`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buoi_hoc`
--
ALTER TABLE `buoi_hoc`
  MODIFY `ma_buoi_hoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `diem_danh`
--
ALTER TABLE `diem_danh`
  MODIFY `ma_diem_danh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `diem_danh_sinh_vien`
--
ALTER TABLE `diem_danh_sinh_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nguoi_tham_gia`
--
ALTER TABLE `nguoi_tham_gia`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nop_bai`
--
ALTER TABLE `nop_bai`
  MODIFY `ma_nop_bai` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tuan_nop_bai`
--
ALTER TABLE `tuan_nop_bai`
  MODIFY `ma_tuan` int(11) NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `nop_bai`
--
ALTER TABLE `nop_bai`
  ADD CONSTRAINT `fk_nopbai_nguoidung` FOREIGN KEY (`ma_nguoi_dung`) REFERENCES `nguoi_dung` (`ma_nguoi_dung`),
  ADD CONSTRAINT `fk_nopbai_tuan` FOREIGN KEY (`ma_tuan`) REFERENCES `tuan_nop_bai` (`ma_tuan`) ON DELETE CASCADE;

--
-- Constraints for table `tuan_nop_bai`
--
ALTER TABLE `tuan_nop_bai`
  ADD CONSTRAINT `fk_tuan_buoihoc` FOREIGN KEY (`ma_buoi_hoc`) REFERENCES `buoi_hoc` (`ma_buoi_hoc`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
