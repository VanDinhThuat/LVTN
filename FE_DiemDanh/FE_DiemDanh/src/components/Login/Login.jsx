import { Button, Icon, Input, Text, useNavigate, Page } from "zmp-ui"
import "./Login.scss"
import { useState } from "react"
import axios from "axios"
import { url } from "../../AppConfig/AppConfig"

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()


    const handleLoginUser = async () => {
        setError("")
        const useData = {
            username, password
        }
        try {
            const response = await axios.post(`${url}/api/auth/login`, useData)
            const {data} = response
            localStorage.setItem("user", JSON.stringify(data.user))
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
            setError("Tài khoản hoặc mật khẩu không đúng")
        }
    }

    return (
        <Page className="loginContainer" header={{ title: "My App", leftButton: false, actionBarHidden: true }}>
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