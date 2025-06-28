import { Box, Button, Input, Page, useNavigate, List, Text } from "zmp-ui";
import { useEffect, useState } from "react";
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from "axios";
import { url } from "../../AppConfig/AppConfig";
import SessionCard from "../teacher/SessionCard/SessionCard";
import "./student.scss";
import ErrorBoundary from "../ErrorBoudary/ErrorBoudary";

const StudentHome = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'projects'
    const [maThamGia, setMaThamGia] = useState("");
    const [maDoAn, setMaDoAn] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [qrResult, setQrResult] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [err,setErr] = useState("")

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
           const response = await axios.post(`${url}/api/student/diem-danh`, {
                time: new Date(),
                code,
                studentId: JSON.parse(localStorage.getItem("user")).userId
            });
            setIsProcessing(false);
            setQrResult(null);
            
           
            if (response.data === "Điểm danh thành công"){
                setIsScanning(false);
                navigate("/thanh-cong")
            }
            else if(response.data === "Đã quá thời gian điểm danh (6 phút). Không thể điểm danh."){
                setErr("Quá thời gian điểm danh")
            }
            else{
                setErr("Bạn đã điểm danh rồi")
            }
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
        setQrResult(null);
        setIsProcessing(false);
        setIsScanning(false);
        getAllSessions();
        getAllProjects();
    }, []);

    const getAllSessions = async () => {
        const id = JSON.parse(localStorage.getItem("user")).userId;
        try {
            const response = await axios.get(`${url}/api/admin/sessions/student?id=${id}`);
            const { data } = response;
            setSessions(data);
        } catch (error) {
            console.log(error);
            alert("Không thể tải danh sách lớp học. Vui lòng thử lại sau.");
        }
    };

    const getAllProjects = async () => {
        const id = JSON.parse(localStorage.getItem("user")).userId;
        try {
            const response = await axios.get(`${url}/api/lop-do-an/student?id=${id}`);
            const { data } = response;
            setProjects(data);
        } catch (error) {
            console.log(error);
            alert("Không thể tải danh sách đồ án. Vui lòng thử lại sau.");
        }
    };

    const handleThamGia = async () => {
        setIsSuccess(false);
        try {
            await axios.post(`${url}/api/admin/student/add`, {
                userId: JSON.parse(localStorage.getItem("user")).userId,
                maThamGia: maThamGia
            });
            setIsSuccess(true);
            getAllSessions();
            setMaThamGia("");
        } catch (error) {
            console.log(error);
            alert("Không thể tham gia lớp học. Vui lòng kiểm tra lại mã tham gia.");
        }
    };

    const handleThamGiaDoAn = async () => {
        setIsSuccess(false);
        try {
            await axios.post(`${url}/api/lop-do-an/student/add`, {
                userId: JSON.parse(localStorage.getItem("user")).userId,
                maThamGia: maDoAn
            });
            setIsSuccess(true);
            getAllProjects();
            setMaDoAn("");
        } catch (error) {
            console.log(error);
            alert("Không thể tham gia nhóm đồ án. Vui lòng kiểm tra lại mã nhóm.");
        }
    };

    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                setIsSuccess(false);
            }, 1000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [isSuccess]);

    const handleSelectClass = (project) => {
    navigate(`/quan-ly-nhom?maBuoiHoc=${project.maLopDoAn}`);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ProjectCard = ({ project }) => (
        <List.Item
            key={project.maLopDoAn}
            onClick={() => handleSelectClass(project)}
            className="cursor-pointer hover:bg-blue-50 transition-colors duration-200 project-card-compact"
            title={
                <Box className="project-card-content">
                    <Box className="flex justify-between items-start mb-1">
                        <Text size="small" bold className="text-blue-600 truncate">
                            📚 {project.tenLopDoAn}
                        </Text>
                    </Box>
                    
                    {project.ghiChu && (
                        <Box className="bg-gray-50 p-2 rounded-lg mb-2 border border-gray-200">
                            <Text size="xSmall" className="text-gray-600 italic truncate-multi-line">
                                📝 {project.ghiChu}
                            </Text>
                        </Box>
                    )}
                    
                    <Box className="grid grid-cols-2 gap-2 text-xs">
                        <Box>
                            <Text size="xSmall" className="text-gray-500">
                                🗓️ Bắt đầu: {formatDate(project.thoiGianBatDau)}
                            </Text>
                            <Text size="xSmall" className="text-gray-500">
                                🗓️ Kết thúc: {formatDate(project.thoiGianKetThuc)}
                            </Text>
                        </Box>
                        <Box>
                            <Text size="xSmall" className="text-gray-500">
                                📋 Mã tham gia: {project.maThamGia || 'Chưa có'}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            }
            suffix={
                <Box className="text-center">
                    <Text size="xSmall" className="text-blue-500 font-semibold">
                        Xem chi tiết →
                    </Text>
                </Box>
            }
        />
    );

    return (
        <Page className="student-page" header={{ title: "My App", leftButton: "none" }}>
            
            {err && (
                <div className="error-alert">
                    <span className="error-icon">⚠️</span>
                    <span className="error-text">{err}</span>
                </div>
            )}
            {!isScanning && (
                <Box className="tab-container">
                    <Box className="tab-buttons">
                        <Button
                            className={`tab-button ${activeTab === 'sessions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('sessions')}
                        >
                            Buổi học ({sessions.length})
                        </Button>
                        <Button
                            className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => setActiveTab('projects')}
                        >
                            Đồ án ({projects.length})
                        </Button>
                    </Box>

                    <Box className="tab-content">
                        {activeTab === 'sessions' && (
                            <Box className="sessions-tab">
                                {/* Tham gia lớp học */}
                                <Box className="join-section">
                                        {/* Simplified join form */}
                                        <Input
                                            placeholder="Nhập mã tham gia lớp học"
                                            value={maThamGia}
                                            onChange={(e) => setMaThamGia(e.target.value)}
                                            className="join-input"
                                        />
                                        <Button 
                                            className="join-button" 
                                            onClick={handleThamGia}
                                            disabled={!maThamGia.trim()}
                                        >
                                            Tham gia
                                        </Button>
                                </Box>

                                {/* Danh sách buổi học */}
                                <Box className="content-section">
                                    <h3>Danh sách buổi học</h3>
                                    <Box className="session-list">
                                        {sessions.length > 0 ? (
                                            sessions.map((item, index) => (
                                                <SessionCard 
                                                    s={item} 
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <Box className="empty-state">
                                                <p>Chưa có buổi học nào.</p>
                                                <p>Sử dụng mã tham gia để tham gia lớp học mới.</p>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {/* Nút quét QR */}
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
                             
                            </Box>
                        )}

                        {activeTab === 'projects' && (
                            <Box className="projects-tab">
                                {/* Tham gia đồ án */}
                                <Box className="join-section">
                                        {/* Simplified join form */}
                                        <Input
                                            placeholder="Nhập mã nhóm đồ án"
                                            value={maDoAn}
                                            onChange={(e) => setMaDoAn(e.target.value)}
                                            className="join-input"
                                        />
                                        <Button 
                                            className="join-button" 
                                            onClick={handleThamGiaDoAn}
                                            disabled={!maDoAn.trim()}
                                        >
                                            Tham gia
                                        </Button>
                                </Box>

                                {/* Danh sách đồ án */}
                                <Box className="content-section">
                                    <h3>Danh sách đồ án</h3>
                                    <Box className="project-list">
                                        {projects.length > 0 ? (
                                            projects.map((project, index) => (
                                                <ProjectCard 
                                                    project={project} 
                                                    key={index}
                                                />
                                            ))
                                        ) : (
                                            <Box className="empty-state">
                                                <p>Chưa tham gia nhóm đồ án nào.</p>
                                                <p>Sử dụng mã nhóm để tham gia đồ án mới.</p>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            
            {isScanning && (
                <Box className="qr-scanner-container">
                    <Box className="qr-header">
                        <h3>Quét mã điểm danh</h3>
                        <Button
                            className="close-scanner-button"
                            onClick={() => setIsScanning(false)}
                            size="small"
                        >
                            ✕
                        </Button>
                    </Box>
                    <Box className="qr-content">
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
                </Box>
            )}

            {/* QR Result
            {qrResult && (
                <Box className="qr-result-container">
                    <p className="qr-result">
                        ✅ Điểm danh thành công!
                    </p>
                </Box>
            )} */}

            {/* Success Message */}
            {isSuccess && (
                <Box className="success-message">
                    <p>✅ Tham gia thành công!</p>
                </Box>
            )}
        </Page>
    );
};

export default StudentHome;