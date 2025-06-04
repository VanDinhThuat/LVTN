import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";

const TuanNopBaiList = () => {
  const [tuanNopBaiList, setTuanNopBaiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buoiHoc, setBuoiHoc] = useState(null);
  const [role, setRole] = useState();
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maBuoiHoc = params.get("maBuoiHoc") || 1;

  useEffect(() => {
    fetchTuanNopBai();
    fetchBuoiHocInfo(); // Tách riệng việc lấy thông tin buổi học
    getUser();
  }, []);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role);
  };

  // Hàm riêng để lấy thông tin buổi học
  const fetchBuoiHocInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/buoi-hoc/${maBuoiHoc}`);
      setBuoiHoc(response.data);
    } catch (err) {
      console.error('Không thể lấy thông tin buổi học:', err);
    }
  };

  const fetchTuanNopBai = async () => {
    try {
      setLoading(true);
     
      const response = await axios.get(`http://localhost:8080/api/tuan-nop-bai/buoi-hoc/${maBuoiHoc}`);
      const {data} = response;

      setTuanNopBaiList(data);
      
      // Chỉ set buoiHoc từ data nếu chưa có thông tin buổi học
      if (data.length > 0 && !buoiHoc) {
        setBuoiHoc(data[0].buoiHoc);
      }
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

  const handleCreateTuan = () => {
    navigate(`/create-tuan-nop-bai?maBuoiHoc=${maBuoiHoc}`);
  };

  const handleViewDetail = (maTuan) => {
    navigate(`/tuan-nop-bai-detail?maTuan=${maTuan}`);
  };
  const Detailstudent = (maTuan) => {
    navigate(`/tuan-nop-bai-detail-sinhvien?maTuan=${maTuan}`);
  };

  const handleNopBai = (maTuan) => {
    navigate(`/nop-bai?maTuan=${maTuan}`);
  };

const handleQuanLyNopBai = (maTuan) => {
   navigate(`/quan-ly-nop-bai?maTuan=${maTuan}`);
};

  const handleCloseTuan = async (maTuan) => {
    try {
      await axios.put(`http://localhost:8080/api/tuan-nop-bai/${maTuan}/close`);
      fetchTuanNopBai(); // Refresh data
    } catch (error) {
      console.error('Lỗi khi đóng tuần:', error);
    }
  };

  // Render header với button tạo tuần luôn hiển thị cho admin/teacher
  const renderHeader = () => {
    return (
      <Box className="header-info" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            {buoiHoc ? (
              <>
                <Text className="group-title" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Lớp {buoiHoc.subjectName} - Ca {buoiHoc.startPeriod} ~ {buoiHoc.endPeriod}
                </Text>
                <Text style={{ color: '#666', fontSize: '14px' }}>Danh sách tuần nộp bài</Text>
              </>
            ) : (
              <>
               
              </>
            )}
          </Box>
          {(role === "admin" || role === "teacher") && (
            <Button variant="primary" onClick={handleCreateTuan}>
              Thêm tuần mới
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  if (loading) {
    return (
      <Page>
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="tuan-nop-bai-page">
      <Box className="tuan-nop-bai-container" style={{ padding: '16px' }}>
        {/* Header - luôn hiển thị */}
        {renderHeader()}

        {/* Tuần nộp bài list */}
        <Box className="tuan-list-section">
          {tuanNopBaiList.length > 0 ? (
            tuanNopBaiList.map((tuan) => (
              <Box key={tuan.maTuan} style={{ 
                marginBottom: '20px', 
                padding: '16px', 
                backgroundColor: 'white', 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                {/* Tuan Header */}
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <Box style={{ flex: 1 }}>
                    <Box style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>{tuan.tenTuan}</Text>
                      <Text style={{ 
                        fontSize: '12px', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        backgroundColor: tuan.trangThai === 'active' ? '#e8f5e8' : '#fee',
                        color: tuan.trangThai === 'active' ? '#2d5a2d' : '#c53030'
                      }}>
                        {tuan.trangThai === 'active' ? 'Đang mở' : 'Đã đóng'}
                      </Text>
                    </Box>
                    {tuan.moTa && (
                      <Text style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                        {tuan.moTa}
                      </Text>
                    )}
                  </Box>
                </Box>

                {/* Thông tin thời gian */}
                <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    📅 Bắt đầu: {formatDate(tuan.ngayBatDau)}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    ⏰ Kết thúc: {formatDate(tuan.ngayKetThuc)}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#666' }}>
                    👥 {tuan.nopBais?.length || 0} bài nộp
                  </Text>
                </Box>

                {/* Danh sách sinh viên đã nộp */}
                {tuan.nopBais && tuan.nopBais.length > 0 && (
                  <Box style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    marginBottom: '16px' 
                  }}>
                    <Text style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                      Sinh viên đã nộp bài:
                    </Text>
                    <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {tuan.nopBais.slice(0, 5).map((nopBai, index) => (
                        <Text key={index} style={{ 
                          backgroundColor: '#e8f5e8', 
                          color: '#2d5a2d', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}>
                          {nopBai.tenSinhVien}
                        </Text>
                      ))}
                      {tuan.nopBais.length > 5 && (
                        <Text style={{ 
                          backgroundColor: '#e0e0e0', 
                          color: '#666', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}>
                          +{tuan.nopBais.length - 5} khác
                        </Text>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Actions */}
                <Box className="actions-section">
                  <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {role === "student" && tuan.trangThai === 'active' && (
                      <Button variant="secondary" onClick={() => Detailstudent(tuan.maTuan)}>
                      Xem chi tiết
                    </Button>
                    )}
                    {role === "teacher" && tuan.trangThai === 'active' && (
                       <Button variant="secondary" onClick={() => handleViewDetail(tuan.maTuan)}>
                       Xem chi tiết
                     </Button>
                   
                    )}
                  
                    
                    {role === "student" && tuan.trangThai === 'active' && (
                      <Button variant="primary" onClick={() => handleNopBai(tuan.maTuan)}>
                        Nộp bài
                      </Button>
                    )}
                    
                    {(role === "admin" || role === "teacher") && (
                      <>
                        <Button variant="secondary" onClick={() => handleQuanLyNopBai(tuan.maTuan)}>
                          Quản lý nộp bài
                        </Button>
                        {tuan.trangThai === 'active' && (
                          <Button 
                            type="danger" 
                            variant="secondary" 
                            onClick={() => handleCloseTuan(tuan.maTuan)}
                          >
                            Đóng tuần
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box style={{ 
              textAlign: 'center', 
              padding: '48px 16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                Chưa có tuần nộp bài nào
              </Text>
              <Text style={{ color: '#666', marginBottom: '16px' }}>
                Bắt đầu tạo tuần nộp bài đầu tiên cho lớp học này
              </Text>
              {(role === "admin" || role === "teacher") && (
                <Button variant="primary" onClick={handleCreateTuan}>
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