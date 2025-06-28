-- SQL Server Database Script for Attendance Management System
-- Database: tttn

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'tttn')
BEGIN
    CREATE DATABASE tttn;
END
GO

USE tttn;
GO

-- Create Tables

-- Table: lop_sinh_vien (Student Classes)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='lop_sinh_vien' AND xtype='U')
CREATE TABLE lop_sinh_vien (
    ma_lop NVARCHAR(255) PRIMARY KEY,
    ten_lop NVARCHAR(255) NOT NULL
);
GO

-- Table: tai_khoan (Accounts)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tai_khoan' AND xtype='U')
CREATE TABLE tai_khoan (
    ma_tai_khoan NVARCHAR(255) PRIMARY KEY,
    mat_khau NVARCHAR(255) NOT NULL,
    ten_tai_khoan NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL CHECK (role IN ('admin', 'student', 'teacher'))
);
GO

-- Table: nguoi_dung (Users)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='nguoi_dung' AND xtype='U')
CREATE TABLE nguoi_dung (
    ma_nguoi_dung NVARCHAR(255) PRIMARY KEY,
    ten_nguoi_dung NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE,
    sdt NVARCHAR(255),
    ma_lop NVARCHAR(255),
    ma_tai_khoan NVARCHAR(255) UNIQUE,
    FOREIGN KEY (ma_lop) REFERENCES lop_sinh_vien(ma_lop),
    FOREIGN KEY (ma_tai_khoan) REFERENCES tai_khoan(ma_tai_khoan)
);
GO

-- Table: mon_hoc (Subjects)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='mon_hoc' AND xtype='U')
CREATE TABLE mon_hoc (
    ma_mon_hoc NVARCHAR(255) PRIMARY KEY,
    ten_mon_hoc NVARCHAR(255) NOT NULL
);
GO

-- Table: phong (Rooms)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='phong' AND xtype='U')
CREATE TABLE phong (
    ma_phong NVARCHAR(255) PRIMARY KEY,
    ten_phong NVARCHAR(255) NOT NULL
);
GO

-- Table: buoi_hoc (Sessions)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='buoi_hoc' AND xtype='U')
CREATE TABLE buoi_hoc (
    ma_buoi_hoc INT IDENTITY(1,1) PRIMARY KEY,
    tiet_bat_dau INT NOT NULL,
    tiet_ket_thuc INT NOT NULL,
    gv_id NVARCHAR(255),
    ma_mon_hoc NVARCHAR(255) NOT NULL,
    ma_phong NVARCHAR(255) NOT NULL,
    ma_tham_gia NVARCHAR(255) NOT NULL,
    thu NVARCHAR(255) NOT NULL,
    type NVARCHAR(20) DEFAULT 'regular',
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    so_buoi INT DEFAULT 1,
    FOREIGN KEY (ma_mon_hoc) REFERENCES mon_hoc(ma_mon_hoc),
    FOREIGN KEY (ma_phong) REFERENCES phong(ma_phong)
);
GO

-- Table: diem_danh (Attendance)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='diem_danh' AND xtype='U')
CREATE TABLE diem_danh (
    ma_diem_danh INT IDENTITY(1,1) PRIMARY KEY,
    ma_buoi_hoc INT NOT NULL,
    created_at DATETIME2(6),
    expired_at DATETIME2(6),
    thoi_gian_diem_danh DATETIME2(6),
    code NVARCHAR(255),
    ma_nguoi_dung NVARCHAR(255),
    FOREIGN KEY (ma_buoi_hoc) REFERENCES buoi_hoc(ma_buoi_hoc),
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
);
GO

-- Table: diem_danh_sinh_vien (Student Attendance)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='diem_danh_sinh_vien' AND xtype='U')
CREATE TABLE diem_danh_sinh_vien (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    diemdanh_id INT,
    user_id NVARCHAR(255),
    time DATETIME2(6),
    status NVARCHAR(255),
    FOREIGN KEY (diemdanh_id) REFERENCES diem_danh(ma_diem_danh),
    FOREIGN KEY (user_id) REFERENCES nguoi_dung(ma_nguoi_dung)
);
GO

