import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';
import "./TuanNopBaiList.scss";

const TuanNopBaiList = () => {
  const [tuanNopBaiList, setTuanNopBaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buoiHoc, setBuoiHoc] = useState(null);
  const [role, setRole] = useState();
  const [className, setClassName] = useState('');
  const [projectStart, setProjectStart] = useState('');
  const [projectEnd, setProjectEnd] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maBuoiHoc = params.get("maNhom") || 1;
  const { tenLopDoAn,maLopDoAn} = location.state || {};

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchTuanNopBai(),
        fetchBuoiHocInfo(),
        getUser()
      ]);
      if(maLopDoAn) {
        fetchClassInfo(maLopDoAn);
      }
      if(maBuoiHoc) {
        fetchGroupInfo(maBuoiHoc);
      } 
    };
    initializeData();
  }, []);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role);
  };
  const fetchClassInfo = async (maLopDoAn) => {
    try {
      const response = await axios.get(`${url}/api/lop-do-an/${maLopDoAn}`);
      setClassName(response.data.tenLopDoAn);
      setProjectStart(response.data.thoiGianBatDau);
      setProjectEnd(response.data.thoiGianKetThuc);
    } catch (error) {
      console.error('Error fetching class info:', error);
      showSnackbar('Không thể tải thông tin lớp!', 'error');
    }
  };

  const fetchBuoiHocInfo = async () => {
    try {
      const response = await axios.get(`${url}/api/tuan-nop-bai/nhom-do-an/${maBuoiHoc}`);
      setBuoiHoc(response.data);
    } catch (err) {
      console.error('Không thể lấy thông tin buổi học:', err);
    }
  };
   const fetchGroupInfo = async (maBuoiHoc) => {
    try {
      const response = await axios.get(`${url}/api/nhom-do-an/${maBuoiHoc}`);
      setClassName(response.data.tenNhom);
      
    } catch (error) {
      console.error('Error fetching class info:', error);
      showSnackbar('Không thể tải thông tin lớp!', 'error');
    }
  };
  const fetchTuanNopBai = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/tuan-nop-bai/nhom-do-an/${maBuoiHoc}`);
      setTuanNopBaiList(response.data);
    } catch (err) {
      setError('Không thể tải danh sách tuần nộp bài');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Lấy tuần cuối cùng (nếu có)
  const lastWeek = tuanNopBaiList.length > 0 ? tuanNopBaiList[tuanNopBaiList.length - 1] : null;

  const handleCreateTuan = () => {
    navigate(`/create-tuan-nop-bai?maNhom=${maBuoiHoc}`, {
      state: {
        projectStart,
        projectEnd,
        lastWeekEnd: lastWeek ? lastWeek.ngayKetThuc : null
      }
    });
  };
  const handleViewDetail = (maTuan) => navigate(`/tuan-nop-bai-detail?maTuan=${maTuan}`);
  const handleDetailStudent = (maTuan) => navigate(`/tuan-nop-bai-detail-sinhvien?maTuan=${maTuan}`);
  const handleNopBai = (maTuan) => navigate(`/nop-bai?maTuan=${maTuan}`);
  const handleQuanLyNopBai = (maTuan) => navigate(`/quan-ly-nop-bai?maTuan=${maTuan}`);

  const handleCloseTuan = async (maTuan) => {
    try {
      await axios.put(`${url}/api/tuan-nop-bai/${maTuan}/close`);
      fetchTuanNopBai();
    } catch (error) {
      console.error('Lỗi khi đóng tuần:', error);
    }
  };

  const renderHeader = () => (
    <Box className="tuan-nop-bai-header">
      <Box className="tuan-nop-bai-header-row">
        <Box>
          {buoiHoc && (
            <>
              <Text className="group-title">
                 {tenLopDoAn} - {className} 
              </Text>
              <Text className="tuan-nop-bai-desc">Danh sách tuần nộp bài</Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );

  const renderTuanItem = (tuan) => (
    <Box key={tuan.maTuan} className="tuan-nop-bai-item">
      <Box className="tuan-nop-bai-item-row">
        <Box className="tuan-nop-bai-item-info">
          <Box className="tuan-nop-bai-item-title-row">
            <Text className="tuan-nop-bai-item-title">{tuan.tenTuan}</Text>
            <Text className={`tuan-nop-bai-status ${tuan.trangThai === 'active' ? 'active' : 'closed'}`}>{tuan.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'}</Text>
          </Box>
          {tuan.moTa && (
            <Text className="tuan-nop-bai-item-desc">{tuan.moTa}</Text>
          )}
        </Box>
      </Box>

      <Box className="tuan-nop-bai-item-grid">
        <Text className="tuan-nop-bai-date">📅 Bắt đầu: {formatDate(tuan.ngayBatDau)}</Text>
        <Text className="tuan-nop-bai-date">⏰ Kết thúc: {formatDate(tuan.ngayKetThuc)}</Text>
        <Text className="tuan-nop-bai-date">👥 {tuan.nopBais?.length || 0} bài nộp</Text>
      </Box>

      {tuan.nopBais && tuan.nopBais.length > 0 && (
        <Box className="tuan-nop-bai-student-list">
          <Text className="tuan-nop-bai-student-list-title">Sinh viên đã nộp bài:</Text>
          <Box className="tuan-nop-bai-student-list-row">
            {tuan.nopBais.slice(0, 5).map((nopBai, index) => (
              <Text key={index} className="tuan-nop-bai-student">{nopBai.tenSinhVien}</Text>
            ))}
            {tuan.nopBais.length > 5 && (
              <Text className="tuan-nop-bai-student-more">+{tuan.nopBais.length - 5} khác</Text>
            )}
          </Box>
        </Box>
      )}

      <Box className="tuan-nop-bai-action-row">
        {role === "student" && tuan.trangThai === 'active' && (
          <>
            <Button 
              variant="secondary" 
              className="tuan-nop-bai-btn"
              onClick={() => handleDetailStudent(tuan.maTuan)}
            >
              Xem chi tiết
            </Button>
            <Button 
              variant="primary" 
              className="tuan-nop-bai-btn"
              onClick={() => handleNopBai(tuan.maTuan)}
            >
              Nộp bài
            </Button>
          </>
        )}
        {role === "teacher" && tuan.trangThai === 'active' && (
          <Button 
            variant="secondary" 
            className="tuan-nop-bai-btn"
            onClick={() => handleViewDetail(tuan.maTuan)}
          >
            Xem chi tiết
          </Button>
        )}
        {(role === "admin" || role === "teacher") && (
          <>
            <Button 
              variant="secondary" 
              className="tuan-nop-bai-btn"
              onClick={() => handleQuanLyNopBai(tuan.maTuan)}
            >
              Quản lý nộp bài
            </Button>
            {tuan.trangThai === 'active' && (
              <Button 
                type="danger" 
                variant="secondary" 
                className="tuan-nop-bai-btn"
                onClick={() => handleCloseTuan(tuan.maTuan)}
              >
                Đóng tuần
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Page>
        <Box className="tuan-nop-bai-loading">
          <Text className="tuan-nop-bai-loading-text">Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Box className="tuan-nop-bai-error">
          <Text className="tuan-nop-bai-error-text">{error}</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="tuan-nop-bai-page">
      <Box className="tuan-nop-bai-container">
        {renderHeader()}
        <Box className="tuan-list-section">
          {tuanNopBaiList.length > 0 ? (
            <>
              {tuanNopBaiList.map(renderTuanItem)}
              {(role === "admin" || role === "teacher") && (
                <Box className="tuan-nop-bai-add-row">
                  <Button 
                    variant="secondary" 
                    className="tuan-nop-bai-btn-add"
                    onClick={handleCreateTuan}
                  >
                    + Thêm tuần mới
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box className="tuan-nop-bai-empty">
              <Text className="tuan-nop-bai-empty-title">
                Chưa có tuần nộp bài nào
              </Text>
              <Text className="tuan-nop-bai-empty-desc">
                Bắt đầu tạo tuần nộp bài đầu tiên cho lớp học này
              </Text>
              {(role === "admin" || role === "teacher") && (
                <Button 
                  variant="primary" 
                  className="tuan-nop-bai-btn-add"
                  onClick={handleCreateTuan}
                >
                  Tạo tuần nộp bài
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default TuanNopBaiList;