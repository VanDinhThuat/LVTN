import { Text, Box } from "zmp-ui"

const DevicePolicyNotice = () => {
    return (
        <Box style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '15px'
        }}>
            <Text style={{
                fontSize: '13px',
                color: '#856404',
                lineHeight: '1.4'
            }}>
                <strong>📱 Chính sách bảo mật:</strong><br/>
                Mỗi thiết bị chỉ được đăng nhập 1 tài khoản để đảm bảo tính minh bạch trong điểm danh. 
                Nếu cần đăng nhập tài khoản khác, vui lòng đăng xuất tài khoản hiện tại trước.
            </Text>
        </Box>
    )
}

export default DevicePolicyNotice 