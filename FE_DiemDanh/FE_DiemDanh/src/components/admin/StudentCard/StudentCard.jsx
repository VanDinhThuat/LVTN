import { Avatar, Box, Icon, Text, useNavigate } from "zmp-ui"
import "./studentCard.scss"
import DeletedConfirm from "../../Confirm/DeletedConfirm"
import { useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const StudentCard = ({ student, enable = true, sessionId=null }) => {

    const navigate = useNavigate()
    const [isOpenDeletedModal, setIsOpenDeletedModal] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))

    const openDeletedModal = ()=>{
        setIsOpenDeletedModal(true)
    }
    
    const closeDletedModal = ()=>{
        setIsOpenDeletedModal(false)
    }
    

    const handleToStudentProfile = () => {
        if (!enable) {
            return
        }
        navigate(`/studentProfile?studentId=${student.userId}`)
    }

    const handleDelStudent = async()=>{
        try {          
          await axios.get(`${url}/api/admin/delete/student?studentId=${student.userId}&sessionId=${sessionId}`)
            navigate("/teacher")
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <div>
            <Box onClick={handleToStudentProfile} className={`${enable ? 'ano' : ''} studentCardContainer`}>
                <Avatar size={64} src="https://png.pngtree.com/element_our/20190603/ourlarge/pngtree-teenage-college-graduation-season-image_1443255.jpg" />
                <Box className="text">
                    <Text>Mã sinh viên: {student.userId}</Text>
                    <Text>Tên sinh viên: {student.fullName}</Text>
                    <Text>Lớp: {student.className}</Text>
                </Box>
                {
                    !enable && user.role!=="student"&&
                    <Icon onClick={openDeletedModal} icon="zi-close-circle-solid" className="icon" />

                }
            </Box>

            {
                !enable && 
                <DeletedConfirm isOpen={isOpenDeletedModal} handleClose={closeDletedModal} handleDelete={handleDelStudent} text="Bạn có chắc muốn xóa sinh viên này ra khỏi lớp học?" />

            }
        </div>
    )
}

export default StudentCard