-- Table: nguoi_tham_gia (Participants)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='nguoi_tham_gia' AND xtype='U')
CREATE TABLE nguoi_tham_gia (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    buoihoc_id INT,
    nguoidung_id NVARCHAR(255),
    FOREIGN KEY (buoihoc_id) REFERENCES buoi_hoc(ma_buoi_hoc),
    FOREIGN KEY (nguoidung_id) REFERENCES nguoi_dung(ma_nguoi_dung)
);
GO

-- Table: lop_do_an (Project Classes)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='lop_do_an' AND xtype='U')
CREATE TABLE lop_do_an (
    ma_lop_do_an INT IDENTITY(1,1) PRIMARY KEY,
    ten_lop_do_an NVARCHAR(255) NOT NULL,
    ghi_chu NTEXT,
    gv_id NVARCHAR(255),
    ma_tham_gia NVARCHAR(255) NOT NULL,
    thoi_gian_bat_dau DATE,
    thoi_gian_ket_thuc DATE
);
GO

-- Table: nhom_do_an (Project Groups)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='nhom_do_an' AND xtype='U')
CREATE TABLE nhom_do_an (
    ma_nhom INT IDENTITY(1,1) PRIMARY KEY,
    ten_nhom NVARCHAR(255) NOT NULL,
    ghi_chu NTEXT,
    ma_lop_do_an INT NOT NULL,
    FOREIGN KEY (ma_lop_do_an) REFERENCES lop_do_an(ma_lop_do_an)
);
GO

-- Table: tham_gia_lop_do_an (Project Class Participation)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tham_gia_lop_do_an' AND xtype='U')
CREATE TABLE tham_gia_lop_do_an (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ma_lop_do_an INT NOT NULL,
    ma_nguoi_dung NVARCHAR(255) NOT NULL,
    ma_nhom INT,
    FOREIGN KEY (ma_lop_do_an) REFERENCES lop_do_an(ma_lop_do_an),
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung),
    FOREIGN KEY (ma_nhom) REFERENCES nhom_do_an(ma_nhom)
);
GO

-- Table: tuan_nop_bai (Submission Weeks)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tuan_nop_bai' AND xtype='U')
CREATE TABLE tuan_nop_bai (
    ma_tuan INT IDENTITY(1,1) PRIMARY KEY,
    ten_tuan NVARCHAR(255) NOT NULL,
    mo_ta NTEXT,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    trang_thai NVARCHAR(50) DEFAULT 'active',
    ma_nhom INT NOT NULL,
    FOREIGN KEY (ma_nhom) REFERENCES nhom_do_an(ma_nhom)
);
GO

-- Table: nop_bai (Submissions)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='nop_bai' AND xtype='U')
CREATE TABLE nop_bai (
    ma_nop_bai INT IDENTITY(1,1) PRIMARY KEY,
    ma_tuan INT NOT NULL,
    ma_nguoi_dung NVARCHAR(255) NOT NULL,
    ten_file NVARCHAR(255) NOT NULL,
    duong_dan_file NVARCHAR(255) NOT NULL,
    kich_thuoc BIGINT,
    loai_file NVARCHAR(100),
    ngay_nop DATETIME2 DEFAULT GETDATE(),
    ghi_chu_gv NTEXT,
    FOREIGN KEY (ma_tuan) REFERENCES tuan_nop_bai(ma_tuan) ON DELETE CASCADE,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung)
);
GO

-- Insert Sample Data

-- Insert lop_sinh_vien
INSERT INTO lop_sinh_vien (ma_lop, ten_lop) VALUES
('D20_TH09', N'Tin học 09'),
('D21_TH05', N'D21_TH05'),
('D21_TH06', N'Tin học 06'),
('D21_TH07', N'Tin học 07'),
('GV', N'Giảng Viên');
GO

