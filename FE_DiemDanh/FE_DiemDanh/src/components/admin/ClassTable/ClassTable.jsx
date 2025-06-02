import { Box, Button, Input, Page, useNavigate } from "zmp-ui"
import ClassCard from "../ClassCard/ClassCard"
import "./classTable.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"

const ClassTable = () => {

    const [classs, setClasss] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
        getAllClass()
    }, [])

    const getAllClass = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/classes`)
            
            const {data} = response
            setClasss(data)
            
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <Page>
            <Box>
                <Button className="btn-taolophoc" onClick={()=>navigate("/create-class")}>Tạo lớp học</Button>
            </Box>
            <Box className="classTableContainer">
                
                {classs && classs.map((item, index)=>(<ClassCard classs={item} key={index}/>))}
            </Box>

        </Page>
    )
}

export default ClassTable