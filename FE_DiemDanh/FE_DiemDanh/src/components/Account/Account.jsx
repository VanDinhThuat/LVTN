import { useEffect, useState } from "react";
import { Button, Page, useNavigate } from "zmp-ui";
import "./Account.scss";
import axios from "axios";
import { url } from "../../AppConfig/AppConfig";

const Account = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
    }, []);
    

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleGetOTPCode = async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const response = await axios.post(`${url}/api/admin/otp`, {
                email: user.email,
            });
            const { data } = response;
            console.log(data);

            navigate(`/change-pass?otp=${data}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeInfo = () => {
        if (user.role === "teacher") {
            navigate(`/teacherProfile?teacherId=${user.userId}&isDelete=false`)
        }
        else {
            navigate(`/studentProfile?studentId=${user.userId}&isDelete=false`)
        }
    }

    return (
        <Page className="account-page">
            <div className="account-container">
                <h1 className="account-title">Thông Tin Tài Khoản</h1>

                {user && (
                    <div className="account-info">
                        <div className="info-item">
                            <span className="label">Mã tài khoản:</span>
                            <span className="value">{user.userId}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Tên tài khoản:</span>
                            <span className="value">{user.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">{user.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Quyền hạn:</span>
                            <span className="value">{user.role}</span>
                        </div>
                    </div>
                )}

                <div className="account-actions">
                    {
                        user && user.role!=="admin" && (
                            <Button
                                variant="primary"
                                className="btn-action"
                                onClick={handleChangeInfo}
                                disabled={isLoading}
                            >
                                Sửa thông tin
                            </Button>
                        )
                    }

                    <Button
                        variant="primary"
                        className="btn-action"
                        onClick={handleGetOTPCode}
                        disabled={isLoading}
                    >
                        Đổi mật khẩu
                    </Button>
                    <Button
                        variant="danger"
                        className="btn-action"
                        onClick={handleLogout}
                        disabled={isLoading}
                    >
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </Page>
    );
};

export default Account;
