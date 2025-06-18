import { Box, Text, useNavigate } from "zmp-ui";
import "./sessionCard.scss";
import { useEffect } from "react";

const SessionCard = ({s}) => {
    const navigate = useNavigate();
    
    const handleToGroupDetails = () => {
        navigate(`/teacher/group?groupId=${s.sessionId}`);
    };

    useEffect(() => {
        console.log(s);
    }, []);

    // Kiểm tra xem có phải môn đồ án không để hiển thị indicator
 
        

    return (
        <Box className="sessionCardContainer" onClick={handleToGroupDetails}>
            <Box className="sessionCardContent">
                <Box className="sessionCardHeader">
                    <Text className="subjectName">{s.subjectName}</Text>
                    <Text className="sessionTime">{s.thu} ca {s.startPeriod}_{s.endPeriod}</Text>
                </Box>
                
                <Box className="sessionCardBody">
                    <Box className="joinCode">
                        <Text className="label">Mã tham gia:</Text>
                        <Text className="value">{s.maThamGia}</Text>
                    </Box>
                    
                    {s.subjectCode && (
                        <Box className="subjectCode">
                            <Text className="label">Mã môn:</Text>
                            <Text className="value">{s.subjectCode}</Text>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default SessionCard;