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
  Select
} from 'zmp-ui';
import axios from 'axios';
import { url } from '../../../AppConfig/AppConfig';
import { useNavigate } from 'react-router-dom';
const { OtpGroup, Option } = Select;

const ProjectClassManager = () => {
  // States
  const [classes, setClasses] = useState([]);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [classStartDate, setClassStartDate] = useState('');
  const [classDuration, setClassDuration] = useState(15);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const { openSnackbar } = useSnackbar();
  const navigate = useNavigate();
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    
  }, []);

  const showSnackbar = (message, type = 'success') => {
    openSnackbar({
      text: message,
      type: type,
      duration: 3000
    });
  };

  // Fetch all subjects from API
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/subjects`);
        const { data } = response;
        const filteredSubjects = data.filter(
        (subject) => subject.subjectId ==="DA"|| subject.subjectId === "DACN"
            );
            console.log(data);

      setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        showSnackbar('Không thể tải danh sách môn học!', 'error');
      }
    };

  // Fetch all rooms from API
  

  // Fetch all classes from API
  const fetchClasses = async () => {
    setPageLoading(true);
    try {
      const response = await axios.get(`${url}/api/admin/sessions`);
      const { data } = response;
        const filteredclass = data.filter(
        (subject) => subject.subjectId ==="DA" || subject.subjectId === "DACN"
        );
            console.log(data);
            setClasses(filteredclass);
      
      // Transform API data to match component structure
      const transformedClasses = filteredclass.map(project => ({
        id: project.sessionId || project.projectId,
        classId: project.sessionId || project.projectId,
        name: `${project.subjectName}`,
        //description: `Lớp học ${project.subjectName} tại ${project.roomName}, ${project.thu} từ tiết ${project.startPeriod} đến ${project.endPeriod}`,
        startDate: project.ngayBatDau,
        endDate: project.ngayKetThuc,
        duration: project.soBuoi || 15,
        studentCount: project.totalStudents || 0,
        createdDate: project.ngayBatDau,
        subjectId: project.subjectId,
        subjectName: project.subjectName,
        roomId: project.roomId,
        roomName: project.roomName,
        startPeriod: project.startPeriod,
        endPeriod: project.endPeriod,
        thu: project.thu,
        maThamGia: project.maThamGia,
        gvId: project.gvId,
        classIds: project.classIds || []
      }));
      
      setClasses(transformedClasses);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showSnackbar('Không thể tải danh sách lớp học!', 'error');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!selectedSubjectId.trim() || !classStartDate) {
      showSnackbar('Vui lòng điền đầy đủ thông tin lớp học!', 'error');
      return;
    }

    if (!classDuration || classDuration < 1) {
      showSnackbar('Thời lượng lớp học phải lớn hơn 0!', 'error');
      return;
    }

    setLoading(true);

    try {
      // Calculate end date based on duration (in weeks)
      const startDate = new Date(classStartDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (classDuration * 7));

      const currentUser = JSON.parse(localStorage.getItem("user"));
      
      // Generate a random participation code
      const maThamGia = Math.random().toString(36).substr(2, 8).toUpperCase();

      // Find selected subject and room
      const selectedSubject = subjects.find(sub => sub.subjectId === selectedSubjectId);
      const selectedRoom = rooms.find(room => room.roomId === selectedRoomId);

      const newProjectData = {
        subjectId: selectedSubjectId,
        subjectName: selectedSubject?.subjectName || "Môn học",
        // roomId: selectedRoomId,
        // roomName: selectedRoom?.roomName || "Phòng học",
        // startPeriod: 1, // Default values
        // endPeriod: 3,
        // thu: "Thu 2", // Default day
        maThamGia: maThamGia,
        gvId: JSON.parse(localStorage.getItem("user")).userId,
        ngayBatDau: classStartDate,
        //ngayKetThuc: endDate.toISOString().split('T')[0],
        soBuoi: Number(classDuration),
        classIds: [] // Empty for now
      };

      const response = await axios.post(`${url}/api/admin/sessions`, newProjectData);
      
      if (response.status === 200 || response.status === 201) {
        showSnackbar(`Đã tạo lớp "${selectedSubject?.subjectName}" thành công!`);
        
        // Refresh the classes list
        await fetchClasses();

        // Reset form
        setSelectedSubjectId('');
        setSelectedRoomId('');
        setNewClassDescription('');
        setClassStartDate('');
        setClassDuration(15);
        setCreateClassModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      if (error.response && error.response.data && error.response.data.message) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Có lỗi xảy ra khi tạo lớp học!', 'error');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleSelectClass = (classItem) => {
    // Navigate to TuanNopBaiList page with maBuoiHoc parameter
    navigate(`/tuan-nop-bai?maBuoiHoc=${classItem.classId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getClassStatus = (startDate, endDate) => {
    if (!startDate) return { text: 'Chưa xác định', color: 'text-gray-500' };
    
    const start = new Date(startDate);
    const now = new Date();
    
    let end;
    if (endDate) {
      end = new Date(endDate);
    } else {
      // Fallback: calculate end date from start date + duration
      end = new Date(start);
      end.setDate(start.getDate() + (15 * 7)); // Default 15 weeks
    }

    if (now < start) return { text: 'Chưa bắt đầu', color: 'text-gray-500' };
    if (now > end) return { text: 'Đã kết thúc', color: 'text-red-500' };
    return { text: 'Đang diễn ra', color: 'text-green-500' };
  };

  const calculateDurationInWeeks = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Chưa xác định';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return diffWeeks;
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
        {/* Create Class Button */}
        <Box mb={4}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => setCreateClassModalVisible(true)}
          >
            ➕ Tạo Lớp Đồ Án Mới
          </Button>
        </Box>

        {/* Page Title */}
        <Box mb={4} className="text-center">
          <Text size="xxLarge" bold className="text-blue-600">
            📚 Danh Sách Lớp Đồ Án
          </Text>
          <Text className="text-gray-500 mt-2">
            Chọn lớp để xem chi tiết và quản lý lịch trình
          </Text>
        </Box>

        {/* Classes List */}
        {classes.length === 0 ? (
          <Box className="text-center py-12">
            <Text size="large" className="text-gray-400 mb-2">📖</Text>
            <Text className="text-gray-500">Chưa có lớp đồ án nào</Text>
            <Text size="small" className="text-gray-400">
              Hãy tạo lớp đầu tiên để bắt đầu!
            </Text>
          </Box>
        ) : (
          <List>
            {classes.map(classItem => {
              const status = getClassStatus(classItem.startDate, classItem.endDate);
              const durationWeeks = calculateDurationInWeeks(classItem.startDate, classItem.endDate);
              
              return (
                <List.Item
                  key={classItem.id}
                  onClick={() => handleSelectClass(classItem)}
                  className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                  title={
                    <Box>
                      <Box className="flex justify-between items-start mb-2">
                        <Text size="large" bold className="text-blue-600">
                          📚 {classItem.name}
                        </Text>
                        <Text size="small" className={`font-semibold ${status.color}`}>
                          {status.text}
                        </Text>
                      </Box>
                      
                      <Text className="text-gray-600 mb-3">
                        {classItem.description}
                      </Text>
                      
                      <Box className="grid grid-cols-2 gap-4 text-sm">
                        <Box>
                          <Text size="small" className="text-gray-500">
                            🗓️ Bắt đầu: {formatDate(classItem.startDate)}
                          </Text>
                          <Text size="small" className="text-gray-500">
                            ⏱️ Thời lượng: {durationWeeks} tuần
                          </Text>
                        </Box>
                        <Box>
                          <Text size="small" className="text-gray-500">
                            👥 Sinh viên: {classItem.studentCount}
                          </Text>
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
              );
            })}
          </List>
        )}
      </Box>

      {/* Create Class Modal */}
      <Modal
        visible={createClassModalVisible}
        title="➕ Tạo Lớp Đồ Án Mới"
        onClose={() => setCreateClassModalVisible(false)}
      >
        <Box p={4}>
          <Box mb={3}>
            <Text className="font-semibold mb-2">📚 Chọn môn học:</Text>
            <Select
              placeholder="Chọn môn học"
              onChange={(value) => setSelectedSubjectId(value)}
              value={selectedSubjectId}
            >
              <OtpGroup label="Danh sách môn học">
                {
                  subjects.length > 0 &&
                  subjects.map((item, index) => (
                    <Option key={index} value={item.subjectId} title={item.subjectName} />
                  ))
                }
              </OtpGroup>
            </Select>
          </Box>


          <Box mb={3}>
            <Text className="font-semibold mb-2">📋 Mô tả:</Text>
            <Input
              value={newClassDescription}
              onChange={(e) => setNewClassDescription(e.target.value)}
              placeholder="Mô tả chi tiết về lớp đồ án..."
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
            <Text className="font-semibold mb-2">⏱️ Thời lượng (tuần):</Text>
            <Input
              type="number"
              value={classDuration}
              onChange={(e) => setClassDuration(parseInt(e.target.value))}
              min="1"
              max="52"
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