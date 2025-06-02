import { Page, useNavigate } from "zmp-ui"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Input, useLocation, useParams } from "zmp-ui"
import { url } from "../../../AppConfig/AppConfig"
import "./ClassDetails.scss"

const ClassDetails = () => {
    const location = useLocation()
    const [lop, setLop] = useState()
    const [tenLop, setTen] = useState()
    const [success, setSuccess] = useState(false)
    const [err, setErr] = useState("")
    const [del, setDel] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        getLopById()

    }, [])

    const getLopById = async () => {
        setSuccess(false)
        const searchParams = new URLSearchParams(location.search);
        try {
            const response = await axios.get(`${url}/api/admin/classId?id=${searchParams.get("id")}`)
            const { data } = response
            setLop(data)
            setTen(data.tenLop)

        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = async () => {
        setErr("")
        if (!tenLop.trim()) {
            setErr("Vui lòng điền vào tên lớp học")
            return
        }
        try {
            const searchParams = new URLSearchParams(location.search);

            const response = await axios.put(`${url}/api/admin/classes/${searchParams.get("id")}`, {
                classId: lop.maLop,
                className: tenLop
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

            const response = await axios.delete(`${url}/api/admin/classes/${searchParams.get("id")}`, {

            })
         navigate("/admin")

        } catch (error) {
            console.log(error);
            setErr("Lớp học này có sinh viên đang học")

        }
    }

    return (
        <Page>



            <div className="class-details">
                <h1 className="title">Thông tin lớp học</h1>
                {
                    lop &&
                    <div>
                        <Input value={lop.maLop} readOnly disabled />
                        <Input value={tenLop} onChange={(e) => setTen(e.target.value)} />
                    </div>
                }
                {
                    success &&
                    "Bạn đã update thành công"
                }
                {
                    err && <p className="text-red">{err}</p>
                }
                {
                    del &&
                    "Bạn đã xóa thành công"
                }
                <div className="btn">
                    <Button className="left" variant="secondary" onClick={handleUpdate}>Update</Button>
                    <Button variant="secondary" className="del" onClick={handleDel}>Delete</Button>
                </div>
            </div>

        </Page>
    )
}

export default ClassDetails