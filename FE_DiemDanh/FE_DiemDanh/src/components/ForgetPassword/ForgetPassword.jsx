import { Button, Input, Page, useNavigate } from "zmp-ui"
import "./ForgetPassword.scss"
import { useState } from "react"
import axios from "axios"
import { url } from "../../AppConfig/AppConfig"

const ForgetPassword = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSucess] = useState(false)
    const [isFailed, setIsFailed] = useState(false)
    

    const handleSendEmail = async () => {
        setIsLoading(true)
        setIsSucess(false)
        setIsFailed(false)

        try {
            const response = await axios.post(`${url}/api/auth/reset-password?email=${email}`)
            console.log(response);
            setIsSucess(true)

        } catch (error) {
            console.log(error);
            setIsFailed(true)
        }
        setIsLoading(false)
    }


    return (
        <Page>
            <div className="forgetContainer">
                <h1 className="title">Quên mật khẩu</h1>
                <p className="des">Nhập Email tài khoản của bạn </p>
                <p className="des">Hệ thống sẽ gửi thông tin đăng nhập mới đến email của bạn</p>
                <Input placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} />
                {
                    isLoading && "Đang tải ...."
                }
                {
                    isSuccess &&
                    "Vui lòng check email và quay lại phần đăng nhập"
                }
                {isFailed && "Email không tồn tại trong ứng dụng"}
                <div className="btn-container">
                    <Button className="btn-code" onClick={handleSendEmail}>Lấy mật khẩu</Button>
                </div>
                <div className="btn-container">
                    <Button className="btn-home" variant="secondary" onClick={() => navigate("/")}>Quay lại đăng nhập</Button>
                </div>
            </div>
        </Page>
    )
}

export default ForgetPassword