-- Insert tai_khoan
INSERT INTO tai_khoan (ma_tai_khoan, mat_khau, ten_tai_khoan, role) VALUES
('admin', '$2a$10$nWuNuupCjubBd2VIRxtQ3./pu8XxSo2b26aQGXMVJaogLPTGcxlUu', 'admin', 'admin'),
('GV01', '$2a$10$dSpK3YmGumEx5rf1Z2CIbuw/9z9AcL87COPjGbWiLSku4jx24qOP.', 'GV01', 'teacher'),
('GV02', '$2a$10$g/90WgtKjgH/oHtGII7joOhJG4DceOIVjBRaJhZsirI9M2T5csvAa', 'GV02', 'teacher'),
('DH00', '$2a$10$x4LIXMDUMsQ1mMBSehUFvuJ2Q9BfXefCnGG3..Z3zbR2MurXS5swK', 'DH00', 'student'),
('DH123456', '$2a$10$.8sFwByLbOB6mL4C.RJqkOTjsIwevd4R1n2saCS8oluYmBZ5ibhJm', 'DH123456', 'student'),
('DH52100514', '$2a$10$SGW079cQBrhW6qIAykO4u.R4UTt.OmxRSac2NSNi.2vNJtSVGMYaC', 'DH52100514', 'student'),
('DH52100604', '$2a$10$fASK4haWsql/EmtdJGsBsuQJzVZSC3p.48cZUJoVBkpTfAktVt0m2', 'DH52100604', 'student'),
('DH52100999', '$2a$10$OJ0ZazSaHelBDuc3XSGYnOsO90V.QzFRYF8gMzJIEz8nfLqlNPDpK', 'DH52100999', 'student'),
('DH52101584', '$2a$10$iFcZWWLIAo8cTkxUcA73PeMy.87WaMn8YN38y5OzZyDdBmBuZChOW', 'DH52101584', 'student'),
('DH52101650', '$2a$10$Rt7i8P3cJLKyY3F.W764veGeI0IpyO544gzh2SBbnvypGJuiaR1pu', 'DH52101650', 'student');
GO

-- Insert nguoi_dung
INSERT INTO nguoi_dung (ma_nguoi_dung, ten_nguoi_dung, email, sdt, ma_lop, ma_tai_khoan) VALUES
('admin', 'admin', 'hao12398700@gmail.com', '0945652311', NULL, 'admin'),
('GV01', N'Đặng Thanh Hải', 'hai123@gmail.com', '0346847355', 'GV', 'GV01'),
('GV02', N'Hồ Đình Khả', 'thuatvan1012@gmail.com', '0896361875', NULL, 'GV02'),
('DH00', 'Hai', 'hai@stu.edu.vn', '0127736484', 'D20_TH09', 'DH00'),
('DH123456', N'Văn Đình Thuật', 'thua@gmail.com', '0374958373', 'D20_TH09', 'DH123456'),
('DH52100514', N'Trần Quốc Nam', 'DH52100514@student.stu.edu.vn', '09127280008', 'D21_TH06', 'DH52100514'),
('DH52100604', N'Phạm Quốc Thái', 'DH52100604@student.stu.edu.vn', '09587436293', 'D21_TH06', 'DH52100604'),
('DH52100999', N'Phạm Mạnh Tuấn', 'DH52100999@student.stu.edu.vn', '09991300043', 'D21_TH06', 'DH52100999'),
('DH52101584', N'Nguyễn Thị Anh Thư', 'DH52101584@student.stu.edu.vn', '09784373244', 'D21_TH06', 'DH52101584'),
('DH52101650', N'Châu Quang Nhật', 'DH52101650@student.stu.edu.vn', '09576243485', 'D21_TH06', 'DH52101650');
GO

-- Insert mon_hoc
INSERT INTO mon_hoc (ma_mon_hoc, ten_mon_hoc) VALUES
('DACN', N'Đồ Án Chuyên Ngành'),
('KT', N'Kỹ Thuật Lập Trình'),
('KTLT', N'KỸ THUẬT LẬP TRÌNH'),
('LTW', N'Lập Trình Web'),
('NMLT', N'Nhập Môn Lập Trình 1');
GO

-- Insert phong
INSERT INTO phong (ma_phong, ten_phong) VALUES
('P01', N'Phòng 1'),
('P02', N'Phòng 2'),
('P03', N'Phòng 3');
GO

