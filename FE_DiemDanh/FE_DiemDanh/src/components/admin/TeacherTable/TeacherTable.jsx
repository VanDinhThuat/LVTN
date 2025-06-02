import { Box, Button, Input, useNavigate } from "zmp-ui";
import TeacherCard from "../TeacherCard/TeacherCard";
import "./teacherTable.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";

const TeacherTable = () => {
    const [teacher, setTeacher] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
    const navigate = useNavigate();

    useEffect(() => {
        getAllTeacher();
    }, []);

    const getAllTeacher = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/users?role=teacher`);
            const { data } = response;
            setTeacher(data);
            setIsLoading(false); 
        } catch (error) {
            console.log(error);
            setIsLoading(false); 
        }
    };

    return (
        <Box className="teacher-page">
            <Box className="teacher-header">
                <Button
                    onClick={() => navigate("/create-teacher")}
                    className="teacher-add-btn"
                >
                    + Thêm giảng viên
                </Button>
            </Box>

            <Box className="teacher-list">
                {isLoading ? (
                    <p className="no-data">Đang tải dữ liệu...</p> // Hiển thị khi đang tải
                ) : teacher.length > 0 ? (
                    teacher.map((item, index) => (
                        <TeacherCard teacher={item} key={index} />
                    ))
                ) : (
                    <p className="no-data">Không có giảng viên nào</p> // Hiển thị khi không có dữ liệu
                )}
            </Box>
        </Box>
    );
};

export default TeacherTable;
