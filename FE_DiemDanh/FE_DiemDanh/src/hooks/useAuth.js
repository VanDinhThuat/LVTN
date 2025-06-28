import { useNavigate } from 'zmp-ui'
import { DeviceManager } from '../utils/deviceManager'

export const useAuth = () => {
    const navigate = useNavigate()

    const logout = () => {
        DeviceManager.logout()
        navigate('/login')
    }

    const getCurrentUser = () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    }

    const isAuthenticated = () => {
        const user = getCurrentUser()
        if (!user) return false
        
        return DeviceManager.validateDeviceSession()
    }

    const getCurrentDeviceUser = () => {
        return DeviceManager.getCurrentLoggedInUser()
    }

    const isDeviceLoggedIn = () => {
        return DeviceManager.isDeviceLoggedIn()
    }

    return {
        logout,
        getCurrentUser,
        isAuthenticated,
        getCurrentDeviceUser,
        isDeviceLoggedIn
    }
} 