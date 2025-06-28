import { useEffect, useState } from "react";
import "./diemdanhdt.scss"
import { url } from "../../../AppConfig/AppConfig";
import axios from "axios";

const DiemDanhDetails = () => {
    const [list, setList] = useState([])

    useEffect(() => {
        getAll()

    }, [])

    const getAll = async () => {
        const params = new URLSearchParams(location.search)
        try {
            const response = await axios.get(`${url}/api/teacher/diemdanh-chitiet?id=${params.get("id")}`)
            const { data } = response
            setList(data)
            console.log(data);


        } catch (error) {

        }
    }

    return (
        <div className="diemdanh-details">
            <h2>Chi tiết điểm danh</h2>
            <div className="table-wrapper">
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Mã sinh viên</th>
                            <th>Tên sinh viên</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dữ liệu sẽ map ở đây */}
                        {
                            list.length > 0 && list.map((item, index) =>
                            (
                                <tr>
                                    <td>{item.maNguoiDung}</td>
                                    <td>{item.tenNguoiDung}</td>
                                    <td>
                                        {
                                            item.status
                                        }
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DiemDanhDetails;
