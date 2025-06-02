import { Avatar, Box, Text, useNavigate } from "zmp-ui"

import "./teacher.scss"

const TeacherCard = ({teacher}) => {
    const navigate = useNavigate()

    const handleToProfile = ()=>{
        navigate(`/teacherProfile?teacherId=${teacher.userId}`)
    }

    return (
        <Box onClick={handleToProfile}>
            <Box className="teacherCardContainer">
                <Box>
                    <Avatar size={64} src="https://png.pngtree.com/png-vector/20190129/ourlarge/pngtree-cartoon-minimalist-teachers-day-teaching-book-scene-teacher-graphic-element-daythe-png-image_567883.jpg" />
                </Box>
                <Box>
                    <Text className="text-teacherCard">{teacher.userId}</Text>
                    <Text className="text-teacherCard">{teacher.fullName}</Text>
                    <Text className="text-teacherCard">{teacher.phone}</Text>
                    <Text className="text-teacherCard">Chức vụ: Giảng viên</Text>
                </Box>
            </Box>
        </Box>
    )
}

export default TeacherCard