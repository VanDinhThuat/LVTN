# Quản lý thiết bị - Một thiết bị một tài khoản

## Tổng quan
Tính năng này đảm bảo mỗi thiết bị chỉ được đăng nhập 1 tài khoản tại một thời điểm, nhằm ngăn chặn việc bạn bè đăng nhập hộ để quét mã điểm danh.

## Cách hoạt động

### 1. Device Fingerprinting
- Tạo một "vân tay" duy nhất cho mỗi thiết bị dựa trên:
  - User Agent
  - Ngôn ngữ
  - Độ phân giải màn hình
  - Múi giờ
  - Canvas fingerprint
  - Số lõi CPU
  - Bộ nhớ thiết bị
  - Nền tảng

### 2. Kiểm tra đăng nhập
- Khi người dùng đăng nhập, hệ thống kiểm tra:
  - Thiết bị đã được đăng nhập bởi tài khoản khác chưa
  - Nếu có, yêu cầu đăng xuất tài khoản cũ trước

### 3. Session Management
- Lưu trữ thông tin thiết bị trong localStorage
- Tự động logout sau 24 giờ
- Kiểm tra tính hợp lệ của session khi truy cập các trang

## Các file chính

### 1. `src/utils/deviceManager.js`
- Class chính để quản lý thiết bị
- Các phương thức: generateDeviceFingerprint, saveDeviceInfo, validateDeviceSession, etc.

### 2. `src/components/Login/Login.jsx`
- Component đăng nhập với kiểm tra thiết bị
- Hiển thị thông tin tài khoản hiện tại
- Nút đăng xuất tài khoản cũ

### 3. `src/components/Login/DevicePolicyNotice.jsx`
- Component hiển thị thông báo chính sách bảo mật

### 4. `src/components/SessionGuard/SessionGuard.jsx`
- Component bảo vệ session trên tất cả các trang
- Tự động logout nếu session không hợp lệ

### 5. `src/hooks/useAuth.js`
- Custom hook để quản lý authentication
- Cung cấp các phương thức logout, getCurrentUser, etc.

### 6. `src/components/DeviceInfo/DeviceInfo.jsx`
- Component hiển thị thông tin thiết bị và nút logout

## Cách sử dụng

### 1. Trong component Login
```jsx
import { DeviceManager } from "../../utils/deviceManager"

// Kiểm tra trước khi đăng nhập
if (!DeviceManager.canLoginWithUsername(username)) {
    setError("Thiết bị đã được đăng nhập bởi tài khoản khác")
    return
}

// Lưu thông tin sau khi đăng nhập thành công
DeviceManager.saveDeviceInfo(username)
```

### 2. Sử dụng SessionGuard
```jsx
import SessionGuard from '../SessionGuard/SessionGuard'

// Wrap các trang cần bảo vệ
<SessionGuard>
    <YourProtectedComponent />
</SessionGuard>
```

### 3. Sử dụng useAuth hook
```jsx
import { useAuth } from '../../hooks/useAuth'

const { logout, getCurrentUser, isAuthenticated } = useAuth()
```

## Tính năng bảo mật

### 1. Device Fingerprinting
- Tạo ID duy nhất cho mỗi thiết bị
- Khó bị giả mạo hoặc bypass

### 2. Session Validation
- Kiểm tra tính hợp lệ của session
- Tự động logout khi session hết hạn

### 3. User-Device Binding
- Liên kết chặt chẽ giữa user và device
- Ngăn chặn đăng nhập nhiều tài khoản trên cùng thiết bị

## Lưu ý

1. **Browser Privacy**: Người dùng có thể bypass bằng cách:
   - Xóa localStorage
   - Sử dụng chế độ ẩn danh
   - Thay đổi browser

2. **Mobile Apps**: Tính năng hoạt động tốt trên mobile apps vì ít bị thay đổi browser

3. **Server-side Validation**: Nên kết hợp với validation phía server để tăng tính bảo mật

## Cấu hình

### Session Timeout
Có thể thay đổi thời gian session timeout trong `DeviceManager.validateDeviceSession()`:
```javascript
// Session timeout sau 24 giờ
if (hoursDiff > 24) {
    this.clearDeviceInfo()
    return false
}
```

### Device Fingerprint
Có thể thêm/bớt các thuộc tính trong `generateDeviceFingerprint()` để tăng/giảm độ chính xác. 