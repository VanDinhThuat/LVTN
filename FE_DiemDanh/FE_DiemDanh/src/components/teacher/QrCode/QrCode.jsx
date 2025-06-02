import { useEffect, useState } from "react";
import { Button, Input, useSearchParams } from "zmp-ui";
import QRCode from "qrcode";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";
import "./Qrcode.scss";

const QrCode = () => {
    const [searchParams] = useSearchParams();
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [code, setCode] = useState('');
    const [mssv, setMssv] = useState('');
    const [isSuccess, setIsSuccess] = useState('');

    useEffect(() => {
        const queryCode = searchParams.get("code");
        if (queryCode) {
            setCode(queryCode);
        }
    }, [searchParams]);

    useEffect(() => {
        if (code) {
            generateQrCode();
        }
    }, [code]);

    const generateQrCode = async () => {
        try {
            const qrUrl = `http://localhost:3000/tham-gia?code=${code}`;
            const qr = await QRCode.toDataURL(qrUrl);
            setQrCodeUrl(qr);
        } catch (err) {
            console.error(err);
        }
    };

    const diemDanhThuCong = async () => {
        setIsSuccess('');
        try {
            await axios.post(`${url}/api/teacher/diemdanhsv`, {
                userId: mssv,
                code
            });
            setIsSuccess("Điểm danh thành công!");
        } catch (error) {
            console.error(error);
            setIsSuccess("Mã số sinh viên không hợp lệ.");
        }
    };

    return (
        <div className="qr-container">
            <h2>Quét mã điểm danh</h2>
            {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" className="img-code" />
            )}

            <div className="manual-checkin">
                <h2>Điểm danh thủ công</h2>
                <Input
                    label="Nhập mã số sinh viên"
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                />
                <Button variant="secondary" onClick={diemDanhThuCong}>
                    Điểm danh
                </Button>
                {isSuccess && (
                    <p className={`status-message ${isSuccess.includes("thành công") ? 'success' : 'error'}`}>
                        {isSuccess}
                    </p>
                )}
            </div>
        </div>
    );
};

export default QrCode;
