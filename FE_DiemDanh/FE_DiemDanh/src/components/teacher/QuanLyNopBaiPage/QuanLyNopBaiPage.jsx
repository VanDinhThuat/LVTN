import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";

const QuanLyNopBaiPage = () => {
  const [loading, setLoading] = useState(false);
  const [tuanInfo, setTuanInfo] = useState(null);
  const [danhSachNopBai, setDanhSachNopBai] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, submitted, not_submitted
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");

  useEffect(() => {
    if (maTuan) {
      fetchTuanInfo();
      fetchDanhSachNopBai();
    }
  }, [maTuan]);

  const fetchTuanInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/tuan-nop-bai/${maTuan}`);
      setTuanInfo(response.data);
    } catch (err) {
      setError('Không thể tải thông tin tuần');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhSachNopBai = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/quan-ly-nop-bai/${maTuan}`);
      setDanhSachNopBai(response.data);
    } catch (err) {
      setError('Không thể tải danh sách nộp bài');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/download-file/${fileId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Không thể tải file');
      console.error(err);
    }
  };

  const handleGradeBai = (nopBaiId, tenHocSinh) => {
    navigate(`/cham-bai?nopBaiId=${nopBaiId}&tenHocSinh=${encodeURIComponent(tenHocSinh)}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#4caf50';
      case 'late': return '#ff9800';
      case 'not_submitted': return '#f44336';
      case 'graded': return '#2196f3';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'submitted': return 'Đã nộp';
      case 'late': return 'Nộp muộn';
      case 'not_submitted': return 'Chưa nộp';
      case 'graded': return 'Đã chấm';
      default: return 'Không xác định';
    }
  };

  // Filter and search logic
  const filteredData = danhSachNopBai.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'submitted' && (item.status === 'submitted' || item.status === 'late' || item.status === 'graded')) ||
      (filter === 'not_submitted' && item.status === 'not_submitted');
    
    const matchesSearch = searchQuery === '' || 
      item.tenHocSinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mssv?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: danhSachNopBai.length,
    submitted: danhSachNopBai.filter(item => ['submitted', 'late', 'graded'].includes(item.status)).length,
    notSubmitted: danhSachNopBai.filter(item => item.status === 'not_submitted').length,
    graded: danhSachNopBai.filter(item => item.status === 'graded').length
  };

  if (loading && !tuanInfo) {
    return (
      <Page>
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Đang tải...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="quan-ly-nop-bai-page">
      <Box style={{ padding: '16px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box style={{ marginBottom: '24px' }}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            style={{ marginBottom: '16px' }}
          >
            ← Quay lại
          </Button>
          
          {tuanInfo && (
            <Box style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '20px'
            }}>
              <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1976d2' }}>
                📋 Quản lý nộp bài: {tuanInfo.tenTuan}
              </Text>
              <Text style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                {tuanInfo.moTa}
              </Text>
              <Text style={{ color: '#d32f2f', fontSize: '14px', fontWeight: 'bold' }}>
                ⏰ Hạn nộp: {formatDate(tuanInfo.ngayKetThuc)}
              </Text>
            </Box>
          )}
        </Box>

        {/* Statistics Cards */}
        <Box style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #e3f2fd'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
              {stats.total}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Tổng học sinh
            </Text>
          </Box>
          
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #e8f5e8'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>
              {stats.submitted}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Đã nộp bài
            </Text>
          </Box>
          
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #ffebee'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>
              {stats.notSubmitted}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Chưa nộp
            </Text>
          </Box>
          
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            border: '2px solid #e3f2fd'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196f3' }}>
              {stats.graded}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Đã chấm điểm
            </Text>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Box style={{ 
            backgroundColor: '#ffebee', 
            color: '#c53030', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #ffcdd2'
          }}>
            <Text style={{ fontSize: '14px' }}>❌ {error}</Text>
          </Box>
        )}

        {/* Filters and Search */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <Box style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Search */}
            <Box>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                🔍 Tìm kiếm:
              </Text>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc MSSV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </Box>

            {/* Filter buttons */}
            <Box>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                📊 Lọc theo trạng thái:
              </Text>
              <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('all')}
                  style={{ fontSize: '12px' }}
                >
                  Tất cả ({stats.total})
                </Button>
                <Button
                  variant={filter === 'submitted' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('submitted')}
                  style={{ fontSize: '12px' }}
                >
                  Đã nộp ({stats.submitted})
                </Button>
                <Button
                  variant={filter === 'not_submitted' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('not_submitted')}
                  style={{ fontSize: '12px' }}
                >
                  Chưa nộp ({stats.notSubmitted})
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Student List */}
        <Box style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box style={{ 
            padding: '20px', 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
              📋 Danh sách học sinh ({filteredData.length})
            </Text>
          </Box>

          {loading ? (
            <Box style={{ textAlign: 'center', padding: '40px' }}>
              <Text>Đang tải danh sách...</Text>
            </Box>
          ) : filteredData.length === 0 ? (
            <Box style={{ textAlign: 'center', padding: '40px' }}>
              <Text style={{ color: '#666' }}>
                {searchQuery || filter !== 'all' ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu'}
              </Text>
            </Box>
          ) : (
            <Box>
              {filteredData.map((item, index) => (
                <Box 
                  key={item.id || index}
                  style={{ 
                    padding: '20px', 
                    borderBottom: index < filteredData.length - 1 ? '1px solid #f0f0f0' : 'none',
                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                  }}
                >
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Student Info */}
                    <Box style={{ flex: 1 }}>
                      <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <Text style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '12px' }}>
                          👤 {item.tenHocSinh}
                        </Text>
                        <Box style={{
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {getStatusText(item.status)}
                        </Box>
                      </Box>
                      
                      {item.mssv && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          🎓 MSSV: {item.mssv}
                        </Text>
                      )}
                      
                      {item.ngayNop && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          📅 Nộp lúc: {formatDate(item.ngayNop)}
                        </Text>
                      )}
                      
                      {item.fileName && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          📎 File: {item.fileName} ({formatFileSize(item.fileSize || 0)})
                        </Text>
                      )}
                      
                      {item.ghiChu && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          📝 Ghi chú: {item.ghiChu}
                        </Text>
                      )}
                      
                      {item.diem !== null && item.diem !== undefined && (
                        <Text style={{ fontSize: '14px', color: '#1976d2', fontWeight: 'bold' }}>
                          🏆 Điểm: {item.diem}/10
                        </Text>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                      {item.status !== 'not_submitted' && (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handleDownloadFile(item.fileId, item.fileName)}
                            style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                          >
                            📥 Tải file
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleGradeBai(item.nopBaiId, item.tenHocSinh)}
                            style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                          >
                            {item.status === 'graded' ? '✏️ Sửa điểm' : '📝 Chấm bài'}
                          </Button>
                        </>
                      )}
                      
                      {item.status === 'not_submitted' && (
                        <Box style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#ffebee', 
                          borderRadius: '6px',
                          textAlign: 'center'
                        }}>
                          <Text style={{ fontSize: '12px', color: '#d32f2f' }}>
                            Chưa nộp bài
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Export/Print Options */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            📊 Xuất báo cáo
          </Text>
          <Box style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => {
                // Implement export to Excel functionality
                console.log('Export to Excel');
              }}
              style={{ fontSize: '14px' }}
            >
              📈 Xuất Excel
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // Implement print functionality
                window.print();
              }}
              style={{ fontSize: '14px' }}
            >
              🖨️ In báo cáo
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default QuanLyNopBaiPage;