import { Button, Input, Page, Select, useNavigate } from "zmp-ui"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"
import React from "react";
const { OtpGroup, Option } = Select;


const CreateTeacher = () => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    const [err, setErr] = useState("")
    const [classId, setClassId] = useState("GV")  

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
        if (!id.trim() || !name.trim() || !phone.trim() || !email.trim()) {
            setErr("Vui lòng nhập đầy đủ thông tin")
            return
        }
        if (!isValidPhoneNumber(phone)) {
            setErr("Số điện thoại không hợp lệ")
            return
        }
        if (!email.trim()) {
            setErr("Email không hợp lệ")
            return
        }        


        try {
            const response = await axios.post(`${url}/api/admin/users`, {
                "userId": id.trim(),
                "fullName": name.trim(),
                email: email.trim(),
                phone:phone.trim(),
                role: "teacher",
                username: id,
                classId:null,
                className: null
            })
            navigate("/admin")

        } catch (error) {
            console.log(error);
            setErr("Giảng viên đã tồn tại(email, sdt, magv bị trùng)")
        }
    }



    return (
        <Page>
            <div className="create-container">
                <h1 className="title">THÊM GIẢNG VIÊN</h1>
                <div className="input-container">
                    <p>Mã giảng viên</p>
                    <Input value={id} onChange={e => setId(e.target.value)} />
                </div>
                <div className="input-container">
                    <p>Tên giảng viên</p>
                    <Input value={name} onChange={e => setName(e.target.value)} />
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

export default CreateTeacher