import { Button, Icon, Input, Text, useNavigate, Page } from "zmp-ui"
import "./Login.scss"
import { useState, useEffect } from "react"
import axios from "axios"
import { url } from "../../AppConfig/AppConfig"
import { DeviceManager } from "../../utils/deviceManager"

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isDeviceLoggedIn, setIsDeviceLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState("")
    const navigate = useNavigate()

    // Kiểm tra trạng thái thiết bị khi component mount
    useEffect(() => {
        const deviceInfo = DeviceManager.getDeviceInfo();
        if (deviceInfo) {
            const currentDeviceId = DeviceManager.generateDeviceFingerprint();
            
            // Nếu device ID không khớp (có thể do thay đổi browser hoặc xóa cache)
            if (deviceInfo.deviceId !== currentDeviceId) {
                DeviceManager.clearDeviceInfo();
                setIsDeviceLoggedIn(false);
                setCurrentUser("");
            } else {
                setIsDeviceLoggedIn(true);
                setCurrentUser(deviceInfo.username);
            }
        }
    }, []);

    const handleLoginUser = async () => {
        setError("")
        
        // Kiểm tra xem có thể đăng nhập với username này không
        if (!DeviceManager.canLoginWithUsername(username)) {
            const currentLoggedInUser = DeviceManager.getCurrentLoggedInUser();
            setError(`Thiết bị này đã được đăng nhập bởi tài khoản: ${currentLoggedInUser}. Vui lòng đăng xuất tài khoản cũ trước khi đăng nhập tài khoản mới.`);
            return;
        }

        const useData = {
            username, 
            password,
            deviceId: DeviceManager.getDeviceId() // Gửi device ID lên server
        }
        
        try {
            const response = await axios.post(`${url}/api/auth/login`, useData)
            const {data} = response
            
            // Lưu thông tin user và device
            localStorage.setItem("user", JSON.stringify(data.user))
            DeviceManager.saveDeviceInfo(username)
            
            // Cập nhật state
            setIsDeviceLoggedIn(true);
            setCurrentUser(username);
            
            if(data.role === "admin"){
                navigate("/admin")
            }
            else if(data.role === "teacher"){
                navigate("/teacher")
            }
            else{
                navigate("/homestu")
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Tài khoản hoặc mật khẩu không đúng")
            }
        }
    }

    // Hàm để đăng xuất tài khoản hiện tại
    const handleLogoutCurrentUser = () => {
        DeviceManager.logout();
        setIsDeviceLoggedIn(false);
        setCurrentUser("");
        setError("");
    }

    return (
        <Page className="loginContainer" header={{ title: "My App", leftButton: "none" }}>
            <div>
               
            </div>
            <div className="inputLogin">
                <div className="usernameContainer">
                    <Icon icon="zi-user" className="icon-username" />
                    <Input onChange={e => setUsername(e.target.value)} className="usernameInput" placeholder="Tên đăng nhập" value={username} />
                </div>
                <div className="usernameContainer">
                    <Input type="password" onChange={e => setPassword(e.target.value)} className="usernameInput" placeholder="Mật khẩu" value={password} />
                    <Icon icon="zi-lock" className="icon-username" />
                </div>
                <p className="err">{error && error}</p>
                
                {/* Hiển thị thông tin tài khoản hiện tại và nút đăng xuất */}
                {isDeviceLoggedIn && (
                    <div className="currentUserContainer" style={{ 
                        marginBottom: '15px', 
                        padding: '10px', 
                        backgroundColor: '#f0f0f0', 
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                    }}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text style={{ fontSize: '14px', color: '#666' }}>
                                Thiết bị đang đăng nhập: <strong>{currentUser}</strong>
                            </Text>
                        </div>
                        <Button 
                            className="btn-logout" 
                            onClick={handleLogoutCurrentUser}
                            style={{ 
                                backgroundColor: '#ff4444', 
                                color: 'white',
                                fontSize: '12px',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Đăng xuất tài khoản hiện tại
                        </Button>
                    </div>
                )}
                
                <div className="loginContainer">
                    <Button className="btn-login" onClick={handleLoginUser}>Đăng nhập</Button>

                    <div className="forgetPasswordContainer">
                        <Text className="textForgetPassword" onClick={()=>navigate("/forget-password")}>Quên mật khẩu?</Text>
                    </div>
                </div>

            </div>
        </Page>
    )
}

export default Login