import { Box, Button, Input, Page, Select, Text, useLocation, useNavigate } from "zmp-ui";
import "./studentProfile.scss";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";
import { useEffect, useState } from "react";
const { OtpGroup, Option } = Select;


const StudentProfile = () => {
    const location = useLocation();
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStudent, setEditedStudent] = useState({});
    const [classs, setClasss] = useState([])
    const [classId, setClassId] = useState()
    const [fullName, setFullName] = useState("")
    const [sdt, setSdt] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [isDelete, setIsdelete] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getStudentById();
        getAllLopHoc()
        const params = new URLSearchParams(location.search)
        
        if(params.get("isDelete")){
            
            setIsdelete(params.get("isDelete"))
            setIsEditing(true)
        }
    }, []);
    useEffect(() => {
        if (student) {
            setFullName(student.fullName)
            setEmail(student.email)
            setSdt(student.phone)
        }
    }, [student])

    const getAllLopHoc = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/classes`)
            const { data } = response
            setClasss(data)

        } catch (error) {
            console.log(error);

        }
    }

    const getStudentById = async () => {
        const params = new URLSearchParams(location.search);
        try {
            const response = await axios.get(`${url}/api/admin/profile?id=${params.get("studentId")}`);
            const { data } = response;
            setStudent(data);
            setEditedStudent(data);
            setClassId(data.classId)
            console.log(data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateUser = async () => {
        setMessage("")
        try {
            await axios.put(`${url}/api/admin/users/${student.userId}`,
                {
                    fullName,
                    sdt,
                    email,
                    maLop: classId
                }
            )
            const params = new URLSearchParams(location.search)
            if (params.get("isDelete")) {
              const nguoidung = JSON.parse(localStorage.getItem("user"))
                getUser(nguoidung.userId)
              navigate("/student")
            }
            else{
                navigate("/admin")
            }
        } catch (error) {
            console.log(error);
            setMessage("Loi vui long thu lai sau")
        }
    }
    const getUser = async(id)=>{
        try {
            const response = await axios.get(`${url}/api/admin/nguoi-dung?id=${id}`)
            const {data} = response
            localStorage.setItem("user", JSON.stringify(data.user))
            
        } catch (error) {
            
        }        
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.patch(`${url}/api/admin/users/${student.userId}`, editedStudent);
            setStudent(editedStudent);
            setIsEditing(false);
            alert("Cập nhật thành công");
        } catch (error) {
            console.log(error);
            alert("Có lỗi xảy ra khi cập nhật");
        }
    };

    const handleDeleteTeacher = async () => {
        setMessage("")
        try {
            const params = new URLSearchParams(location.search);
            await axios.delete(`${url}/api/admin/users/${student.userId}`);
            navigate("/admin")
        } catch (error) {
            setMessage("Sinh viên này đang còn học");
            console.log(error);
        }
    };

    return (
        <Page>
            <Box className="studentProfileContainer">
                <Box className="profileHeader">
                    <Box className="imageProfile">
                        <img
                            src="https://png.pngtree.com/element_our/20190603/ourlarge/pngtree-teenage-college-graduation-season-image_1443255.jpg"
                            alt="Student Profile"
                            className="profileImage"
                        />
                    </Box>
                    {student && (
                        <Box className="text">
                            {isEditing ? (
                                <>
                                    <Input
                                        label="MSSV"
                                        value={editedStudent.userId}
                                        disabled
                                    />
                                    <Input
                                        label="Tên sinh viên"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                    />
                                    <Input
                                        label="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <Input
                                        label="Số điện thoại"
                                        value={sdt}
                                        onChange={e => setSdt(e.target.value)}
                                    />
                                    <Text className="studentInfo">Khoa: Công nghệ thông tin</Text>
                                    <div className="list-class">
                                        <Select
                                            label="Lớp học"
                                            placeholder="Chọn lớp"
                                            defaultValue={classId}
                                            onChange={(value) => setClassId(value)}
                                        >

                                            <OtpGroup label="Group 1">
                                                {
                                                    classs.length > 0 &&
                                                    classs.map((item, index) => (<Option value={item.classId} title={item.className} />
                                                    ))
                                                }
                                            </OtpGroup>

                                        </Select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Text className="studentInfo">MSSV: {student.userId}</Text>
                                    <Text className="studentInfo">Tên sinh viên: {student.fullName}</Text>
                                    <Text className="studentInfo">Email: {student.email}</Text>
                                    <Text className="studentInfo">Số điện thoại: {student.phone}</Text>
                                    <Text className="studentInfo">Khoa: Công nghệ thông tin</Text>
                                    <Text className="studentInfo">Lớp: {student.className}</Text>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
                <p className="text-red">{message && message}</p>

                {student && (
                    <Box className="actionButtons">
                        {isEditing ? (
                            <Button type="primary" onClick={handleUpdateUser}>Lưu</Button>
                        ) : (
                            <div className="btn-s">
                                { isDelete && <Button type="danger" variant="secondary" onClick={handleDeleteTeacher} className="btn-l">Xóa</Button>}

                                <Button type="primary" variant="secondary" onClick={handleEditClick}>Chỉnh sửa</Button>

                            </div>
                        )}
                    </Box>
                )}
            </Box>
        </Page>
    );
};

export default StudentProfile;
