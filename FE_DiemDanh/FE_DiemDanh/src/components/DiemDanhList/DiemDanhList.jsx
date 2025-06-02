import { useEffect, useState } from "react";
import "./DiemDanhList.scss";
import axios from "axios";
import { url } from "../../AppConfig/AppConfig";
import { useLocation } from "zmp-ui";

const DiemDanhList = () => {
    const [list, setList] = useState([])
    const location = useLocation()

    useEffect(() => {
        getAllDiemDanh()
    }, [])

    const filterUniqueRecords = (data) => {
        const seen = new Set();
        const result = [];
      
        data.forEach(item => {
          const key = `${item.fullName}-${item.maDiemDanh}`;
          if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
          }
        });
      
        return result;
      }

    const getAllDiemDanh = async () => {
        const params = new URLSearchParams(location.search)
        try {
            const response = await axios.get(`${url}/api/student/diem-danh?userId=${JSON.parse(localStorage.getItem("user")).userId}&sessionId=${params.get("id")}`)
            const { data } = response
            
            setList(filterUniqueRecords(data))
        } catch (error) {
            console.log(error);

        }
    }

   
    return (
        <div className="diemdanh-container">
            <h2>Danh sách điểm danh</h2>
            <table className="diemdanh-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.length > 0 &&
                        list.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.fullName}</td>
                                <td>{item.time ? item.time.split("T")[0] : "—"}</td>
                                <td >
                                    {item.status}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default DiemDanhList;
