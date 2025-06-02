import { Button, Input, Page, useNavigate } from "zmp-ui"
import "./CreateSubject.scss"
import { useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const CreateSubject = () => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    const [err, setErr] = useState(false)

    const handleCreate = async () => {
        setIsSuccess(false)
        setErr(false)
        if (!id.trim() || !name.trim()) {
            setErr(true)
            return
        }
        try {
            const response = await axios.post(`${url}/api/admin/subjects`, {
                "subjectId": id.trim(),
                "subjectName": name.trim()
            })
            navigate("/admin")
        } catch (error) {
            console.log(error);
            setErr(true)
        }
    }

    return (
        <Page>
            <div className="create-container">
                <h1 className="title">TẠO MÔN HỌC</h1>
                <div className="input-container">
                    <p>Mã môn</p>
                    <Input value={id} onChange={e => setId(e.target.value)} />
                </div>
                <div className="input-container">
                    <p>Tên môn</p>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                </div>
                
                {isSuccess && "Bạn đã thêm thành công"}
                {err && <p className="text-red">Mã không được trùng và tên không bỏ trống</p>}

                <Button className="btn-create" onClick={handleCreate}>TẠO</Button>
            </div>
        </Page>
    )
}

export default CreateSubject