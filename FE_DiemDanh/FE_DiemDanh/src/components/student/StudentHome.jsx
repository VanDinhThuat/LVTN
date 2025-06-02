import { Box, Button, Input, Page, useNavigate } from "zmp-ui";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from "axios";
import { url } from "../../AppConfig/AppConfig";
import SessionCard from "../teacher/SessionCard/SessionCard";
import "./student.scss";
import ErrorBoundary from "../ErrorBoudary/ErrorBoudary";

const StudentHome = () => {
    const navigate = useNavigate();
    const [sesision, setSession] = useState([]);
    const [maThamGia, setMaThamGia] = useState("");
    const [isSuccess, setIsSucess] = useState(false);
    const [qrResult, setQrResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleScan = (result) => {
        if (result && !isProcessing && !qrResult) {
            setIsProcessing(true);
            setQrResult(result.text);
            const url = new URL(result.text);
            const code = url.searchParams.get("code");
            handleQROK(code);
        }
    };

    const handleQROK = async (code) => {
        try {
            await axios.post(`${url}/api/student/diem-danh`, {
                time: new Date(),
                code,
                studentId: JSON.parse(localStorage.getItem("user")).userId
            });
            setIsProcessing(false);
            setQrResult(null);
            setIsScanning(false);
            navigate("/thanh-cong");
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            setIsScanning(false);
        }
    };

    const handleError = (error) => {
        console.error(error);
    };

    const startScanning = () => {
        const codeReader = new BrowserMultiFormatReader();
        codeReader.decodeFromVideoDevice(null, 'video', handleScan)
            .catch(handleError);
    };

    useEffect(() => {
        getAllSession();
    }, []);

    const getAllSession = async () => {
        const id = JSON.parse(localStorage.getItem("user")).userId;
        try {
            const response = await axios.get(`${url}/api/admin/sessions/student?id=${id}`);
            const { data } = response;
            setSession(data);
        } catch (error) {
            console.log(error);
            alert("Không thể tải danh sách lớp học. Vui lòng thử lại sau.");
        }
    };

    const handleThamGia = async () => {
        setIsSucess(false);
        try {
            await axios.post(`${url}/api/admin/student/add`, {
                userId: JSON.parse(localStorage.getItem("user")).userId,
                maThamGia: maThamGia
            });
            setIsSucess(true);
            getAllSession();
        } catch (error) {
            console.log(error);
            alert("Không thể tham gia lớp học. Vui lòng kiểm tra lại mã tham gia.");
        }
    };

    return (
        <Page className="student-page">

            <Box className="group-container">
                {/* Nhập mã tham gia */}
                {
                    !isScanning && (
                        <Box className="join-class-container">
                            <Input
                                placeholder="Nhập mã tham gia"
                                value={maThamGia}
                                onChange={(e) => setMaThamGia(e.target.value)}
                                className="join-input"
                            />
                            <Button className="join-button" onClick={handleThamGia}>
                                Tham gia
                            </Button>
                        </Box>

                    )
                }



                {/* Danh sách lớp học */}
                {
                    !isScanning &&
                    (
                        <Box className="session-list">
                            {sesision.length > 0 ? (
                                sesision.map((item, index) => (
                                    <SessionCard s={item} key={index} />
                                ))
                            ) : (
                                <p>Không có buổi học nào.</p>
                            )}



                        </Box>
                    )
                }

                {
                    !isScanning &&
                    (
                        <Button
                            className="scan-button"
                            onClick={() => {
                                setIsScanning(true);
                                startScanning();
                            }}
                        >
                            Quét mã điểm danh
                        </Button>
                    )
                }
                {
                    !isScanning && (
                        <Button
                            className="account-button"
                            onClick={() => navigate("/account")}
                        >
                            Tài khoản
                        </Button>
                    )
                }



                {/* Quét QR */}
                {isScanning && (
                    <Box className="qr-container">
                        <ErrorBoundary>
                            <video id="video" width="100%" height="auto" />
                        </ErrorBoundary>
                        <Button
                            className="stop-scan-button"
                            onClick={() => setIsScanning(false)}
                        >
                            Tắt camera
                        </Button>
                    </Box>
                )}

                {/* Kết quả quét */}
                {qrResult && (
                    <p className="qr-result">
                        Kết quả quét: Điểm danh thành công
                    </p>
                )}
            </Box>
        </Page>
    );
};

export default StudentHome;
