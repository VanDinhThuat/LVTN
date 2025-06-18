import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';

const TuanNopBaiList = () => {
  const [tuanNopBaiList, setTuanNopBaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buoiHoc, setBuoiHoc] = useState(null);
  const [role, setRole] = useState();
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maBuoiHoc = params.get("maNhom") || 1;

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchTuanNopBai(),
        fetchBuoiHocInfo(),
        getUser()
      ]);
    };
    initializeData();
  }, []);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role);
  };

  const fetchBuoiHocInfo = async () => {
    try {
      const response = await axios.get(`${url}/api/tuan-nop-bai/nhom-do-an/${maBuoiHoc}`);
      setBuoiHoc(response.data);
    } catch (err) {
      console.error('Không thể lấy thông tin buổi học:', err);
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

  const handleCreateTuan = () => navigate(`/create-tuan-nop-bai?maNhom=${maBuoiHoc}`);
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
    <Box className="header-info" style={{ 
      marginBottom: '24px', 
      padding: '20px', 
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          {buoiHoc && (
            <>
              <Text className="group-title" style={{ 
                fontSize: '22px', 
                fontWeight: '600', 
                marginBottom: '8px',
                color: '#1a1a1a'
              }}>
                Lớp {buoiHoc.subjectName} - Ca {buoiHoc.startPeriod} ~ {buoiHoc.endPeriod}
              </Text>
              <Text style={{ color: '#666', fontSize: '15px' }}>Danh sách tuần nộp bài</Text>
            </>
          )}
        </Box>
        {(role === "admin" || role === "teacher") && tuanNopBaiList.length > 0 && (
          <Button 
            variant="primary" 
            onClick={handleCreateTuan}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            Thêm tuần mới
          </Button>
        )}
      </Box>
    </Box>
  );

  const renderTuanItem = (tuan) => (
    <Box key={tuan.maTuan} style={{ 
      marginBottom: '24px', 
      padding: '20px', 
      backgroundColor: 'white', 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease',
      ':hover': {
        transform: 'translateY(-2px)'
      }
    }}>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <Box style={{ flex: 1 }}>
          <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <Text style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>{tuan.tenTuan}</Text>
            <Text style={{ 
              fontSize: '13px', 
              padding: '6px 12px', 
              borderRadius: '20px',
              backgroundColor: tuan.trangThai === 'active' ? '#e8f5e8' : '#fee',
              color: tuan.trangThai === 'active' ? '#2d5a2d' : '#c53030',
              fontWeight: '500'
            }}>
              {tuan.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'}
            </Text>
          </Box>
          {tuan.moTa && (
            <Text style={{ color: '#666', fontSize: '15px', marginBottom: '16px', lineHeight: '1.5' }}>
              {tuan.moTa}
            </Text>
          )}
        </Box>
      </Box>

      <Box style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Text style={{ fontSize: '15px', color: '#444' }}>
          📅 Bắt đầu: {formatDate(tuan.ngayBatDau)}
        </Text>
        <Text style={{ fontSize: '15px', color: '#444' }}>
          ⏰ Kết thúc: {formatDate(tuan.ngayKetThuc)}
        </Text>
        <Text style={{ fontSize: '15px', color: '#444' }}>
          👥 {tuan.nopBais?.length || 0} bài nộp
        </Text>
      </Box>

      {tuan.nopBais && tuan.nopBais.length > 0 && (
        <Box style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}>
          <Text style={{ fontWeight: '600', marginBottom: '12px', fontSize: '15px', color: '#1a1a1a' }}>
            Sinh viên đã nộp bài:
          </Text>
          <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tuan.nopBais.slice(0, 5).map((nopBai, index) => (
              <Text key={index} style={{ 
                backgroundColor: '#e8f5e8', 
                color: '#2d5a2d', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {nopBai.tenSinhVien}
              </Text>
            ))}
            {tuan.nopBais.length > 5 && (
              <Text style={{ 
                backgroundColor: '#e0e0e0', 
                color: '#666', 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '13px',
                fontWeight: '500'
              }}>
                +{tuan.nopBais.length - 5} khác
              </Text>
            )}
          </Box>
        </Box>
      )}

      <Box style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {role === "student" && tuan.trangThai === 'active' && (
          <>
            <Button 
              variant="secondary" 
              onClick={() => handleDetailStudent(tuan.maTuan)}
              style={{ padding: '10px 20px', borderRadius: '8px' }}
            >
              Xem chi tiết
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleNopBai(tuan.maTuan)}
              style={{ padding: '10px 20px', borderRadius: '8px' }}
            >
              Nộp bài
            </Button>
          </>
        )}
        
        {role === "teacher" && tuan.trangThai === 'active' && (
          <Button 
            variant="secondary" 
            onClick={() => handleViewDetail(tuan.maTuan)}
            style={{ padding: '10px 20px', borderRadius: '8px' }}
          >
            Xem chi tiết
          </Button>
        )}
        
        {(role === "admin" || role === "teacher") && (
          <>
            <Button 
              variant="secondary" 
              onClick={() => handleQuanLyNopBai(tuan.maTuan)}
              style={{ padding: '10px 20px', borderRadius: '8px' }}
            >
              Quản lý nộp bài
            </Button>
            {tuan.trangThai === 'active' && (
              <Button 
                type="danger" 
                variant="secondary" 
                onClick={() => handleCloseTuan(tuan.maTuan)}
                style={{ padding: '10px 20px', borderRadius: '8px' }}
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
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Text style={{ fontSize: '16px', color: '#666' }}>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Text style={{ color: '#c53030', fontSize: '16px' }}>{error}</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="tuan-nop-bai-page">
      <Box className="tuan-nop-bai-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {renderHeader()}
        
        <Box className="tuan-list-section">
          {tuanNopBaiList.length > 0 ? (
            <>
              {tuanNopBaiList.map(renderTuanItem)}
              {(role === "admin" || role === "teacher") && (
                <Box style={{ 
                  textAlign: 'center', 
                  padding: '20px',
                  marginTop: '20px'
                }}>
                  <Button 
                    variant="secondary" 
                    onClick={handleCreateTuan}
                    style={{ 
                      padding: '12px 24px', 
                      borderRadius: '8px', 
                      fontSize: '15px',
                      backgroundColor: '#f8f9fa',
                      border: '1px dashed #ccc'
                    }}
                  >
                    + Thêm tuần mới
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <Text style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a1a1a' }}>
                Chưa có tuần nộp bài nào
              </Text>
              <Text style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>
                Bắt đầu tạo tuần nộp bài đầu tiên cho lớp học này
              </Text>
              {(role === "admin" || role === "teacher") && (
                <Button 
                  variant="primary" 
                  onClick={handleCreateTuan}
                  style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '15px' }}
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