-- Insert buoi_hoc
INSERT INTO buoi_hoc (tiet_bat_dau, tiet_ket_thuc, gv_id, ma_mon_hoc, ma_phong, ma_tham_gia, thu, type, ngay_bat_dau, ngay_ket_thuc, so_buoi) VALUES
(1, 4, 'GV01', 'KT', 'P01', 'c1c1ba9dd7', N'Thứ 4', 'regular', NULL, NULL, 1),
(1, 4, 'GV01', 'KT', 'P01', '330ea2e3e5', N'Thứ 3', 'regular', NULL, NULL, 1),
(1, 4, 'GV01', 'KT', 'P01', 'e19627b70d', N'Thứ 2', 'regular', '2025-05-27', '2025-06-27', 5),
(5, 8, 'GV01', 'KT', 'P01', 'a6d1fcba2a', N'Thứ 5', 'regular', NULL, NULL, 1),
(1, 4, 'GV01', 'KT', 'P01', '0ee29533c1', N'Thứ 7', 'regular', NULL, NULL, 1);
GO

-- Insert diem_danh
INSERT INTO diem_danh (ma_buoi_hoc, created_at, expired_at, thoi_gian_diem_danh, code, ma_nguoi_dung) VALUES
(1, '2025-06-07 01:16:33.423853', '2025-06-07 01:19:33.423853', NULL, '0cc93e', 'GV01'),
(1, '2025-06-17 15:59:30.486236', '2025-06-17 16:02:30.486236', NULL, 'f497eb', 'GV01'),
(4, '2025-06-17 16:00:58.714108', '2025-06-17 16:03:58.714108', NULL, '117375', 'GV01'),
(4, '2025-06-17 16:01:48.259093', '2025-06-17 16:04:48.259093', NULL, '15108f', 'GV01'),
(2, '2025-06-17 16:02:43.020857', '2025-06-17 16:05:43.020857', NULL, 'fd4c9c', 'GV01'),
(1, '2025-06-17 16:04:16.107198', '2025-06-17 16:07:16.107198', NULL, '5a7394', 'GV01'),
(1, '2025-06-17 16:04:56.428099', '2025-06-17 16:07:56.428099', NULL, 'd3922b', 'GV01'),
(1, '2025-06-17 16:05:34.003588', '2025-06-17 16:08:34.003588', NULL, 'a06844', 'GV01'),
(5, '2025-06-26 01:32:24.050435', '2025-06-26 01:35:24.050435', NULL, 'baf437', 'GV01');
GO

-- Insert diem_danh_sinh_vien
INSERT INTO diem_danh_sinh_vien (diemdanh_id, time, status, user_id) VALUES
(3, '2025-06-17 16:01:10.857498', N'Đúng giờ', 'DH123456');
GO

-- Insert lop_do_an
INSERT INTO lop_do_an (ghi_chu, gv_id, ma_tham_gia, ten_lop_do_an, thoi_gian_bat_dau, thoi_gian_ket_thuc) VALUES
(N'Test từ Postman', 'GV01', '550b59c8e1', N'Lớp Đồ Án CNTT Test', '2024-09-01', '2024-12-15'),
(N'D21', 'GV01', '3565fe166a', N'Đồ án chuyên ngành', '2026-01-01', '2026-05-05'),
(N'D22-code c#', 'GV01', '14669c574b', N'Đồ Án Tin Học', '2025-03-02', '2025-05-04'),
(N'D23', 'GV01', '855ee043d8', N'Đồ án android', '2025-01-01', '2026-01-01');
GO

-- Insert nhom_do_an
INSERT INTO nhom_do_an (ghi_chu, ten_nhom, ma_lop_do_an) VALUES
(N'Nhóm làm đồ án về hệ thống quản lý điểm danh', N'Nhóm Phát triển Web', 1),
(N'Nhóm làm đồ án về hệ thống quản lý điểm danh', N'Nhóm Phát triển Web', 1),
(N'Xây dựng website bán hàng', N'Nhóm 1', 2),
(N'làm website quản lí kí túc xá', N'Nhóm 2', 2),
(N'web', N'nhóm 1', 4),
(N'di động', N'Nhóm 2', 4),
(N'xây dựng ứng dụng khách sạn', N'nhóm 3', 4);
GO

