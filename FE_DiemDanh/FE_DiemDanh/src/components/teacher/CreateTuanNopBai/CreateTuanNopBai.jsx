import React, { useState } from 'react';
import {
  Page,
  Box,
  Text,
  Button,
  Input,
  useSnackbar,
  Modal
} from 'zmp-ui';
import axios from 'axios';
import { url } from '../../../AppConfig/AppConfig';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateTuanNopBai = () => {
  // States
  const [tenTuan, setTenTuan] = useState('');
  const [ngayBatDau, setNgayBatDau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [moTa, setMoTa] = useState('');
  const [loading, setLoading] = useState(false);

  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const maBuoiHoc = params.get("maNhom") || params.get("maBuoiHoc");

  const showSnackbar = (message, type = 'success') => {
    openSnackbar({
      text: message,
      type: type,
      duration: 3000
    });
  };

  const handleCreateTuan = async () => {
    if (!tenTuan || !ngayBatDau || !ngayKetThuc) {
      showSnackbar('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    // Validate dates
    const startDate = new Date(ngayBatDau);
    const endDate = new Date(ngayKetThuc);
    
    if (endDate <= startDate) {
      showSnackbar('Ngày kết thúc phải sau ngày bắt đầu!', 'error');
      return;
    }

    setLoading(true);

    try {
      const tuanData = {
        tenTuan,
        maNhom: parseInt(maBuoiHoc),
        ngayBatDau:startDate,
        ngayKetThuc:endDate,
        moTa:moTa,
        trangThai: 'active'
      };

      const response = await axios.post(`${url}/api/tuan-nop-bai`, tuanData);
      
      if (response.status === 200 || response.status === 201) {
        showSnackbar('Đã tạo tuần nộp bài thành công!');
        navigate(`/tuan-nop-bai?maBuoiHoc=${maBuoiHoc}`);
      }
    } catch (error) {
      console.error('Error creating submission week:', error);
      showSnackbar('Có lỗi xảy ra khi tạo tuần nộp bài!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Box p={4}>
        <Box mb={4} className="text-center">
          <Text size="xxLarge" bold className="text-blue-600">
            ➕ Tạo Tuần Nộp Bài Mới
          </Text>
          <Text className="text-gray-500 mt-2">
            Điền thông tin để tạo tuần nộp bài mới
          </Text>
        </Box>

        <Box className="space-y-4">
          <Box>
            <Text className="font-semibold mb-2">📝 Tên tuần:</Text>
            <Input
              value={tenTuan}
              onChange={(e) => setTenTuan(e.target.value)}
              placeholder="Ví dụ: Tuần 1 - Ôn tập"
            />
          </Box>

          <Box>
            <Text className="font-semibold mb-2">📋 Mô tả:</Text>
            <Input
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              placeholder="Mô tả chi tiết về tuần nộp bài..."
            />
          </Box>

          <Box>
            <Text className="font-semibold mb-2">📅 Ngày bắt đầu:</Text>
            <Input
              type="date"
              value={ngayBatDau}
              onChange={(e) => setNgayBatDau(e.target.value)}
            />
          </Box>

          <Box>
            <Text className="font-semibold mb-2">⏰ Ngày kết thúc:</Text>
            <Input
              type="date"
              value={ngayKetThuc}
              onChange={(e) => setNgayKetThuc(e.target.value)}
            />
          </Box>

          <Box className="pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateTuan}
              loading={loading}
            >
              {loading ? 'Đang tạo...' : '✨ Tạo Tuần Nộp Bài'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default CreateTuanNopBai; 