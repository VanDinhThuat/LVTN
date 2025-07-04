import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate, Modal, Input } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';
import './QuanLyNopBaiPage.scss';

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
  const [currentUserId, setCurrentUserId] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");

  useEffect(() => {
    // Lấy userId hiện tại từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUserId(user?.userId);
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
      <Box className="qlnbp-container">
        {/* Header */}
        <Box className="qlnbp-header">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="qlnbp-back-btn"
          >
            ← Quay lại
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Box className="qlnbp-stats-grid">
          <Box className="qlnbp-stats-card qlnbp-total-students">
            <Text className="qlnbp-stats-number">
              {submissionReport.totalStudents}
            </Text>
            <Text className="qlnbp-stats-label">
              Tổng số học sinh
            </Text>
          </Box>
          
          <Box className="qlnbp-stats-card qlnbp-submitted">
            <Text className="qlnbp-stats-number submitted">
              {submissionReport.submitted}
            </Text>
            <Text className="qlnbp-stats-label">
              Đã nộp bài
            </Text>
          </Box>
          
          <Box className="qlnbp-stats-card qlnbp-not-submitted">
            <Text className="qlnbp-stats-number not-submitted">
              {submissionReport.notSubmitted}
            </Text>
            <Text className="qlnbp-stats-label">
              Chưa nộp
            </Text>
          </Box>
          
          <Box className="qlnbp-stats-card qlnbp-late">
            <Text className="qlnbp-stats-number late">
              {submissionReport.lateSubmissions}
            </Text>
            <Text className="qlnbp-stats-label">
              Nộp muộn
            </Text>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Box className="qlnbp-error-box">
            <Text>{error}</Text>
          </Box>
        )}

        {/* Filters and Search */}
        <Box className="qlnbp-filter-box">
          <Box className="qlnbp-filter-flex">
            {/* Search */}
            <Box>
              <Text className="qlnbp-search-label">
                🔍 Tìm kiếm:
              </Text>
              <input
                type="text"
                placeholder="Tìm theo tên hoặc mã số sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="qlnbp-search-input"
              />
            </Box>

            {/* Filter buttons */}
            <Box>
              <Text className="qlnbp-filter-label">
                📊 Lọc theo trạng thái:
              </Text>
              <Box className="qlnbp-filter-btn-group">
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
        <Box className="qlnbp-student-list">
          {loading ? (
            <Box className="qlnbp-loading-box">
              <Text>Đang tải danh sách...</Text>
            </Box>
          ) : filteredData.length === 0 ? (
            <Box className="qlnbp-empty-box">
              <Text className="qlnbp-empty-text">
                {searchQuery || filter !== 'all' ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có dữ liệu'}
              </Text>
            </Box>
          ) : (
            <Box>
              {filteredData.map((item, index) => (
                <Box 
                  key={item.maNopBai || index}
                  className={`qlnbp-student-item ${index % 2 === 0 ? 'even' : 'odd'}`}
                >
                  <Box className="qlnbp-student-row">
                    {/* Student Info */}
                    <Box className="qlnbp-student-info">
                      <Text className="qlnbp-student-name">
                        👤 {item.tenHocSinh}
                      </Text>
                      
                      <Text className="qlnbp-student-mssv">
                        🎓 MSSV: {item.maNguoiDung}
                      </Text>
                      
                      {item.ngayNop && (
                        <Text className="qlnbp-student-date">
                          📅 Nộp lúc: {formatDate(item.ngayNop)}
                        </Text>
                      )}
                      
                      {item.tenFile && (
                        <Text className="qlnbp-student-file">
                          📎 File: {item.tenFile}
                        </Text>
                      )}
                      
                      {item.ghiChu && (
                        <Box className="qlnbp-student-note-box">
                          <Text className="qlnbp-student-note">
                            📝 Đánh giá: {item.ghiChu}
                          </Text>
                        </Box>
                      )}

                      <Box className={`qlnbp-status-badge ${item.daNop ? 'submitted' : 'not-submitted'}`}>
                        {item.daNop ? '✅ Đã nộp' : '❌ Chưa nộp'}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box className="qlnbp-action-btns">
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
                          {/* Chỉ hiển thị nút Hủy nộp nếu là bài của sinh viên hiện tại */}
                          {currentUserId && item.maNguoiDung === currentUserId && (
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteSubmission(item.maNopBai, item.maNguoiDung)}
                            >
                              🗑️ Hủy nộp
                            </Button>
                          )}
                          {/* Nếu không phải sinh viên hiện tại, vẫn cho phép admin/giáo viên xóa như cũ */}
                          {currentUserId && item.maNguoiDung !== currentUserId && (
                            <Button
                              variant="danger"
                              onClick={() => handleDeleteSubmission(item.maNopBai, item.maNguoiDung)}
                            >
                              🗑️ Xóa
                            </Button>
                          )}
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
          <Box className="qlnbp-modal-content">
            <Input
              type="textarea"
              label="Đánh giá"
              placeholder="Nhập nhận xét của bạn..."
              value={evalNote}
              onChange={(e) => setEvalNote(e.target.value)}
              rows={4}
              className="qlnbp-modal-input"
            />
            
            <Box className="qlnbp-modal-btns">
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