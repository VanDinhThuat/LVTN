import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';

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
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
            Chi tiết bài nộp
          </Text>
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

        {loading ? (
          <Box style={{ textAlign: 'center', padding: '40px' }}>
            <Text>Đang tải thông tin...</Text>
          </Box>
        ) : (
          <Box style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            {submission ? (
              <>
                {/* File Information */}
                <Box style={{ 
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Text style={{ 
                      fontSize: '24px', 
                      marginRight: '8px' 
                    }}>
                      {getFileIcon(submission.tenFile)}
                    </Text>
                    <Text style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: '#1976d2'
                    }}>
                      {submission.tenFile}
                    </Text>
                  </Box>

                  <Box style={{ marginBottom: '16px' }}>
                    <Text style={{ 
                      color: '#666', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '8px' }}>📅</span>
                      Thời gian nộp: {formatDate(submission.ngayNop)}
                    </Text>
                  </Box>

                  {/* Download Button */}
                  <Button
                    variant="primary"
                    onClick={handleDownloadFile}
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    📥 Tải file
                  </Button>
                </Box>

                {/* Status Badge */}
                <Box style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  ✅ Đã nộp bài thành công
                </Box>
              </>
            ) : (
              <Box style={{ textAlign: 'center', padding: '40px' }}>
                <Text style={{ color: '#666', marginBottom: '16px', fontSize: '16px' }}>
                  Bạn chưa nộp bài cho tuần này
                </Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/nop-bai?maTuan=${maTuan}`)}
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