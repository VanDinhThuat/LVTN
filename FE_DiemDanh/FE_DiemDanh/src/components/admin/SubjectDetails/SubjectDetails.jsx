import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Input, useLocation, useNavigate, useParams } from "zmp-ui"
import { url } from "../../../AppConfig/AppConfig"

const SubjectDetails = () => {


    const location = useLocation()
    const [lop, setLop] = useState()
    const [tenLop, setTen] = useState()
    const [success, setSuccess] = useState(false)
    const [err, setErr]= useState("")
    const [del, setDel] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getLopById()

    }, [])

    const getLopById = async () => {
        setSuccess(false)
        const searchParams = new URLSearchParams(location.search);
        try {
            const response = await axios.get(`${url}/api/admin/subjects/id?id=${searchParams.get("id")}`)
            const { data } = response
            setLop(data)
            setTen(data.tenMonHoc)
            
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = async () => {
        setErr("")
        if(!tenLop.trim()){
            setErr("Vui lòng điền vào tên môn học")
            return
        }
        try {
            const searchParams = new URLSearchParams(location.search);

            const response = await axios.put(`${url}/api/admin/subjects/${searchParams.get("id")}`, {
                subjectId: lop.maLop,
                subjectName: tenLop
            })
            navigate("/admin")


        } catch (error) {
            console.log(error);
            setErr("Đã xảy ra lỗi vui lòng thử lại sau")

        }
    }

    const handleDel = async () => {
            setDel(false)
        try {
            const searchParams = new URLSearchParams(location.search);

            const response = await axios.delete(`${url}/api/admin/subjects/${searchParams.get("id")}`, {
                classId: lop.maLop,
                className: tenLop
            })
           navigate("/admin")

        } catch (error) {
            console.log(error);
            setErr("Môn học này có sinh viên đang học")

        }
    }

    return (
        <div className="class-details">
            <h1 className="title">Thông tin môn học</h1>
            {
                lop &&
                <div>
                    <Input value={lop.maMonHoc} disabled readOnly />
                    <Input value={tenLop} onChange={(e) => setTen(e.target.value)} />
                </div>
            }
            {
                success &&
                "Bạn đã update thành công"
            }
            {
                err && err
            }
            {
                del &&
                "Bạn đã xóa thành công"
            }
            <div>
                <Button variant="secondary" onClick={handleUpdate}>Update</Button>
                <Button variant="secondary" className="del mt" onClick={handleDel}>Delete</Button>
            </div>
        </div>
    )
}

export default SubjectDetails