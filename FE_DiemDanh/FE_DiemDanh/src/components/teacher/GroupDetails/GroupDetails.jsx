import { Box, Button, Page, Text, useLocation, useNavigate } from "zmp-ui";
import "./groupDetails.scss";
import StudentCard from "../../admin/StudentCard/StudentCard";
import { getLocation } from "zmp-sdk";
import { useEffect, useState } from "react";
import { url } from "../../../AppConfig/AppConfig";
import axios from "axios";
import DeletedConfirm from "../../Confirm/DeletedConfirm";

const GroupDetails = () => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [tk, setToken] = useState();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [session, setSession] = useState();
  const [student, setStudent] = useState([]);
  const navigate = useNavigate();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [role, setRole] = useState();

  useEffect(() => {
    getSessionById();
    getStudent();
    getUser();
  }, []);

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user.role);
  };

  const openDeleteModal = () => {
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const getSessionById = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/session/getid?id=${params.get("groupId")}`);
      const { data } = response;
      setSession(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudent = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/session/sinh-vien?id=${params.get("groupId")}`);
      const { data } = response;
      setStudent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`${url}/api/admin/sessions/${session.sessionId}`);
      navigate("/teacher")
    } catch (error) {
      console.log(error);
    }
  };

  const getQrCode = async () => {
    try {
      const now = new Date();
      const response = await axios.post(`${url}/api/teacher/create-diemdanh`, {
        buoiHocId: session.sessionId,
        expiredAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
        maNguoidung: JSON.parse(localStorage.getItem("user")).userId,
      });
      const { data } = response;
      navigate(`/create-qrcode?code=${data}`);
    } catch (error) {
      console.error("Lỗi tạo mã QR:", error);
    }
  };

  return (
    <Page className="group-details-page">
      {session && (
        <Box className="group-details-container">
          <Box className="header-info">
            <Text className="group-title">
              Lớp {session.subjectName} - Ca {session.startPeriod} ~ {session.endPeriod}
            </Text>
            <Text className="group-code">Mã tham gia: {session.maThamGia}</Text>
          </Box>

          <Box className="student-list-section">
            <Text className="section-title">Danh sách sinh viên</Text>
            <Box className="student-card-list">
              {student.length > 0 ? (
                student.map((item) => (
                  <StudentCard
                    student={item}
                    sessionId={session.sessionId}
                    key={item}
                    enable={false}
                  />
                ))
              ) : (
                <Text>Chưa có sinh viên nào tham gia.</Text>
              )}
            </Box>
          </Box>

          <Box className="actions-section">
            {(role === "admin" || role === "teacher") && (
              <Box className="action-buttons">
                <Button type="danger" variant="secondary" onClick={openDeleteModal}>
                  Xóa nhóm học
                </Button>
                <Button variant="secondary" onClick={getQrCode}>
                  Tạo mã QR code
                </Button>
                <Button variant="primary" onClick={() => navigate(`/xem-diem-danh?id=${session.sessionId}`)}>
                  Xem điểm danh
                </Button>
              </Box>
            )}

            {role === "student" && (
              <Button variant="primary" onClick={() => navigate(`/list-diem-danh?id=${session.sessionId}`)}>
                Xem lịch sử điểm danh
              </Button>
            )}
          </Box>

          {tk && <Text>{tk}</Text>}
        </Box>
      )}

      {isOpenDeleteModal && (
        <DeletedConfirm
          isOpen={isOpenDeleteModal}
          handleClose={closeDeleteModal}
          handleDelete={handleDeleteGroup}
          text="Bạn có chắc chắn muốn xóa nhóm học này không?"
        />
      )}
    </Page>
  );
};

export default GroupDetails;
