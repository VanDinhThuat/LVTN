import { useEffect } from 'react'
import { useNavigate } from 'zmp-ui'
import { DeviceManager } from '../../utils/deviceManager'

const SessionGuard = ({ children }) => {
    const navigate = useNavigate()

    useEffect(() => {
        // Kiểm tra xem có user trong localStorage không
        const user = localStorage.getItem('user')
        if (!user) {
            // Nếu không có user, chuyển về trang login
            navigate('/login')
            return
        }

        // Kiểm tra session của device
        if (!DeviceManager.validateDeviceSession()) {
            // Nếu session không hợp lệ, logout và chuyển về login
            DeviceManager.logout()
            navigate('/login')
            return
        }

        // Kiểm tra xem user hiện tại có khớp với device không
        const userData = JSON.parse(user)
        const currentLoggedInUser = DeviceManager.getCurrentLoggedInUser()
        
        if (currentLoggedInUser && currentLoggedInUser !== userData.username) {
            // Nếu username không khớp, logout và chuyển về login
            DeviceManager.logout()
            navigate('/login')
            return
        }

        // Nếu tất cả đều hợp lệ, tiếp tục render children
    }, [navigate])

    return children
}

export default SessionGuard 