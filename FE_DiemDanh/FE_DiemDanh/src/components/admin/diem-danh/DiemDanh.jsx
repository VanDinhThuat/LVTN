import { Box, Button, Input, Page } from "zmp-ui";
import { useState } from "react";
import axios from "axios";
import { url } from "../../../AppConfig/AppConfig";
import "./DiemDanh.scss";


const DiemDanhAdmin = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const filterDuplicates = (arr)=> {
    const seen = new Map();
  
    return arr.filter(item => {
      const key = `${item.studentId}-${item.className}-${item.date}`;
      if (seen.has(key)) {
        return false; 
      } else {
        seen.set(key, true);
        return true; 
      }
    });
  }
  


  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
  };

  const getDiemDanhByMSSV = async()=>{
    try {
        const response = await axios.get(`${url}/api/admin/attendance/history/student/${filterValue}`)
        const {data} = response
        setData(filterDuplicates(data))
        
        
    } catch (error) {
        console.log(error);
    }
  }

  const getDiemDanh = async(path)=>{
    try {
        const response = await axios.get(`${url}/api/admin/${path}/${filterValue}`)
        const {data} = response
        setData(filterDuplicates(data))
        
    } catch (error) {
        console.log(error);
        
    }
  }


  
  

  return (
    <Page className="diem-danh-admin">
      <Box className="filter-section">
        <Input
          placeholder="Nhập mã sinh viên, môn học, giảng viên..."
          value={filterValue}
          onChange={handleInputChange}
          clearable
        />
        <Box className="filter-buttons">
          <Button onClick={getDiemDanhByMSSV} size="small" variant="primary" >
            Theo sinh viên
          </Button>

          <Button onClick={()=>getDiemDanh("attendance/history/teacher")} size="small" variant="primary" >
            Theo giảng viên
          </Button>
          <Button size="small" variant="primary" onClick={() => getDiemDanh("attendance/history/room")}>
            Theo phòng học
          </Button>
        </Box>
      </Box>

      <Box className="attendance-table">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Họ tên SV</th>
              <th>Mã SV</th>
              <th>Môn học</th>
              <th>Giờ điểm danh</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 && data.map((item) => (
              <tr key={item.attendanceId}>
                <td>{item.date}</td>
                <td>{item.studentName}</td>
                <td>{item.studentId}</td>
                <td>{item.subjectName}</td>
                <td>{new Date(item.attendanceTime).toLocaleTimeString()}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Page>
  );
};

export default DiemDanhAdmin;