-- Insert tham_gia_lop_do_an
INSERT INTO tham_gia_lop_do_an (ma_lop_do_an, ma_nguoi_dung, ma_nhom) VALUES
(1, 'DH00', NULL),
(1, 'DH00', NULL),
(2, 'DH123456', NULL),
(1, 'DH123456', NULL),
(3, 'DH123456', NULL),
(2, 'DH00', NULL),
(4, 'DH00', NULL);
GO

-- Insert tuan_nop_bai
INSERT INTO tuan_nop_bai (ten_tuan, mo_ta, ngay_bat_dau, ngay_ket_thuc, trang_thai, ma_nhom) VALUES
(N'Tuần 3 - Ôn tập 1', NULL, '2025-05-27', '2025-06-03', 'ACTIVE', 2),
(N'Tuần 3 - Ôn tập 1', NULL, '2025-05-27', '2025-06-03', 'ACTIVE', 1),
(N'Tuần 1', N'Nộp bài đồ án tuần đầu tiên', '2025-06-17', '2025-06-23', N'Đang diễn ra', 2),
(N'Tuần 1', N'Nộp bài đồ án tuần đầu tiên', '2025-06-17', '2025-06-23', N'Đang diễn ra', 4),
(N'Tuần 1', N'vẽ ERD', '2025-02-02', '2026-03-03', 'active', 7),
(N'tuần 1', N'vẽ ERD', '2025-02-02', '2026-03-03', 'ACTIVE', 6),
(N'tuần 1', N'demo', '2025-04-04', '2025-05-05', 'ACTIVE', 1),
(N'tuần 2', N'demo 22', '2025-06-06', '2025-08-08', 'active', 1);
GO

-- Insert nguoi_tham_gia
INSERT INTO nguoi_tham_gia (buoihoc_id, nguoidung_id) VALUES
(1, 'DH00'),
(2, 'DH00');
GO

-- Sample Queries for Testing

-- 1. Get all students in a class
SELECT n.ma_nguoi_dung, n.ten_nguoi_dung, n.email, l.ten_lop
FROM nguoi_dung n
JOIN lop_sinh_vien l ON n.ma_lop = l.ma_lop
WHERE l.ma_lop = 'D21_TH06';

-- 2. Get attendance records for a session
SELECT dd.ma_diem_danh, dd.code, dd.created_at, dd.expired_at,
       n.ten_nguoi_dung, dds.time, dds.status
FROM diem_danh dd
LEFT JOIN diem_danh_sinh_vien dds ON dd.ma_diem_danh = dds.diemdanh_id
LEFT JOIN nguoi_dung n ON dds.user_id = n.ma_nguoi_dung
WHERE dd.ma_buoi_hoc = 1;

-- 3. Get project groups and their members
SELECT nd.ten_nhom, nd.ghi_chu, n.ten_nguoi_dung, n.email
FROM nhom_do_an nd
LEFT JOIN tham_gia_lop_do_an tgl ON nd.ma_nhom = tgl.ma_nhom
LEFT JOIN nguoi_dung n ON tgl.ma_nguoi_dung = n.ma_nguoi_dung
WHERE nd.ma_lop_do_an = 1;

-- 4. Get teacher's sessions
SELECT bh.ma_buoi_hoc, bh.thu, bh.tiet_bat_dau, bh.tiet_ket_thuc,
       mh.ten_mon_hoc, p.ten_phong
FROM buoi_hoc bh
JOIN mon_hoc mh ON bh.ma_mon_hoc = mh.ma_mon_hoc
JOIN phong p ON bh.ma_phong = p.ma_phong
WHERE bh.gv_id = 'GV01';

-- 5. Get submission weeks for a project group
SELECT tnb.ma_tuan, tnb.ten_tuan, tnb.mo_ta, 
       tnb.ngay_bat_dau, tnb.ngay_ket_thuc, tnb.trang_thai
FROM tuan_nop_bai tnb
WHERE tnb.ma_nhom = 1;
GO

PRINT N'Database setup completed successfully!';
PRINT N'You can now run the sample queries above to test the system.';
