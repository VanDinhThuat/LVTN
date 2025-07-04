import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';
import './ChiTietBaiNopPage.scss';

const ChiTietBaiNopPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");
  const user = JSON.parse(localStorage.getItem("user"));
  const maNguoiDung = user.userId;
  
  useEffect(() => {
    if (maTuan && maNguoiDung) {
      fetchSubmissionDetails();
    }
  }, [maTuan, maNguoiDung]);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API để lấy danh sách bài nộp của sinh viên
      const response = await axios.get(`${url}/api/nop-bai/sinh-vien/${maNguoiDung}`);
      
      if (response.data && Array.isArray(response.data)) {
        // Tìm bài nộp theo maTuan
        const currentSubmission = response.data.find(sub => sub.maTuan === parseInt(maTuan));
        setSubmission(currentSubmission || null);
      } else {
        setSubmission(null);
      }
    } catch (err) {
      setError('Không thể tải thông tin bài nộp: ' + err.message);
      console.error('Error fetching submission details:', err);
      setSubmission(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!submission?.tenFile || !submission?.duongDanFile) return;

    try {
      setLoading(true);
      
      // Lấy tên file từ đường dẫn
      const fileName = submission.duongDanFile.split('/').pop();
      
      const response = await axios.get(`${url}/api/nop-bai/download/${maTuan}/${fileName}`, {
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', submission.tenFile);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Không thể tải file: ' + err.message);
      console.error('Error downloading file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!submission?.maNopBai) return;

    const confirmDelete = window.confirm('Bạn có chắc chắn muốn hủy nộp bài này không?');
    if (!confirmDelete) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${url}/api/nop-bai/${submission.maNopBai}`, {
        params: { maNguoiDung }
      });

      // Kiểm tra message trả về từ API
      if (response.data && response.data.message) {
        alert(response.data.message);
      } else if (typeof response.data === 'string') {
        alert(response.data);
      } else {
        alert('Đã hủy nộp bài thành công!');
      }

      setSubmission(null);
    } catch (err) {
      // Xử lý lỗi trả về từ API
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : err.response.data.message);
      } else {
        setError('Không thể hủy nộp bài: ' + err.message);
      }
      console.error('Error deleting submission:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return dateString;
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return '';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return Math.round(sizeInBytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📎';
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      case 'zip':
      case 'rar':
        return '📦';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
        return '🖼️';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  return (
    <Page>
      <Box className="chi-tiet-bai-nop-container">
        {/* Header */}
        <Box className="chi-tiet-bai-nop-header">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="chi-tiet-bai-nop-header-back-btn"
            size="small"
          >
            ← Quay lại
          </Button>
          <Text className="chi-tiet-bai-nop-header-title">
            Chi tiết bài nộp - Tuần {maTuan}
          </Text>
        </Box>

        {/* Error Message */}
        {error && (
          <Box className="chi-tiet-bai-nop-error">
            <Text>{error}</Text>
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Box className="chi-tiet-bai-nop-loading">
            <Text>Đang tải thông tin...</Text>
          </Box>
        )}

        {/* Content */}
        {!loading && (
          <Box className="chi-tiet-bai-nop-content">
            {submission ? (
              <>
                {/* File Information Card */}
                <Box className="chi-tiet-bai-nop-content-file-info">
                  <Box className="chi-tiet-bai-nop-content-file-info-header">
                    <span className="chi-tiet-bai-nop-content-file-info-header-icon">
                      {getFileIcon(submission.tenFile)}
                    </span>
                    <div>
                      <Text className="chi-tiet-bai-nop-content-file-info-header-name">
                        {submission.tenFile}
                      </Text>
                      {submission.kichThuoc && (
                        <Text className="chi-tiet-bai-nop-content-file-info-size">
                          Kích thước: {formatFileSize(submission.kichThuoc)}
                        </Text>
                      )}
                    </div>
                  </Box>

                  <Box className="chi-tiet-bai-nop-content-file-info-details">
                    <Text className="chi-tiet-bai-nop-content-file-info-date">
                      <span className="chi-tiet-bai-nop-content-file-info-date-icon">📅</span>
                      Thời gian nộp: {formatDate(submission.ngayNop)}
                    </Text>
                    <Text className="chi-tiet-bai-nop-content-file-info-user">
                      <span style={{ marginRight: '8px' }}>👤</span>
                      Người nộp: {submission.tenNguoiDung}
                    </Text>
                    <Text className="chi-tiet-bai-nop-content-file-info-type">
                      <span style={{ marginRight: '8px' }}>📋</span>
                      Loại file: {submission.loaiFile}
                    </Text>
                  </Box>

                  {/* Action Buttons */}
                  <Box className="chi-tiet-bai-nop-content-file-info-actions">
                    <Button
                      variant="primary"
                      onClick={handleDownloadFile}
                      disabled={loading}
                      size="small"
                      className="chi-tiet-bai-nop-content-file-info-download-btn"
                    >
                      📥 Tải file
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleDeleteSubmission}
                      disabled={loading}
                      size="small"
                      className="chi-tiet-bai-nop-content-file-info-delete-btn"
                    >
                      🗑️ Hủy nộp bài
                    </Button>
                  </Box>
                </Box>

                {/* Status Badge */}
                <Box className="chi-tiet-bai-nop-content-status">
                  ✅ Bạn đã nộp bài thành công cho tuần này
                </Box>
              </>
            ) : (
              <Box className="chi-tiet-bai-nop-content-empty">
                <Text className="chi-tiet-bai-nop-content-empty-text">
                  Bạn chưa nộp bài cho tuần này
                </Text>
                
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ChiTietBaiNopPage;