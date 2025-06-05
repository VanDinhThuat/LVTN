import React, { useState, useEffect } from 'react';
import { Box, Button, Page, Text, Input, useLocation, useNavigate } from "zmp-ui";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";
const NopBaiPage = () => {
  const [loading, setLoading] = useState(false);
  const [tuanInfo, setTuanInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ghiChu, setGhiChu] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const maTuan = params.get("maTuan");

  useEffect(() => {
    if (maTuan) {
      fetchTuanInfo();
      getUser();
    }
  }, [maTuan]);

  const getUser = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  };

  const fetchTuanInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/tuan-nop-bai/${maTuan}`);
      setTuanInfo(response.data);
    } catch (err) {
      setError('Không thể tải thông tin tuần nộp bài');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (ví dụ: tối đa 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB');
        return;
      }
      
      // Kiểm tra định dạng file
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Định dạng file không được hỗ trợ! Vui lòng chọn file PDF, Word, Text hoặc hình ảnh');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn file để nộp bài');
      return;
    }

    if (!user) {
      setError('Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('maTuan', maTuan);
      formData.append('maNguoiDung', user.userId);
      formData.append('ghiChu', ghiChu);
      console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
      const response = await axios.post(
        `${url}/api/nop-bai/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate(-1); // Quay lại trang trước
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
      console.error(err);
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  if (success) {
    return (
      <Page>
        <Box style={{ textAlign: 'center', padding: '50px' }}>
          <Box style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2d5a2d', 
            padding: '24px', 
            borderRadius: '12px',
            border: '2px solid #4caf50'
          }}>
            <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              ✅ Nộp bài thành công!
            </Text>
            <Text style={{ fontSize: '14px' }}>
              Bài làm của bạn đã được gửi thành công. Đang chuyển hướng...
            </Text>
          </Box>
        </Box>
      </Page>
    );
  }

  return (
    <Page className="nop-bai-page">
      <Box style={{ padding: '16px' }}>
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
              backgroundColor: '#f8f9fa', 
              padding: '16px', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                Nộp bài: {tuanInfo.tenTuan}
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

        {/* Error Message */}
        {error && (
          <Box style={{ 
            backgroundColor: '#fee', 
            color: '#c53030', 
            padding: '12px', 
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #fed7d7'
          }}>
            <Text style={{ fontSize: '14px' }}>❌ {error}</Text>
          </Box>
        )}

        {/* File Upload Section */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '20px'
        }}>
          <Text style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            📁 Chọn file bài làm
          </Text>
          
          <Box style={{ marginBottom: '16px' }}>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
                cursor: 'pointer'
              }}
            />
          </Box>

          {/* File Info */}
          {selectedFile && (
            <Box style={{ 
              backgroundColor: '#e8f5e8', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                📄 File đã chọn:
              </Text>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                Tên: {selectedFile.name}
              </Text>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                Kích thước: {formatFileSize(selectedFile.size)}
              </Text>
              <Text style={{ fontSize: '14px', color: '#666' }}>
                Loại: {selectedFile.type || 'Không xác định'}
              </Text>
            </Box>
          )}

          {/* Supported file types */}
          <Box style={{ 
            backgroundColor: '#f0f8ff', 
            padding: '12px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <Text style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', marginBottom: '4px' }}>
              💡 Định dạng file được hỗ trợ:
            </Text>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              PDF, Word (.doc, .docx), Text (.txt), Hình ảnh (.jpg, .png, .gif)
            </Text>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              Kích thước tối đa: 10MB
            </Text>
          </Box>
        </Box>

        {/* Ghi chú */}
        <Box style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          marginBottom: '20px'
        }}>
          <Text style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            📝 Ghi chú (tùy chọn)
          </Text>
          <textarea
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            placeholder="Nhập ghi chú cho bài nộp của bạn..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </Box>

        {/* Submit Button */}
        <Box style={{ display: 'flex', gap: '12px' }}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            style={{ flex: 1 }}
          >
            Hủy
          </Button>
          <Button 
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
            style={{ flex: 2 }}
          >
            {loading ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        </Box>
      </Box>
    </Page>
  );
};

export default NopBaiPage;