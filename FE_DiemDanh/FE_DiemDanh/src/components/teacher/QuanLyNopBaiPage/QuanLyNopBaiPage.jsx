import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate, Modal, Input } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';

const QuanLyNopBaiPage = () => {
  const [loading, setLoading] = useState(false);
  const [danhSachNopBai, setDanhSachNopBai] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionReport, setSubmissionReport] = useState({
    totalStudents: 0,
    submitted: 0,
    notSubmitted: 0,
    graded: 0,
    lateSubmissions: 0
  });
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [currentEvalItem, setCurrentEvalItem] = useState(null);
  const [evalNote, setEvalNote] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");

  useEffect(() => {
    if (maTuan) {
      fetchDanhSachNopBai();
    }
  }, [maTuan]);

  const fetchDanhSachNopBai = async () => {
    try {
      setLoading(true);
      console.log('Fetching submissions for week:', maTuan);
      const response = await axios.get(`${url}/api/nop-bai/tuan/${maTuan}`);
      console.log('Raw response:', response);
      console.log('Submission data:', response.data);
      
      // Transform data to include daNop status based on tenFile existence
      const transformedData = response.data.map(item => ({
        ...item,
        daNop: Boolean(item.tenFile && item.duongDanFile), // Check both file name and path
      }));
      
      // Calculate submission stats
      const stats = {
        totalStudents: transformedData.length,
        submitted: transformedData.filter(item => item.daNop).length,
        notSubmitted: transformedData.filter(item => !item.daNop).length,
        lateSubmissions: 0 // You can implement late submission logic if needed
      };
      
      console.log('Transformed data:', transformedData);
      console.log('Calculated stats:', stats);
      
      setDanhSachNopBai(transformedData);
      setSubmissionReport(stats);
    } catch (err) {
      setError('Không thể tải danh sách nộp bài: ' + err.message);
      console.error('Error fetching submissions:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (maTuan, fileName, duongDanFile) => {
    try {
      setLoading(true);
      
      // Extract the filename from duongDanFile path
      const encodedFileName = duongDanFile.split('/').pop();
      console.log('Downloading file:', {
        maTuan,
        fileName,
        duongDanFile,
        encodedFileName
      });

      const response = await axios.get(`${url}/api/nop-bai/download/${maTuan}/${encodedFileName}`, {
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      // Use the original fileName for the downloaded file
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Không thể tải file: ' + err.message);
      console.error('Error downloading file:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status,
        maTuan,
        fileName,
        duongDanFile
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (maNopBai, ghiChu) => {
    try {
      await axios.put(`${url}/api/nop-bai/${maNopBai}/ghi-chu`, { ghiChu });
      fetchDanhSachNopBai();
    } catch (err) {
      setError('Không thể thêm ghi chú: ' + err.message);
      console.error('Error adding note:', err);
    }
  };

  const handleDeleteSubmission = async (maNopBai, maNguoiDung) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài nộp này?')) return;
    
    try {
      await axios.delete(`${url}/api/nop-bai/${maNopBai}?maNguoiDung=${maNguoiDung}`);
      fetchDanhSachNopBai();
    } catch (err) {
      setError('Không thể xóa bài nộp: ' + err.message);
      console.error('Error deleting submission:', err);
    }
  };

  const handleGradeBai = (nopBaiId, tenHocSinh) => {
    navigate(`/cham-bai?nopBaiId=${nopBaiId}&tenHocSinh=${encodeURIComponent(tenHocSinh)}&maTuan=${maTuan}`);
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

  // Filter and search logic
  const filteredData = danhSachNopBai.filter(item => {
    const matchesFilter = filter === 'all' || 
      (filter === 'submitted' && item.daNop) ||
      (filter === 'not_submitted' && !item.daNop);
    
    const matchesSearch = searchQuery === '' || 
      (item.tenHocSinh && item.tenHocSinh.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.maNguoiDung && item.maNguoiDung.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const handleOpenEval = (item) => {
    setCurrentEvalItem(item);
    setEvalNote(item.ghiChu || '');
    setShowEvalModal(true);
  };

  const handleSubmitEval = async () => {
    try {
      setLoading(true);
      await axios.put(`${url}/api/nop-bai/${currentEvalItem.maNopBai}/ghi-chu`, {
        ghiChu: evalNote
      });
      
      // Refresh the list after adding note
      await fetchDanhSachNopBai();
      setShowEvalModal(false);
      setCurrentEvalItem(null);
      setEvalNote('');
    } catch (err) {
      setError('Không thể cập nhật đánh giá: ' + err.message);
      console.error('Error updating evaluation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
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
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
              {submissionReport.totalStudents}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Tổng số học sinh
            </Text>
          </Box>
          
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>
              {submissionReport.submitted}
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
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>
              {submissionReport.notSubmitted}
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
            textAlign: 'center'
          }}>
            <Text style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>
              {submissionReport.lateSubmissions}
            </Text>
            <Text style={{ fontSize: '14px', color: '#666' }}>
              Nộp muộn
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
            marginBottom: '16px'
          }}>
            <Text>{error}</Text>
          </Box>
        )}

        {/* Filters and Search */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <Box style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Search */}
            <Box>
              <Text style={{ marginBottom: '8px' }}>
                🔍 Tìm kiếm:
              </Text>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã số sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              />
            </Box>

            {/* Filter buttons */}
            <Box>
              <Text style={{ marginBottom: '8px' }}>
                📊 Lọc theo trạng thái:
              </Text>
              <Box style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button
                  variant={filter === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('all')}
                >
                  Tất cả ({submissionReport.totalStudents})
                </Button>
                <Button
                  variant={filter === 'submitted' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('submitted')}
                >
                  Đã nộp ({submissionReport.submitted})
                </Button>
                <Button
                  variant={filter === 'not_submitted' ? 'primary' : 'secondary'}
                  onClick={() => setFilter('not_submitted')}
                >
                  Chưa nộp ({submissionReport.notSubmitted})
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Student List */}
        <Box style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
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
                  key={item.maNopBai || index}
                  style={{ 
                    padding: '20px', 
                    borderBottom: '1px solid #eee',
                    backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
                  }}
                >
                  <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Student Info */}
                    <Box style={{ flex: 1 }}>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                        👤 {item.tenHocSinh}
                      </Text>
                      
                      <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        🎓 MSSV: {item.maNguoiDung}
                      </Text>
                      
                      {item.ngayNop && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          📅 Nộp lúc: {formatDate(item.ngayNop)}
                        </Text>
                      )}
                      
                      {item.tenFile && (
                        <Text style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          📎 File: {item.tenFile}
                        </Text>
                      )}
                      
                      {item.ghiChu && (
                        <Box style={{
                          backgroundColor: '#f3f4f6',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          marginTop: '8px'
                        }}>
                          <Text style={{ fontSize: '14px', color: '#1976d2' }}>
                            📝 Đánh giá: {item.ghiChu}
                          </Text>
                        </Box>
                      )}

                      <Box style={{ 
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: item.daNop ? '#e8f5e9' : '#ffebee',
                        color: item.daNop ? '#2e7d32' : '#c62828',
                        marginTop: '8px',
                        fontSize: '14px'
                      }}>
                        {item.daNop ? '✅ Đã nộp' : '❌ Chưa nộp'}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.daNop && (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handleDownloadFile(maTuan, item.tenFile, item.duongDanFile)}
                          >
                            📥 Tải file
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleOpenEval(item)}
                          >
                            {item.ghiChu ? '✏️ Sửa đánh giá' : '📝 Thêm đánh giá'}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDeleteSubmission(item.maNopBai, item.maNguoiDung)}
                          >
                            🗑️ Xóa
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Evaluation Modal */}
        <Modal
          visible={showEvalModal}
          title={`Đánh giá bài nộp - ${currentEvalItem?.tenHocSinh || ''}`}
          onClose={() => {
            setShowEvalModal(false);
            setCurrentEvalItem(null);
            setEvalNote('');
          }}
          description="Nhập đánh giá của bạn về bài nộp này"
        >
          <Box style={{ padding: '16px' }}>
            <Input
              type="textarea"
              label="Đánh giá"
              placeholder="Nhập nhận xét của bạn..."
              value={evalNote}
              onChange={(e) => setEvalNote(e.target.value)}
              rows={4}
              style={{ marginBottom: '16px' }}
            />
            
            <Box style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEvalModal(false);
                  setCurrentEvalItem(null);
                  setEvalNote('');
                }}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitEval}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu đánh giá'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Page>
  );
};

export default QuanLyNopBaiPage;