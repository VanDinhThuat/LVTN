import { Box, Text, useNavigate } from "zmp-ui"
import "./SubjectCard.scss"
const SubjectCard = ({ s }) => {

    const navigate = useNavigate()

    return (
        <Box className="subjectCardContainer" onClick={() => navigate(`/subject-details?id=${s.subjectId}`)}>
            <Box>
                <Text>Mã môn học: {s.subjectId}</Text>
                <Text>Môn học: {s.subjectName}</Text>
                <Text>Khoa: Công nghệ thông tin</Text>
            </Box>
        </Box>
    )
}

export default SubjectCard