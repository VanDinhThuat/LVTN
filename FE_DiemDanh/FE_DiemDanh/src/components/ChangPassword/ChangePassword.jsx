import { useEffect, useState } from "react";
import "./ChangePassword.scss";
import { useLocation } from "zmp-ui";
import axios from "axios";
import { url } from "../../AppConfig/AppConfig";

const ChangePassword = () => {

    const location = useLocation()
    const [otp, setOtp] = useState()
    const [pass, setPass] = useState("")
    const [error, setError] = useState("");
    const [isSeccess, setIsSuccess] =  useState(false)


    useEffect(() => {

    }, [])

    const validatePassword = () => {
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasLength = pass.length >= 8;
        return hasUpperCase && hasLowerCase && hasLength;
    };


    const handleChangePass = async () => {
        setIsSuccess(false)
        setError("");
        if (!validatePassword()) {
            console.log(pass);
            
            setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và chữ thường.");
            return;
        }
        const params = new URLSearchParams(location.search)
        if (params.get("otp") !== otp) {
            setError("Mã OTP không khớp với mã chúng tôi gửi về gmail bạn");
            return
        }

        const user = JSON.parse(localStorage.getItem("user"))

        try {
            await axios.post(`${url}/api/admin/change-pass`, {
                maNguoiDung:user.userId,
                newPassword: pass
            })
            setIsSuccess(true)
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="change-password-container">
            <h2>Đổi mật khẩu</h2>
            <div className="change-password-form">
                <div className="form-group">
                    <label htmlFor="otp">Mã OTP</label>
                    <input type="text" id="otp" placeholder="Nhập mã OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input value={pass} onChange={(e)=>setPass(e.target.value)} type="password" id="newPassword" placeholder="Nhập mật khẩu mới" />
                </div>
                <p>{error && error}</p>
                <p>{isSeccess && "Thành công!!! Lần đăng nhập tiếp theo mật khẩu sẽ là mật khẩu mới"}</p>
                <button onClick={handleChangePass}>Xác nhận đổi mật khẩu</button>
            </div>
        </div>
    );
};

export default ChangePassword;
