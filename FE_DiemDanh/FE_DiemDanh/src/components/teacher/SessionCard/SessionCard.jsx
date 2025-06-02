import { Box, Text, useNavigate } from "zmp-ui"
import "./sessionCard.scss"
import { useEffect } from "react"

const SessionCard = ({s})=>{

    const navigate = useNavigate()

    const handleToGroupDetails = ()=>{
        navigate(`/teacher/group?groupId=${s.sessionId}`)
    }

    useEffect(()=>{
        console.log(s);
        
    }, [])

    return (
        <Box className="sessionCardContainer" onClick={handleToGroupDetails}>
            <Box>
                <Text>{s.roomName}</Text>
                <Text>Tên môn: {s.subjectName} {s.thu} ca {s.startPeriod}_{s.endPeriod}</Text>
                <Text>Mã tham gia: {s.maThamGia}</Text>

            </Box>
        </Box>
    )
}

export default SessionCard