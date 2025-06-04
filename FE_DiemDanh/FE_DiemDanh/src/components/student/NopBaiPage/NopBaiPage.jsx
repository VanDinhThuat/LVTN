import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from '../../../AppConfig/AppConfig';

const NopBaiPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");
  const maNguoiDung = localStorage.getItem('maNguoiDung'); // Get from auth context or localStorage

  useEffect(() => {
    if (maTuan && maNguoiDung) {
      fetchSubmissions();
    }
  }, [maTuan, maNguoiDung]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/nop-bai/sinh-vien/${maNguoiDung}`);
      setSubmissions(response.data);
      // Find current submission for this week
      const currentSub = response.data.find(sub => sub.maTuan === parseInt(maTuan));
      setCurrentSubmission(currentSub);
    } catch (err) {
      setError('Không thể tải thông tin nộp bài: ' + err.message);
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Add file size validation here if needed
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file để nộp');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('maTuan', maTuan);
      formData.append('maNguoiDung', maNguoiDung);

      await axios.post(`${url}/api/nop-bai/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Refresh submissions after successful upload
      await fetchSubmissions();
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('Không thể nộp bài: ' + err.message);
      console.error('Error submitting file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async () => {
    if (!currentSubmission) return;
    
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài nộp này?')) return;

    try {
      setLoading(true);
      await axios.delete(`${url}/api/nop-bai/${currentSubmission.maNopBai}?maNguoiDung=${maNguoiDung}`);
      await fetchSubmissions();
    } catch (err) {
      setError('Không thể xóa bài nộp: ' + err.message);
      console.error('Error deleting submission:', err);
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

        {/* Current Submission Status */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            📝 Trạng thái nộp bài
          </Text>
          
          {currentSubmission ? (
            <Box>
              <Text style={{ marginBottom: '8px' }}>
                ✅ Đã nộp lúc: {formatDate(currentSubmission.ngayNop)}
              </Text>
              <Text style={{ marginBottom: '8px' }}>
                📎 File đã nộp: {currentSubmission.tenFile}
              </Text>
              {currentSubmission.ghiChu && (
                <Text style={{ marginBottom: '8px' }}>
                  📝 Ghi chú của giáo viên: {currentSubmission.ghiChu}
                </Text>
              )}
              <Button
                variant="danger"
                onClick={handleDeleteSubmission}
                style={{ marginTop: '12px' }}
              >
                🗑️ Xóa bài nộp
              </Button>
            </Box>
          ) : (
            <Text style={{ color: '#666' }}>
              Bạn chưa nộp bài cho tuần này
            </Text>
          )}
        </Box>

        {/* File Upload Form */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '12px'
        }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            {currentSubmission ? '📤 Nộp lại bài' : '📤 Nộp bài'}
          </Text>
          
          <Box style={{ marginBottom: '16px' }}>
            <input
              type="file"
              onChange={handleFileSelect}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
            
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedFile || loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Đang xử lý...' : '📤 Nộp bài'}
            </Button>
          </Box>

          <Text style={{ fontSize: '14px', color: '#666' }}>
            * Chỉ chấp nhận file PDF, Word, Excel, PowerPoint, ZIP, RAR
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default NopBaiPage; 