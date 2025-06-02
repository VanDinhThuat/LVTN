import { Box, Button, Input, Page, useNavigate } from "zmp-ui"
import SubjectCard from "../SubjectCard/SubjectCard"
import "./subjectTable.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const SubjectTable = () => {

    const [subject, setSubject] = useState([])

    useEffect(()=>{
        getAllSubject()
    }, [])

    const getAllSubject = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/subjects`)
            const {data} = response
            setSubject(data)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const navigate = useNavigate()

    return (
        <Page>
            <Box className="subjectTableContainer">
                <Box>
                    <div className="btn-container">
                        <Button className="btn-create" onClick={() => navigate("/create-subject")}>Tạo môn học</Button>
                    </div>
                </Box>
                <Box className="subjectCard">
                    {
                        subject && 
                        subject.map((item, index)=>(<SubjectCard s={item} key={index}/>))
                    }
                    
                    
                </Box>
            </Box>
        </Page>
    )
}

export default SubjectTable