import { Box, Button, Input, Page, useNavigate } from "zmp-ui"
import StudentCard from "../StudentCard/StudentCard"
import "./studentTable.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const StudentTable = () => {

    const [student, setStudent] = useState([])

    const navigate = useNavigate()
    useEffect(()=>{
        getStudent()
        
    }, [])

    const getStudent = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/users?role=student`)
            const { data } = response            
            setStudent(data)

        } catch (error) {
            console.log(error);

        }
    }

    return (
        <Page>
            <Box>
                <Box>
                    <Button className="btn-student" onClick={()=>navigate("/create-student")}>Thêm sinh viên</Button>
                </Box>
                <Box className="containerCard">
                    {
                        student.length > 0 &&
                        student.map((item, index)=>(<StudentCard student={item} key={index}/>))
                    }
                    
                  
                </Box>
            </Box>
        </Page>
    )
}

export default StudentTable