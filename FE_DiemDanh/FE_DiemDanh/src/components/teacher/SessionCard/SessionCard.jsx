import { Box, Text, useNavigate } from "zmp-ui";
import "./sessionCard.scss";
import { useEffect } from "react";

const SessionCard = ({s}) => {
    const navigate = useNavigate();
    
    const handleToGroupDetails = () => {
        // Kiểm tra mã môn học
        if (s.subjectCode) {
            const subjectCode = s.subjectCode.toUpperCase();
            if (subjectCode === 'DACN' || subjectCode === 'DA') {
                // Chuyển đến trang tuần nộp bài cho môn DACN/DA
                navigate(`/tuan-nop-bai?maBuoiHoc=${s.sessionId || s.id}`);
                return;
            }
        }
        
        
        if (s.subjectName) {
            const subjectName = s.subjectName.toUpperCase();
            if (subjectName.includes('ĐỒ ÁN') || 
                subjectName.includes('DO AN') || 
                subjectName.includes('DACN') || 
                subjectName.includes('DA ') ||
                subjectName.startsWith('DA')) {
                navigate(`/tuan-nop-bai?maBuoiHoc=${s.sessionId || s.id}`);
                return;
            }
        }
        
       
        navigate(`/teacher/group?groupId=${s.sessionId}`);
    };

    useEffect(() => {
        console.log(s);
    }, []);

    // Kiểm tra xem có phải môn đồ án không để hiển thị indicator
    const isProjectSubject = () => {
        if (s.subjectCode) {
            const subjectCode = s.subjectCode.toUpperCase();
            return subjectCode === 'DACN' || subjectCode === 'DA';
        }
        
        if (s.subjectName) {
            const subjectName = s.subjectName.toUpperCase();
            return subjectName.includes('ĐỒ ÁN') || 
                   subjectName.includes('DO AN') || 
                   subjectName.includes('DACN') || 
                   subjectName.includes('DA ') ||
                   subjectName.startsWith('DA');
        }
        
        return false;
    };

    return (
        <Box className="sessionCardContainer" onClick={handleToGroupDetails}>
            <Box>
                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Text style={{ fontWeight: 'bold' }}>{s.roomName}</Text>
                    {isProjectSubject() && (
                        <Text style={{ 
                            fontSize: '12px', 
                            padding: '2px 6px', 
                            backgroundColor: '#e8f5e8', 
                            color: '#2d5a2d', 
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}>
                            📝 Đồ án
                        </Text>
                    )}
                </Box>
                <Text>Tên môn: {s.subjectName} {s.thu} ca {s.startPeriod}_{s.endPeriod}</Text>
                <Text>Mã tham gia: {s.maThamGia}</Text>
                {s.subjectCode && (
                    <Text style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                        Mã môn: {s.subjectCode}
                    </Text>
                )}
                {isProjectSubject() && (
                    <Text style={{ 
                        fontSize: '12px', 
                        color: '#007bff', 
                        fontStyle: 'italic',
                        marginTop: '4px'
                    }}>
                        Click để xem tuần nộp bài
                    </Text>
                )}
            </Box>
        </Box>
    );
};

export default SessionCard;