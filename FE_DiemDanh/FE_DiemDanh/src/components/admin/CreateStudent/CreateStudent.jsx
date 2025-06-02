import { Button, Input, Page, Select, useNavigate } from "zmp-ui"
import "./CreateStudent.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"
import React from "react";
const { OtpGroup, Option } = Select;


const CreateStudent = () => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    const [err, setErr] = useState("")
    const [classs, setClasss] = useState([])
    const [classId, setClassId] = useState("")

    useEffect(() => {
        getClass()
    }, [])

    const getClass = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/classes`)
            const { data } = response
            setClasss(data)

        } catch (error) {
            console.log(error);

        }
    }

  

    const isValidPhoneNumber = (phone) => {
        const regex = /^0\d{9}$/;
        return regex.test(phone);
    }
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }


    const handleCreate = async () => {
        setIsSuccess(false)
        setErr("")
        if (!id.trim() || !name.trim() || !phone.trim() || !email.trim() || !classId.trim()) {
            setErr("Vui lòng nhập đầy đủ thông tin")
            return
        }
        if (!isValidPhoneNumber(phone)) {
            setErr("Số điện thoại không hợp lệ")
            return
        }
      
        
        const lop = classs.find((item)=>(item.classId)===classId)
        


        try {
            const response = await axios.post(`${url}/api/admin/users`, {
                "userId": id,
                "fullName": name,
                email: email.trim(),
                phone: phone.trim(),
                role: "student",
                username: id.trim(),
                classId,
                className: lop.className
            })
           navigate("/admin")

        } catch (error) {
            console.log(error);
            setErr("Đã xảy ra lỗi, vui lòng thử lại sau")
        }
    }



    return (
        <Page>
            <div className="create-container">
                <h1 className="title">THÊM SINH VIÊN</h1>
                <div className="input-container">
                    <p>Mã sinh viên</p>
                    <Input value={id} onChange={e => setId(e.target.value)} />
                </div>
                <div className="input-container">
                    <p>Tên sinh viên</p>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="list-class">
                    <Select
                        label="Lớp học"
                        placeholder="Chọn lớp"
                        defaultValue="1"
                        onChange={(value) => setClassId(value)}
                    >
                        
                        <OtpGroup label="Group 1">
                            {
                                classs.length > 0 &&
                                classs.map((item, index) => (<Option value={item.classId} title={item.className} />
                                ))
                            }
                        </OtpGroup>

                    </Select>
                </div>
                

                <div className="input-container">
                    <p>Số điện thoại</p>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="input-container">
                    <p>Email</p>
                    <Input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {isSuccess && "Bạn đã thêm thành công"}
                {err && <p className="text-red">{err}</p>}

                <Button className="btn-create" onClick={handleCreate}>TẠO</Button>

            </div>
        </Page>
    )
}

export default CreateStudent