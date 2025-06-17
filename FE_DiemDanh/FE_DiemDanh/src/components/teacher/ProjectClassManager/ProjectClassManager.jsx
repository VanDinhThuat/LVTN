import React, { useState, useEffect } from 'react';
import {
  Page,
  Header,
  Box,
  Text,
  Button,
  Input,
  Modal,
  List,
  Spinner,
  useSnackbar,
} from 'zmp-ui';
import axios from 'axios';
import { url } from '../../../AppConfig/AppConfig';
import { useNavigate } from 'react-router-dom';

const ProjectClassManager = () => {
  // States
  const [classes, setClasses] = useState([]);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassNote, setNewClassNote] = useState('');
  const [classStartDate, setClassStartDate] = useState('');
  const [classEndDate, setClassEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const showSnackbar = (message, type = 'success') => {
    openSnackbar({
      text: message,
      type: type,
      duration: 3000
    });
  };

  const fetchClasses = async () => {
     const id = JSON.parse(localStorage.getItem("user")).userId
    setPageLoading(true);
    try {
      const response = await axios.get(`${url}/api/lop-do-an/gv/${id}`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showSnackbar('Không thể tải danh sách lớp học!', 'error');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim() || !classStartDate || !classEndDate) {
      showSnackbar('Vui lòng điền đầy đủ thông tin lớp học!', 'error');
      return;
    }

    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      
      // Generate a random participation code
      const maThamGia = Math.random().toString(36).substr(2, 8).toUpperCase();

      const newClassData = {
        tenLopDoAn: newClassName,
        maThamGia: maThamGia,
        ghiChu: newClassNote,
        gvId: currentUser.userId,
        thoiGianBatDau: classStartDate,
        thoiGianKetThuc: classEndDate
      };

      const response = await axios.post(`${url}/api/lop-do-an`, newClassData);
      
      if (response.status === 200 || response.status === 201) {
        showSnackbar(`Đã tạo lớp "${newClassName}" thành công!`);
        await fetchClasses();

        // Reset form
        setNewClassName('');
        setNewClassNote('');
        setClassStartDate('');
        setClassEndDate('');
        setCreateClassModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Có lỗi xảy ra khi tạo lớp học!', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectClass = (classItem) => {
    navigate(`/quan-ly-nhom?maBuoiHoc=${classItem.maLopDoAn}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (pageLoading) {
    return (
      <Page>
        <Box p={4} className="text-center">
          <Spinner size="large" />
          <Text className="mt-4">Đang tải danh sách lớp học...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page>
      <Box p={4}>
        <Box mb={4}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => setCreateClassModalVisible(true)}
          >
            ➕ Tạo Lớp Đồ Án Mới
          </Button>
        </Box>

        <Box mb={4} className="text-center">
          <Text size="xxLarge" bold className="text-blue-600">
            📚 Danh Sách Lớp Đồ Án
          </Text>
        </Box>

        {classes.length === 0 ? (
          <Box className="text-center py-12">
            <Text size="large" className="text-gray-400 mb-2">📖</Text>
            <Text className="text-gray-500">Chưa có lớp đồ án nào</Text>
          </Box>
        ) : (
          <List>
            {classes.map(classItem => (
              <List.Item
                key={classItem.maLopDoAn}
                onClick={() => handleSelectClass(classItem)}
                className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                title={
                  <Box>
                    <Box className="flex justify-between items-start mb-2">
                      <Text size="large" bold className="text-blue-600">
                        📚 {classItem.tenLopDoAn}
                      </Text>
                    </Box>
                    
                    {classItem.ghiChu && (
                      <Box className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                        <Text className="text-gray-600 italic">
                          📝 {classItem.ghiChu}
                        </Text>
                      </Box>
                    )}
                    
                    <Box className="grid grid-cols-2 gap-4 text-sm">
                      <Box>
                        <Text size="small" className="text-gray-500">
                          🗓️ Bắt đầu: {formatDate(classItem.thoiGianBatDau)}
                        </Text>
                        <Text size="small" className="text-gray-500">
                          🗓️ Kết thúc: {formatDate(classItem.thoiGianKetThuc)}
                        </Text>
                      </Box>
                      <Box>
                        <Text size="small" className="text-gray-500">
                          📋 Mã tham gia: {classItem.maThamGia || 'Chưa có'}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                }
                suffix={
                  <Box className="text-center">
                    <Text size="small" className="text-blue-500 font-semibold">
                      Xem chi tiết →
                    </Text>
                  </Box>
                }
              />
            ))}
          </List>
        )}
      </Box>

      <Modal
        visible={createClassModalVisible}
        title="➕ Tạo Lớp Đồ Án Mới"
        onClose={() => setCreateClassModalVisible(false)}
      >
        <Box p={4}>
          <Box mb={3}>
            <Text className="font-semibold mb-2">📚 Tên lớp đồ án:</Text>
            <Input
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nhập tên lớp đồ án..."
            />
          </Box>

          <Box mb={3}>
            <Text className="font-semibold mb-2">📝 Ghi chú:</Text>
            <Input
              value={newClassNote}
              onChange={(e) => setNewClassNote(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </Box>

          <Box mb={3}>
            <Text className="font-semibold mb-2">📅 Ngày bắt đầu:</Text>
            <Input
              type="date"
              value={classStartDate}
              onChange={(e) => setClassStartDate(e.target.value)}
            />
          </Box>

          <Box mb={4}>
            <Text className="font-semibold mb-2">📅 Ngày kết thúc:</Text>
            <Input
              type="date"
              value={classEndDate}
              onChange={(e) => setClassEndDate(e.target.value)}
            />
          </Box>

          <Box className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setCreateClassModalVisible(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateClass}
              loading={loading}
            >
              {loading ? <Spinner /> : '✨ Tạo Lớp'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
};

export default ProjectClassManager;