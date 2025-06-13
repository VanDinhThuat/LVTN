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
  const maNguoiDung = localStorage.getItem('maNguoiDung');

  useEffect(() => {
    if (maTuan && maNguoiDung) {
      fetchSubmissionDetails();
    }
  }, [maTuan, maNguoiDung]);

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const submissionResponse = await axios.get(`${url}/api/nop-bai/sinh-vien/${maNguoiDung}`);
      const submissions = submissionResponse.data;
      const currentSubmission = submissions.find(sub => sub.maTuan === parseInt(maTuan));
      setSubmission(currentSubmission);
    } catch (err) {
      setError('Không thể tải thông tin bài nộp: ' + err.message);
      console.error('Error fetching submission details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!submission?.tenFile || !submission?.duongDanFile) return;

    try {
      setLoading(true);
      const encodedFileName = submission.duongDanFile.split('/').pop();
      const response = await axios.get(`${url}/api/nop-bai/download/${maTuan}/${encodedFileName}`, {
        responseType: 'blob'
      });
      
      const contentType = response.headers['content-type'];
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
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
            Chi tiết bài nộp
          </Text>
        </Box>

        {/* Error Message */}
        {error && (
          <Box className="chi-tiet-bai-nop-error">
            <Text>{error}</Text>
          </Box>
        )}

        {loading ? (
          <Box className="chi-tiet-bai-nop-loading">
            <Text>Đang tải thông tin...</Text>
          </Box>
        ) : (
          <Box className="chi-tiet-bai-nop-content">
            {submission ? (
              <>
                {/* File Information */}
                <Box className="chi-tiet-bai-nop-content-file-info">
                  <Box className="chi-tiet-bai-nop-content-file-info-header">
                    <Text className="chi-tiet-bai-nop-content-file-info-header-icon">
                      {getFileIcon(submission.tenFile)}
                    </Text>
                    <Text className="chi-tiet-bai-nop-content-file-info-header-name">
                      {submission.tenFile}
                    </Text>
                  </Box>

                  <Box className="chi-tiet-bai-nop-content-file-info-date">
                    <span className="chi-tiet-bai-nop-content-file-info-date-icon">📅</span>
                    Thời gian nộp: {formatDate(submission.ngayNop)}
                  </Box>

                  {/* Download Button */}
                  <Button
                    variant="primary"
                    onClick={handleDownloadFile}
                    disabled={loading}
                    className="chi-tiet-bai-nop-content-file-info-download-btn"
                    size="small"
                  >
                    📥 Tải file
                  </Button>
                </Box>

                {/* Status Badge */}
                <Box className="chi-tiet-bai-nop-content-status">
                  ✅ Đã nộp bài thành công
                </Box>
              </>
            ) : (
              <Box className="chi-tiet-bai-nop-content-empty">
                <Text className="chi-tiet-bai-nop-content-empty-text">
                  Bạn chưa nộp bài cho tuần này
                </Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/nop-bai?maTuan=${maTuan}`)}
                  className="chi-tiet-bai-nop-content-empty-btn"
                  size="small"
                >
                  📤 Nộp bài ngay
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ChiTietBaiNopPage; 