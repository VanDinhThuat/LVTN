import { Box, Button, Input, Page, Text, useLocation, useNavigate } from "zmp-ui";
import "./teacherProfile.scss";
import DeletedTeacherConfirmModal from "../ConfirmModal/DeletedTeacherConfirm";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";

const TeacherProfile = () => {
    const [isOpenDeletedConfirmModal, setIsOpenDeletedConfirmModal] = useState(false);
    const location = useLocation();
    const [teacher, setTeacher] = useState();
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [sdt, setsdt] = useState("")
    const [isDelete, setIsdelete] = useState(false)


    useEffect(() => {
        getTeacherById();
        const params = new URLSearchParams(location.search)


        if (params.get("isDelete")) {

            setIsdelete(params.get("isDelete"))
            setIsEditing(true)
        }
        

    }, []);
    useEffect(() => {
        if (teacher) {
            setFullName(teacher.fullName)
            setEmail(teacher.email)
            setsdt(teacher.phone)
        }

    }, [teacher

    ])

    const getTeacherById = async () => {
        const params = new URLSearchParams(location.search);
        
        try {
            const response = await axios.get(`${url}/api/admin/profile?id=${params.get("teacherId")}`);
            const { data } = response;
            setTeacher(data);
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteTeacher = async () => {
        setMessage("")
        try {
            const params = new URLSearchParams(location.search);
            await axios.delete(`${url}/api/admin/users/${params.get("teacherId")}`);
            navigate("/admin")
            setMessage("Đã xóa thành công");
        } catch (error) {
            setMessage("Giảng viên này đang còn dạy một buổi học");
            console.log(error);
        }
    };

    const handleCloseDeletedModal = () => {
        setIsOpenDeletedConfirmModal(false);
    };

    const handleOpenDeletedModal = () => {
        setIsOpenDeletedConfirmModal(true);
    };

    const handleChangeField = (field, value) => {
        setTeacher((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateUser = async () => {
        setMessage("")
        console.log(teacher.userId);

        try {
            await axios.put(`${url}/api/admin/users/${teacher.userId}`,
                {
                    fullName,
                    sdt,
                    email,
                    maLop: "",
                }
            )
            const params = new URLSearchParams(location.search)
            if (params.get("isDelete")) {
              const nguoidung = JSON.parse(localStorage.getItem("user"))
                getUser(nguoidung.userId)
                navigate("/teacher")
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

    return (
        <Page className="teacherProfile">
            <Box className="teacherProfileContainer">
               
                <Box className="right">
                    {teacher && (
                        <div>
                            {isEditing ? (
                                <>
                                    <Input
                                        label="Họ tên"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    <Input
                                        label="Khoa"
                                        value="Công nghệ thông tin"
                                        disabled
                                    />
                                    <Input
                                        label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Input
                                        label="Số điện thoại"
                                        value={sdt}
                                        onChange={(e) => setsdt(e.target.value)}
                                    />
                                    <Input
                                        label="Học vị"
                                        value="Thạc sỹ"
                                        disabled
                                    />
                                    <Button onClick={handleUpdateUser}>Lưu</Button>
                                </>
                            ) : (
                                <>
                                    <Text className="text-profile">Họ tên: {teacher.fullName}</Text>
                                    <Text className="text-profile">Khoa: Công nghệ thông tin</Text>
                                    <Text className="text-profile">Email: {teacher.email}</Text>
                                    <Text className="text-profile">Số điện thoại: {teacher.phone}</Text>
                                    <Text className="text-profile">Học vị: Thạc sỹ</Text>
                                </>
                            )}
                        </div>

                    )}
                </Box>
            </Box>

            <p className="text-red">{message && message}</p>

            <Box className="bottom">
                {
                    !isDelete && <Button variant="secondary" type="danger" onClick={handleDeleteTeacher}>
                        Xóa
                    </Button>
                }

                {
                    !isEditing &&  <Button variant="secondary" className="btn-r" onClick={handleEditClick}>
                    Thay đổi
                </Button>
                }
               
            </Box>

            <DeletedTeacherConfirmModal
                isOpen={isOpenDeletedConfirmModal}
                handleClose={handleCloseDeletedModal}
                handleDelete={handleDeleteTeacher}
                text="Bạn có chắc chắn muốn xóa giảng viên này không?"
            />
        </Page>
    );
};

export default TeacherProfile;
