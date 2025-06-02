import { useEffect, useState } from "react";
import "./DiemDanh.scss";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";
import { useLocation, useNavigate } from "zmp-ui";

const DiemDanh = () => {
    const [list, setList] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const params = new URLSearchParams(location.search)


    useEffect(() => {
        getAll()
        
    }, [])
    

    const getAll = async () => {
        const params = new URLSearchParams(location.search)
        try {
            const response = await axios.get(`${url}/api/teacher/diem-danh-list?id=${params.get("id")}`)
            const { data } = response
            setList(data)

        } catch (error) {

        }
    }

    return (
        <div className="diem-danh-container">
            {list.length > 0 && list.map((item) => (
                <div onClick={()=>navigate(`/diemdanh-chitiet?id=${item.maDiemDanh}`)} className="diem-danh-box" key={item.maDiemDanh}>
                    <div className="box-header">
                        <span>Mã điểm danh: {item.maDiemDanh}</span>
                    </div>
                    <div className="box-body">
                        <p><strong>Mã code:</strong> {item.code}</p>
                        <p><strong>Thời gian hết hạn:</strong> {new Date(item.expiredAt).toLocaleString()}</p>
                        <p><strong>Thời gian tạo:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="box-footer">
                        <button className="diem-danh-btn">Xem chi tiết</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DiemDanh;
