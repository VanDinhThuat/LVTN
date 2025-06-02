import { Box, Text, useNavigate } from "zmp-ui"
import "./classCard.scss"

const ClassCard = ({classs})=>{

    const navigate = useNavigate()

    return (
        <Box>
            <Box className="classCardContainer" onClick={()=>navigate(`/class-details?id=${classs.classId}`)}>
                <Text>Mã lớp học: {classs.classId}</Text>
                <Text>Tên lớp học: {classs.className}</Text>
                
            </Box>
        </Box>
    )
}

export default ClassCard