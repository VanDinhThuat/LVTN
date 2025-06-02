import { Button, Input, Page, Select, useNavigate } from "zmp-ui"
import "./CreateSesion.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"
const { OtpGroup, Option } = Select;

const days = ["Thu 2", "Thu 3", "Thu 4", "Thu 5", "Thu 6", "Thu 7"]

const CreateSession = () => {
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    const [err, setErr] = useState("")
    const [subId, setSubId] = useState("")
    const [room, setRoom] = useState([])
    const [roomId, setRoomId] = useState("")
    const [day, setDay] = useState(days[0])


    const [subject, setSubject] = useState([])

    useEffect(() => {
        getAllSubject()
        getAllRoom()
    }, [])

    const handleCreate = async () => {
        setIsSuccess(false)
        setErr(false)
        if (!start.trim() || !end.trim() || !subId.trim() || !roomId.trim()) {
            setErr("Vui lòng nhập đầy đủ thông tin")
            return
        }
        if (Number(start) < 0 || Number(end) < 0 || Number(end) - Number(start) < 3 || Number(end) > 10) {
            setErr("Số tiết không hợp lệ")
            return
        }
        const sub = subject.find((item) => (item.subjectId === subId))
        const r = room.find((item) => (item.roomId === roomId))

        const today = new Date()
        const formattedDate = today.toISOString().split('T')[0]

        try {
            const response = await axios.post(`${url}/api/admin/sessions`, {
                subjectId: sub.subjectId,
                subjectName: sub.subjectName,
                roomId: r.roomId,
                roomName: r.roomName,
                startPeriod: start,
                endPeriod: end,
                sessionId: 1,
                date: formattedDate,
                gvId: JSON.parse(localStorage.getItem("user")).userId,
                thu: day
            })
            navigate("/teacher")

        } catch (error) {
            setErr("Đã sảy ra lỗi")
        }
    }

    const getAllSubject = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/subjects`)
            const { data } = response
            setSubject(data)

        } catch (error) {

        }
    }

    const getAllRoom = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/rooms`)
            const { data } = response
            setRoom(data)


        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Page>
            <div className="create-container">
                <h1 className="title">TẠO BUỔI HỌC</h1>
                <div className="list-class">
                    <Select
                        label="Môn học"
                        placeholder="Môn học"
                        onChange={(value) => setSubId(value)}
                    >

                        <OtpGroup label="Group 1">
                            {
                                subject.length > 0 &&
                                subject.map((item, index) => (<Option value={item.subjectId} title={item.subjectName} />
                                ))
                            }
                        </OtpGroup>

                    </Select>
                </div>
                <div className="list-class">
                    <Select
                        label="Phòng học"
                        placeholder="Phòng học"
                        defaultValue="1"
                        onChange={(value) => setRoomId(value)}
                    >

                        <OtpGroup label="Group 1">
                            {
                                room.length > 0 &&
                                room.map((item, index) => (<Option value={item.roomId} title={item.roomName} />
                                ))
                            }
                        </OtpGroup>

                    </Select>
                </div>
                <div className="list-class">
                    <Select
                        label="Thứ"
                        placeholder="Thứ"
                        defaultValue="1"
                        onChange={(value) => setDay(value)}
                    >

                        <OtpGroup label="Group 1">
                            {
                                days.length > 0 &&
                                days.map((item, index) => (<Option value={item} title={item} />
                                ))
                            }
                        </OtpGroup>

                    </Select>
                </div>
                <div className="input-container">
                    <p>Tiết bắt đầu</p>
                    <Input value={start} type="number" onChange={e => setStart(e.target.value)} />
                </div>
                <div className="input-container">
                    <p>Tiết kết thúc</p>
                    <Input value={end} type="number" onChange={e => setEnd(e.target.value)} />
                </div>
                {isSuccess && "Bạn đã thêm thành công"}
                {err && <p className="text-red">{err && err}</p>}

                <Button className="btn-create" onClick={handleCreate}>TẠO</Button>
                <Button className="btn-create" onClick={() => navigate("/teacher")}>Quay lại Home</Button>

            </div>
        </Page>
    )
}

export default CreateSession