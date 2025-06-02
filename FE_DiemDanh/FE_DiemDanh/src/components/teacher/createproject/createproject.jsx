import { Button, Input, Page, Select, useNavigate } from "zmp-ui"
import "./createproject.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"
const { OtpGroup, Option } = Select;

const days = ["Thu 2", "Thu 3", "Thu 4", "Thu 5", "Thu 6", "Thu 7"]

const CreateProject = () => {
    const [startPeriod, setStartPeriod] = useState("")
    const [endPeriod, setEndPeriod] = useState("")
    const [ngayBatDau, setNgayBatDau] = useState("")
    const [ngayKetThuc, setNgayKetThuc] = useState("")
    const [soBuoi, setSoBuoi] = useState(1)
    const navigate = useNavigate()
    const [isSuccess, setIsSuccess] = useState(false)
    const [err, setErr] = useState("")
    const [subId, setSubId] = useState("")
    const [room, setRoom] = useState([])
    const [roomId, setRoomId] = useState("")
    const [day, setDay] = useState(days[0])
    const [maThamGia, setMaThamGia] = useState("")
    const [classes, setClasses] = useState([])
    const [selectedClasses, setSelectedClasses] = useState([])

    const [subject, setSubject] = useState([])

    useEffect(() => {
        getAllSubject()
        getAllRoom()
        getAllClasses()
        generateMaThamGia()
    }, [])

    const generateMaThamGia = () => {
        const randomCode = Math.random().toString(36).substr(2, 8).toUpperCase()
        setMaThamGia(randomCode)
    }

    const handleCreate = async () => {
        setIsSuccess(false)
        setErr("")
        
        if (!startPeriod.trim() || !endPeriod.trim() || !subId.trim() || !roomId.trim() || !ngayBatDau || !ngayKetThuc) {
            setErr("Vui lòng nhập đầy đủ thông tin")
            return
        }
        
        if (Number(startPeriod) < 1 || Number(endPeriod) < 1 || Number(endPeriod) - Number(startPeriod) < 0 || Number(endPeriod) > 10) {
            setErr("Số tiết không hợp lệ")
            return
        }
        
        if (soBuoi < 1) {
            setErr("Số buổi phải lớn hơn 0")
            return
        }
        
        if (new Date(ngayBatDau) >= new Date(ngayKetThuc)) {
            setErr("Ngày kết thúc phải sau ngày bắt đầu")
            return
        }

        const sub = subject.find((item) => (item.subjectId === subId))
        const r = room.find((item) => (item.roomId === roomId))

        try {
            const response = await axios.post(`${url}/api/admin/sessions`, {
                subjectId: sub.subjectId,
                subjectName: sub.subjectName,
                roomId: r.roomId,
                roomName: r.roomName,
                startPeriod: Number(startPeriod),
                endPeriod: Number(endPeriod),
                thu: day,
                maThamGia: maThamGia,
                gvId: JSON.parse(localStorage.getItem("user")).userId,
                ngayBatDau: ngayBatDau,
                ngayKetThuc: ngayKetThuc,
                soBuoi: Number(soBuoi),
                classIds: selectedClasses
            })
            setIsSuccess(true)
            setTimeout(() => {
                navigate("/teacher")
            }, 2000)

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErr(error.response.data.message)
            } else {
                setErr("Đã sảy ra lỗi")
            }
        }
    }

    const getAllSubject = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/subjects`)
            const { data } = response
            setSubject(data)

        } catch (error) {
            console.log("Error fetching subjects:", error)
        }
    }

    const getAllRoom = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/rooms`)
            const { data } = response
            setRoom(data)

        } catch (error) {
            console.log("Error fetching rooms:", error)
        }
    }

    const getAllClasses = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/classes`)
            const { data } = response
            setClasses(data)

        } catch (error) {
            console.log("Error fetching classes:", error)
        }
    }

    const handleClassSelection = (classId) => {
        setSelectedClasses(prev => {
            if (prev.includes(classId)) {
                return prev.filter(id => id !== classId)
            } else {
                return [...prev, classId]
            }
        })
    }

    return (
        <Page>
            <div className="create-container">
                <h1 className="title">TẠO DỰ ÁN HỌC TẬP</h1>
                
                <div className="list-class">
                    <Select
                        label="Môn học"
                        placeholder="Chọn môn học"
                        onChange={(value) => setSubId(value)}
                    >
                        <OtpGroup label="Danh sách môn học">
                            {
                                subject.length > 0 &&
                                subject.map((item, index) => (
                                    <Option key={index} value={item.subjectId} title={item.subjectName} />
                                ))
                            }
                        </OtpGroup>
                    </Select>
                </div>

                <div className="list-class">
                    <Select
                        label="Phòng học"
                        placeholder="Chọn phòng học"
                        onChange={(value) => setRoomId(value)}
                    >
                        <OtpGroup label="Danh sách phòng">
                            {
                                room.length > 0 &&
                                room.map((item, index) => (
                                    <Option key={index} value={item.roomId} title={item.roomName} />
                                ))
                            }
                        </OtpGroup>
                    </Select>
                </div>

                <div className="list-class">
                    <Select
                        label="Thứ"
                        placeholder="Chọn thứ"
                        defaultValue={days[0]}
                        onChange={(value) => setDay(value)}
                    >
                        <OtpGroup label="Thứ trong tuần">
                            {
                                days.map((item, index) => (
                                    <Option key={index} value={item} title={item} />
                                ))
                            }
                        </OtpGroup>
                    </Select>
                </div>

                <div className="input-container">
                    <p>Tiết bắt đầu</p>
                    <Input 
                        value={startPeriod} 
                        type="number" 
                        min="1"
                        max="10"
                        placeholder="Nhập tiết bắt đầu"
                        onChange={e => setStartPeriod(e.target.value)} 
                    />
                </div>

                <div className="input-container">
                    <p>Tiết kết thúc</p>
                    <Input 
                        value={endPeriod} 
                        type="number" 
                        min="1"
                        max="10"
                        placeholder="Nhập tiết kết thúc"
                        onChange={e => setEndPeriod(e.target.value)} 
                    />
                </div>

                <div className="input-container">
                    <p>Ngày bắt đầu</p>
                    <Input 
                        value={ngayBatDau} 
                        type="date" 
                        onChange={e => setNgayBatDau(e.target.value)} 
                    />
                </div>

                <div className="input-container">
                    <p>Ngày kết thúc</p>
                    <Input 
                        value={ngayKetThuc} 
                        type="date" 
                        onChange={e => setNgayKetThuc(e.target.value)} 
                    />
                </div>

                <div className="input-container">
                    <p>Số buổi</p>
                    <Input 
                        value={soBuoi} 
                        type="number" 
                        min="1"
                        placeholder="Nhập số buổi"
                        onChange={e => setSoBuoi(e.target.value)} 
                    />
                </div>

                <div className="input-container">
                    <p>Mã tham gia</p>
                    <div className="ma-tham-gia-container">
                        <Input 
                            value={maThamGia} 
                            readOnly
                            placeholder="Mã tham gia tự động"
                        />
                        <Button 
                            size="small" 
                            onClick={generateMaThamGia}
                        >
                            Tạo mới
                        </Button>
                    </div>
                </div>

                <div className="classes-selection">
                    <p>Chọn lớp học</p>
                    <div className="classes-grid">
                        {classes.map((cls, index) => (
                            <div key={index} className="class-item">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedClasses.includes(cls.classId)}
                                        onChange={() => handleClassSelection(cls.classId)}
                                    />
                                    <span>{cls.className}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {isSuccess && (
                    <p className="text-green">Bạn đã tạo dự án thành công! Đang chuyển hướng...</p>
                )}
                
                {err && <p className="text-red">{err}</p>}

                <div className="button-group">
                    <Button className="btn-create" onClick={handleCreate}>
                        TẠO DỰ ÁN
                    </Button>
                    <Button 
                        className="btn-cancel" 
                        onClick={() => navigate("/teacher")}
                    >
                        Quay lại Home
                    </Button>
                </div>
            </div>
        </Page>
    )
}

export default CreateProject