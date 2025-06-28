import React, { useState, useEffect } from 'react';
import {
  Page,
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
import { useLocation, useNavigate } from 'react-router-dom';

const ProjectGroupManager = () => {
  // States
  const [groups, setGroups] = useState([]);
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupNote, setNewGroupNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [classId, setClassId] = useState(null);
  const [className, setClassName] = useState('');
  const [classes,setClasses] = useState([]);
  const [userRole, setUserRole] = useState('');

  const { openSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || '');

    // Get classId from URL query parameter
    const params = new URLSearchParams(location.search);
    const maLopDoAn = params.get('maBuoiHoc');
    setClassId(maLopDoAn);
    
    if (maLopDoAn) {
      fetchGroups(maLopDoAn);
      fetchClassInfo(maLopDoAn);
    }
  }, [location]);

  const fetchClassInfo = async (maLopDoAn) => {
    try {
      const response = await axios.get(`${url}/api/lop-do-an/${maLopDoAn}`);
      setClassName(response.data.tenLopDoAn);
      setClasses(response);
    

    } catch (error) {
      console.error('Error fetching class info:', error);
      showSnackbar('Không thể tải thông tin lớp!', 'error');
    }
  };

  const showSnackbar = (message, type = 'success') => {
    openSnackbar({
      text: message,
      type: type,
      duration: 3000
    });
  };

  const fetchGroups = async (maLopDoAn) => {
    setPageLoading(true);
    try {
      const response = await axios.get(`${url}/api/nhom-do-an/lop-do-an/${maLopDoAn}`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      showSnackbar('Không thể tải danh sách nhóm!', 'error');
    } finally {
      setPageLoading(false);
    }
  };
  const handleSelectgroup = (group) => {
    try {
      navigate(`/tuan-nop-bai/?maNhom=${group.maNhom}`,{state:
         {tenLopDoAn: className,
          maLopDoAn: classId,
         }});
    } catch (error) {
      console.error('Error navigating to group:', error);
      showSnackbar('Có lỗi xảy ra khi chuyển trang!', 'error');
    }
  };
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      showSnackbar('Vui lòng nhập tên nhóm!', 'error');
      return;
    }

    setLoading(true);

    try {
      const newGroupData = {
        tenNhom: newGroupName,
        maLopDoAn: classId,
        ghiChu: newGroupNote
      };

      const response = await axios.post(`${url}/api/nhom-do-an`, newGroupData);
      
      if (response.status === 200 || response.status === 201) {
        showSnackbar(`Đã tạo nhóm "${newGroupName}" thành công!`);
        await fetchGroups(classId);

        // Reset form
        setNewGroupName('');
        setNewGroupNote('');
        setCreateGroupModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      showSnackbar('Có lỗi xảy ra khi tạo nhóm!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (maNhom) => {
    try {
      await axios.delete(`${url}/api/nhom-do-an/${maNhom}`);
      showSnackbar('Đã xóa nhóm thành công!');
      await fetchGroups(classId);
    } catch (error) {
      console.error('Error deleting group:', error);
      showSnackbar('Có lỗi xảy ra khi xóa nhóm!', 'error');
    }
  };

  if (pageLoading) {
    return (
      <Page>
        <Box p={4} className="text-center">
          <Spinner size="large" />
          <Text className="mt-4">Đang tải danh sách nhóm...</Text>
        </Box>
      </Page>
    );
  }

  return (
    <Page>
      <Box p={4}>
        <Box mb={4}>
         
          <Box className="border-t border-gray-200 pt-6 mb-4">
            <Text size="large" bold className="text-blue-600 mb-4 block">
              👥 {className || 'Đang tải...'}
            </Text>
            {userRole !== 'student' && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setCreateGroupModalVisible(true)}
              >
                ➕ Tạo Nhóm Mới
              </Button>
            )}
          </Box>
        </Box>

        <Box mb={4} className="text-center">
          <Text size="xxLarge" bold className="text-blue-600">
            👥 Danh Sách Nhóm Đồ Án
          </Text>
        </Box>

        {groups.length === 0 ? (
          <Box className="text-center py-12">
            <Text size="large" className="text-gray-400 mb-2">👥</Text>
            <Text className="text-gray-500">Chưa có nhóm nào</Text>
          </Box>
        ) : (
          <List>
            {groups.map(group => (
              <List.Item
                key={group.maNhom}
                onClick={() => handleSelectgroup(group)}
                className="hover:bg-blue-50 transition-colors duration-200 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm"    
                title={
                  <Box>
                    <Box className="flex justify-between items-start mb-2">
                      <Text size="large" bold className="text-blue-700">
                        👥 {group.tenNhom}
                      </Text>
                    </Box>
                    
                    {group.ghiChu && (
                      <Box className="bg-white p-3 rounded-lg mb-3 border border-gray-200 shadow-sm">
                        <Text className="text-gray-600 italic">
                          📝 {group.ghiChu}
                        </Text>
                      </Box>
                    )}
                  </Box>
                }
                suffix={
                  <Button
                    variant="danger"
                    size="small"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.maNhom);
                    }}
                  >
                    🗑️
                  </Button>
                }
              />
            ))}
          </List>
        )}
      </Box>

      <Modal
        visible={createGroupModalVisible}
        title="➕ Tạo Nhóm Mới"
        onClose={() => setCreateGroupModalVisible(false)}
      >
        <Box p={4}>
          <Box mb={3}>
            <Text className="font-semibold mb-2">👥 Tên nhóm:</Text>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nhập tên nhóm..."
            />
          </Box>

          <Box mb={4}>
            <Text className="font-semibold mb-2">📝 Ghi chú:</Text>
            <Input
              value={newGroupNote}
              onChange={(e) => setNewGroupNote(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </Box>

          <Box className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setCreateGroupModalVisible(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleCreateGroup}
              loading={loading}
            >
              {loading ? <Spinner /> : '✨ Tạo Nhóm'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Page>
  );
};

export default ProjectGroupManager; 